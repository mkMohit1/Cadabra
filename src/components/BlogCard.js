import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateBlogCoverTop } from "../redux/blogSlice";
import { faEdit, faHeart, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";

const BlogCard = ({ blog, handleBlogEdit }) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);
  const updatedBlog = blogs.find((b) => b._id === blog._id) || {};

  const handleUpdateOnCoverTop = () => {
    if (blog.isOnCoverTop === 'yes') {
      return;
    }
    const updatedStatus = blog.isOnCoverTop === "no" ? "yes" : blog.isOnCoverTop;
    dispatch(updateBlogCoverTop({ blogId: blog._id, isOnCoverTop: updatedStatus }));
  };

  const handleDeleteBlog = async (blogId) => {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/deleteBlog/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        successToast('Blog deleted successfully');
        //Optionally, you can refetch the products list after deletion
      } else {
        errorToast('Failed to delete blog');
      }
    };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col p-3 sm:p-4 gap-2">
        <div className="w-full h-48 lg:h-fit flex-shrink-0">
          <img
            src={`${process.env.REACT_APP_BACK_URL}${updatedBlog?.coverImage || ""}`}
            alt={updatedBlog?.title || "Blog Thumbnail"}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0 relative group">
          <div className="flex items-center justify-between mb-1">
            <p className="text-gray-500 text-sm truncate">
              {updatedBlog?.tags}
            </p>
            <button
              className={`p-2 rounded-full hover:bg-gray-50 ${
                updatedBlog?.isOnCoverTop === "yes" ? "text-red-500" : "text-gray-400"
              }`}
              onClick={handleUpdateOnCoverTop}
              aria-label="Toggle favorite"
            >
              <FontAwesomeIcon icon={faHeart} className="text-xl" />
            </button>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {updatedBlog?.title}
          </h3>

          <p className="text-gray-700 text-[12px] mb-2 line-clamp-2">
            {updatedBlog?.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center flex-row space-x-2">
              <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
              <div>
              <span className="text-gray-600">{updatedBlog?.rating || "3.2"}</span>
              <span className="text-gray-500">
                ({updatedBlog?.reviews || "96"} reviews)
              </span>
              </div> 
            </div>
          </div>

          <div className="flex flex-wrap items-center  gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
            <span className="flex items-center">
              📍 {updatedBlog?.author}
            </span>
            <span className="flex items-center">
              {updatedBlog?.category}
            </span>
            <span className="flex items-center">
              📶 Free Wifi
            </span>
          </div>
          <div className="absolute w-full bg-black h-[80%] bottom-0 opacity-70 hidden group-hover:flex flex-row justify-center gap-5">
              <button className="text-white text-2xl" onClick={() => handleBlogEdit(blog)}><FontAwesomeIcon icon={faPenToSquare}/></button>
              <button className="text-white text-2xl" onClick={() => handleDeleteBlog(blog._id)}><FontAwesomeIcon icon={faTrash}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
