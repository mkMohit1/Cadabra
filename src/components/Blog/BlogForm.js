import React, { useRef, useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs } from "../../redux/blogSlice";
import { errorToast } from "../../DecryptoAndOther/ToastUpdate";

const BlogForm = ({ updateContainer, blog,userID, onCancel }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    description: "",
    content: "",
    category: "",
    coverImage: null,
    isOnCoverTop: "no",
    userImage: '',
    author: user.role
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, coverImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
        if (!formData.title || !formData.description || !formData.category || !formData.tags || !formData.content || !formData.coverImage) {
          errorToast("All fields are required, including the image.");
          console.log(formData);
          return;
        }

    // Create FormData for file upload
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append('userID', userID);
    console.log("BlogData", formData);
      try {
        const method = blog ? 'PUT' : 'POST';
        const url = blog ? `${process.env.REACT_APP_BACK_URL}/admin/updateBlog/${blog._id}` : `${process.env.REACT_APP_BACK_URL}/BlogPost`;
        console.log(method,url);
        const response = await fetch(url, { method, body: formDataToSend });
        const result = await response.json();

        if (response.ok) {
          toast.success("Blog posted successfully!");
          dispatch(fetchBlogs());
          setFormData({
            title: "",
            tags: "",
            description: "",
            content: "",
            category: "",
            coverImage: null,
            isOnCoverTop: "no",
            userImage: ''
          });
          navigate("/Blogs");
          updateContainer("Blogs");
        } else {
          toast.error(result.message || "Error posting blog.");
        }
      } catch (error) {
        toast.error("Error posting blog.");
      }
    
  };

  // Populate form fields when editing a blog
  useEffect(() => {
    if (blog) {
      setFormData((prev) => ({
        ...prev,  // Keep existing state
        title: blog.title || '',
        description: blog.description || '',
        category: blog.category || '',
        tags: blog.tags || '',
        author: blog.author || '',
        content: blog.content || '',
        coverImage: blog.coverImage || null, // Handle image separately
      }));
    }
  }, [blog]);

  const previewImage = formData.coverImage
  ? formData.coverImage instanceof File
    ? URL.createObjectURL(formData.coverImage)
    : `${process.env.REACT_APP_BACK_URL}${formData.coverImage}`
  : '';

  // useEffect(() => {
  //   const currentUser = async () => {
  //     const currentMobile = localStorage.getItem("loggedInUserMobileNumber");
  //     if (currentMobile) {
  //       try {
  //         const userResponse = await fetch(`https://server-lmhc.onrender.com/user/${currentMobile}`);
  //         const user = await userResponse.json();

  //         if (user) {
  //           setFormData((prevData) => ({
  //             ...prevData,
  //             author: user.name,
  //             userImage: user.userImage,
  //           }));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       }
  //     }
  //   };

  //   currentUser();
  //   console.log("dfsdfsdfsd",previewImage);
  // }, []);

console.log(formData);
  return (
    <div className="w-full max-w-5xl mx-auto p-5 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col  gap-8">
        <div className="flex-1 space-y-5">
          <div className="form-group">
            <label className="block text-lg font-bold text-gray-700 mb-2">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" className="w-full p-3 border border-gray-300 rounded" />
          </div>
          <div className="form-group">
            <label className="block text-lg font-bold text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" rows="5" className="w-full p-3 border border-gray-300 rounded"></textarea>
          </div>
          <div className="form-group">
            <label className="block text-lg font-bold text-gray-700 mb-2">Content</label>
            <ReactQuill
              value={formData.content}
              onChange={(value) => setFormData((prev) => ({
                ...prev,  // Preserve all previous values
                content: value, // Update only content
              }))}
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  ['link'],
                  [{ 'align': [] }],
                  ['image'],
                ],
              }}
              formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'align', 'image']}
            />
          </div>
          <div className="form-group">
            <label className="block text-lg font-bold text-gray-700 mb-2">Cover Image</label>
            <input type="file" name="coverImage" accept="image/*" onChange={handleImageChange} className="w-full p-3 border border-gray-300 rounded" />
            {previewImage && <img src={previewImage} alt="Cover" className="mt-3 rounded-lg w-48" />}
          </div>
        </div>
        <div className="w-full lg:w-1/3 space-y-5">
          <div className="form-group">
            <label className="block text-lg font-bold text-gray-700 mb-2">Tags</label>
            <select name="tags" value={formData.tags} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded">
              <option value="">Select Blog Tags</option>
              <option value="draft">Latest</option>
              <option value="published">Famous</option>
            </select>
          </div>
          <div className="form-group">
            <label className="block text-lg font-bold text-gray-700 mb-2">Blog Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded">
              <option value="">Select a Category</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="education">Education</option>
            </select>
          </div>
        </div>
        <div className="w-full flex justify-evenly mt-5">
          <button type="button" className="px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={onCancel}>Cancel</button>
          <button type="submit" className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">{blog?"Update":"Create"}</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BlogForm;
