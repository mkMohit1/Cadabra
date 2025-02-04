import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState ={
    Blogs: [],
    loading: false,
    error: null
}

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs',async()=>{
    const response = await fetch('http://localhost:5000/blogs');
    if(!response.ok){
        throw new Error('Failed to fetch the blogs');
    }
    const data = await response.json();
    //console.log(data);
    return data;
});


export const updateBlogCoverTop = createAsyncThunk(
    'blogs/updateBlogCoverTop',
    async ({ blogId, isOnCoverTop }) => {
        console.log(blogId, isOnCoverTop);
      const response = await fetch(`http://localhost:5000/blogs/isOnCoverTop/${blogId}`, {
        method: 'PATCH', // assuming PATCH is used to update a single field
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isOnCoverTop, blogId}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update the blog');
      }
      const data = await response.json();
      console.log('abc',data);
      return data; // returning the updated blog data
    }
  ); 

const blogSlice =  createSlice({
    name: 'blogs',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(fetchBlogs.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fetchBlogs.fulfilled,(state,action)=>{
            state.loading = false;
            state.blogs = action.payload;
        })
        .addCase(fetchBlogs.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        // Handle updateBlogCoverTop
      .addCase(updateBlogCoverTop.fulfilled, (state, action) => {
        const updatedBlog = action.payload.updateBlog;  // Get the updated blog from payload
        const index = state.blogs.findIndex((blog) => blog._id === updatedBlog._id);
        if (index !== -1) {
          state.blogs[index] = updatedBlog;  // Update the specific blog in the state
        }
        const prevBlog = action.payload.previous;
        if (prevBlog) {
          const prevIndex = state.blogs.findIndex((blog) => blog._id === prevBlog._id);
          if (prevIndex !== -1) {
            state.blogs[prevIndex] = prevBlog;
          }
        }
        state.loading = false;
      })
      .addCase(updateBlogCoverTop.pending, (state) => {
        state.loading = true;  // Set loading to true when update starts
      })
      .addCase(updateBlogCoverTop.rejected, (state, action) => {
        state.loading = false;  // Set loading to false if update fails
        state.error = action.error.message;  // Store error message in state
      });
    },
});


export default blogSlice.reducer;