# Backend Contract & Deviations Notes

This file records specific observations and notes regarding the backend implementation in `Portfolio-backend/`.

1. **Forgot Password (`POST /auth/forgot-password`)**:
   - Backend returns `404 { success: false, message: "User does not exists" }` when email is not registered.
   - On valid email, sends link to `${FRONTEND_URL}/reset-password/${user._id}/${forgotToken}` with 5-minute expiry.

2. **Reset Password (`POST /auth/reset-password/:id/:token`)**:
   - Expects body `{ New_password, Confirm_password }`.
   - Returns `500` if token verification fails or is expired (`jwt.verify` throws error in try block).
   - Frontend must handle both 400 and 500 cleanly with a friendly "Invalid or expired link" message.

3. **OTP Generation & Verification**:
   - `POST /auth/generate-otp` expects `{ userId }`. Returns `400` if already verified, `404` if user not found.
   - `POST /auth/verify-otp` expects `{ userId, otpReceiver }`. Returns `400` if invalid OTP, `404` if expired.
   - User document `isVerified` becomes `true`.

4. **Comments Route**:
   - `GET /comment/get/:blogId` requires slash between get and blogId. Populates `userId` with `firstName lastName -_id`.
   - `POST /comment/post` requires `isAuth`. Expects `{ blogId, content }`. `userId` is obtained from `request.user._id`.

5. **Blogs Listing**:
   - `GET /blog/get-all`: If no blogs found, returns `200` with `{ success: true, message: "No blogs found" }` (NO `Blogs` array in response). Frontend must always handle `res.data.Blogs ?? []`.
   - `GET /blog/get/:blogId`: Increments `views` by 1 on each call.

6. **Tool Requests**:
   - `POST /request/tool-request`: `budget` must be cast to a Number.
   - `GET /request/get-requests`: Uses `request.user._id` from auth token. Returns `{ requests: [...] }`.
