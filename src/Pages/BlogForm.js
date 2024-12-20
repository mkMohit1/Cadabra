import React, { useRef, useState } from "react";
import "../styles/BlogForm.scss";
import JoditEditor from "jodit-react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const BlogForm = () => {
  const [currentForm, setCurrentForm] = useState("blog"); // Toggle between "blog" and "pdf"
  const [blogs, setBlogs] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    categories: "",
    blogImage: null,
    authorImage: null,
    content: "",
    pdfFile: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const editor = useRef(null);

  const handleChange = (e) => {
    if (e && e.target) {
      const { name, value, files } = e.target;
      if (name === "blogImage" || name === "authorImage" || name === "pdfFile") {
        setFormData({ ...formData, [name]: files[0] });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleEditorChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      if (currentForm === "blog") {
        const updatedBlogs = [...blogs];
        updatedBlogs[editIndex] = { ...formData, date: updatedBlogs[editIndex].date };
        setBlogs(updatedBlogs);
      } else {
        const updatedPdfs = [...pdfs];
        updatedPdfs[editIndex] = { ...formData, date: updatedPdfs[editIndex].date };
        setPdfs(updatedPdfs);
      }
      setIsEditing(false);
      setEditIndex(null);
    } else {
      const newData = {
        ...formData,
        date: new Date().toLocaleDateString(),
      };
      currentForm === "blog" ? setBlogs([...blogs, newData]) : setPdfs([...pdfs, newData]);
    }

    setFormData({
      title: "",
      authorName: "",
      categories: "",
      blogImage: null,
      authorImage: null,
      content: "",
      pdfFile: null,
    });

    const fileInputs = document.querySelectorAll("input[type='file']");
    fileInputs.forEach((input) => (input.value = ""));
  };

  const handleEdit = (index, type) => {
    const item = type === "blog" ? blogs[index] : pdfs[index];
    setFormData(item);
    setIsEditing(true);
    setEditIndex(index);
    setCurrentForm(type);
  };

  const handleDelete = (index, type) => {
    if (type === "blog") {
      setBlogs(blogs.filter((_, i) => i !== index));
    } else {
      setPdfs(pdfs.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="blog-form-container">
      <h1>{isEditing ? "Edit" : "Upload"} {currentForm === "blog" ? "Blog" : "PDF"}</h1>

      <div className="form-toggle">
        <button
          className={currentForm === "blog" ? "active" : ""}
          onClick={() => {
            setCurrentForm("blog");
            setFormData({
              title: "",
              authorName: "",
              categories: "",
              blogImage: null,
              authorImage: null,
              content: "",
              pdfFile: null,
            });
            setIsEditing(false);
          }}
        >
          Blog Uploader
        </button>
        <button
          className={currentForm === "pdf" ? "active" : ""}
          onClick={() => {
            setCurrentForm("pdf");
            setFormData({
              title: "",
              authorName: "",
              categories: "",
              blogImage: null,
              authorImage: null,
              content: "",
              pdfFile: null,
            });
            setIsEditing(false);
          }}
        >
          PDF Uploader
        </button>
      </div>

      <form className="blog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Author Name</label>
          <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Author Image</label>
          <input
            type="file"
            name="authorImage"
            accept="image/*"
            onChange={handleChange}
            required={!isEditing || !formData.authorImage}
          />
        </div>

        {currentForm === "blog" && (
          <>
            <JoditEditor
              ref={editor}
              value={formData.content || ""}
              onChange={handleEditorChange}
            />
            {console.log(formData.content)}
            <div className="form-group">
              <label>Categories</label>
              <input
                type="text"
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                placeholder="e.g., Technology, Health"
                required
              />
            </div>
            <div className="form-group">
              <label>Blog Image</label>
              <input
                type="file"
                name="blogImage"
                accept="image/*"
                onChange={handleChange}
                required={!isEditing || !formData.blogImage}
              />
            </div>
          </>
        )}

        {currentForm === "pdf" && (
          <div className="form-group">
            <label>PDF File</label>
            <input
              type="file"
              name="pdfFile"
              accept="application/pdf"
              onChange={handleChange}
              required={!isEditing || !formData.pdfFile}
            />
          </div>
        )}

        <button type="submit" className="submit-button">
          {isEditing ? "Update" : "Submit"}
        </button>
      </form>

      {blogs.length > 0 && (
        <div className="blogs-list">
          <h2>Blogs</h2>
          {blogs.map((blog, index) => (
            <div key={index} className="blog-item">
              <h3>{blog.title}</h3>
              <p><strong>Author:</strong> {blog.authorName}</p>
              <p><strong>Date:</strong> {blog.date}</p>
              <p><strong>Categories:</strong> {blog.categories}</p>
              <div className="content">
              <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
              </div>
              <div className="images">
                {blog.blogImage && (
                  <img src={URL.createObjectURL(blog.blogImage)} alt="Blog" />
                )}
                {blog.authorImage && (
                  <img src={URL.createObjectURL(blog.authorImage)} alt="Author" />
                )}
              </div>
              <div className="actions">
                <button onClick={() => handleEdit(index, "blog")}>Edit</button>
                <button onClick={() => handleDelete(index, "blog")}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pdfs.length > 0 && (
        <div className="pdfs-list">
          <h2>PDFs</h2>
          {pdfs.map((pdf, index) => (
            <div key={index} className="pdf-item">
              <h3>{pdf.title}</h3>
              <p><strong>Author:</strong> {pdf.authorName}</p>
              <p><strong>Date:</strong> {pdf.date}</p>
              <div className="images">
                {pdf.authorImage && (
                  <img src={URL.createObjectURL(pdf.authorImage)} alt="Author" />
                )}
              </div>
              <a
                href={URL.createObjectURL(pdf.pdfFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-link"
              >
                View PDF
              </a>
              <div className="actions">
                <button onClick={() => handleEdit(index, "pdf")}>Edit</button>
                <button onClick={() => handleDelete(index, "pdf")}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogForm;
