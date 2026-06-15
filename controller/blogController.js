const Blog = require("../models/blog");

exports.getAllBlogs = async (request, response) => {
  try {
    const Blogs = await Blog.find().select("title thumbnail tag -_id");

    if (Blogs.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No blogs found",
      });
    }
    return response.status(200).json({
      Blogs: Blogs,
      success: true,
      message: "All blogs extracted successfully",
    });
  } catch (err) {
    return response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBlog = async (request, response) => {
  try {
    const { blogId } = request.params;
    const foundBlog = await Blog.findById(blogId);

    if (!foundBlog) {
      return response.status(404).json({
        success: false,
        message: "Invalid Blog id. Blog not found",
      });
    }
    return response.status(200).json({
      blogDetails: foundBlog,
      success: true,
      message: "Blog details fetched successfully",
    });
  } catch (err) {
    return response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
