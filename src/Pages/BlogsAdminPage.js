import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../redux/blogSlice";
import BlogForm from "../components/Blog/BlogForm";
import BlogList from "../components/Blog/BlogList";

const BlogsAdminPage = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);
  const currentUser = useSelector((state) => state.auth.user);
  const [BlogToEdit, setBlogToEdit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(()=>{
    dispatch(fetchBlogs());
  },[]);

  const handleBlogEdit=(blog)=>{
    setBlogToEdit(blog);
    console.log("mksdfs",blog);
    setShowCreateForm(true);
  }

  
  return (
    <div className="min-h-screen bg-gray-50">
      {!showCreateForm ?(
        <BlogList
          blogs={blogs}
          onNewBlog={() => { setBlogToEdit(null); setShowCreateForm(true); }} 
          handleBlogEdit={handleBlogEdit} 
          loading={loading}
        />)
        :
       (
        <BlogForm //Blog Form Modal  
        onCancel={() => setShowCreateForm(false)} 
        blog={BlogToEdit} 
        setShowCreateForm={setShowCreateForm} 
        fetchBlogs={fetchBlogs} 
        userID={currentUser._id}
        />
        )
      }  
    </div>
  );
};

export default BlogsAdminPage;