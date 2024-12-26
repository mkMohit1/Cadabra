import React, { useEffect, useState } from 'react';
import { Search, Edit, Trash } from 'lucide-react';
import '../styles/AdminPage.scss';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const SaleAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState([]); // Ideally, fetch this data from an API
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    type: 'SaleManager', // Default to 'SaleManager'
  });

  // Handle search term change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter admins based on search
  const filteredAdmins = admins && admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.phone.includes(searchTerm) ||
    admin.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset search field
  const handleReset = () => {
    setSearchTerm('');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Send the new admin to the backend
    try {
      const response = await fetch('https://server-lmhc.onrender.com/admin/addAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, supperAdminID: currentUser.userID }),
      });
      if (!response.ok) {
        toast.error('Failed to add new manager');
        return;
      }
      const data = await response.json();
      console.log(data);
        // Add new admin to the UI (this part is only for local display, adjust as needed)
    const newAdmin = {
        ...data.newUser
    };
    toast.success('New Manager added successfully');
    setAdmins([...admins, newAdmin]);
    } catch (error) {
      console.error('Failed to add new manager:', error);
      toast.error('Failed to add new manager');
    }
      
    setFormData({ name: '', email: '', mobileNumber: '', type: 'SaleManager' }); // Reset the form
    setShowModal(false);
  };

  // Handle delete action
  const handleDelete = async (id, type) => {
    try {
      console.log(id, type);
      const response = await fetch(`https://server-lmhc.onrender.com/admin/deleteAdmin/${type}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        toast.error('Failed to delete manager');
        return;
      }
      toast.success('Manager deleted successfully');
    
      // Filter out the deleted admin by _id (assuming _id is used as the unique identifier)
      setAdmins(admins.filter((admin) => admin._id !== id)); // Use _id for deletion
    } catch (error) {
      console.error('Failed to delete manager:', error);
      toast.error('Failed to delete manager');
    }
  };

  // Fetch Sale Manager from the backend

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`https://server-lmhc.onrender.com/admin/getAdmins/${currentUser.mobileNumber}`);
        if (!response.ok) {
          toast.error('Failed to fetch managers');
          return;
        }
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error('Failed to fetch managers:', error);
        toast.error('Failed to fetch managers');
      }
    };
    fetchAdmins();
  }, [currentUser.mobileNumber]);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Operators</h1>
        <button className="add-admin-btn" onClick={() => setShowModal(true)}>
          Add New Manager
        </button>
      </div>

      <div className="search-section">
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="search-icon" size={20} />
        </div>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {filteredAdmins && filteredAdmins.map((admin) => (
    <tr key={admin._id}> {/* Use _id for the key */}
      <td>{admin.name}</td>
      <td>{admin.mobileNumber}</td>
      <td>{admin.email}</td>
      <td>{admin.type}</td>
      <td>
        <div className="action-buttons">
          <button className="edit-btn">
            <Edit size={16} />
          </button>
          <button
            className="delete-btn"
            onClick={() => handleDelete(admin._id, admin.type)} // Pass _id to handleDelete
          >
            <Trash size={16} />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Sales Manager</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  disabled
                >
                  <option value="SaleManager">Sales Manager</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" >Add Sales Manager</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleAdmin;
