import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — try refresh, else redirect to login
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Endpoints where a 401/419 means "bad credentials" or "not logged in yet",
// NOT "session expired" — so we must NOT trigger refresh/redirect logic here.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

const isAuthEndpoint = (url = "") =>
  AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const skipAuthHandling = isAuthEndpoint(originalRequest?.url);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !skipAuthHandling
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("http://localhost:3000/api/auth/refresh", {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefresh } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Token reuse detected
    if (error.response?.status === 419 && !skipAuthHandling) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;