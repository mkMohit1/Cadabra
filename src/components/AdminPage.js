import React, { useState, useEffect, useMemo } from 'react';
import { Search, Edit, Trash } from 'lucide-react';
import '../styles/AdminPage.scss';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    type: '',
    loginWith:'WhatsApp'
  });
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [updatedSaleAdminId, setUpdatedSaleAdminId] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    type: ''
  });

  useEffect(() => {
    if (currentUser) {
      fetchAdmins();
    }
  }, [currentUser]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`http://localhost:5000/admin/getAdmins/${currentUser.mobileNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to fetch admins');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter(admin =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.mobileNumber.includes(searchTerm) ||
      admin.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [admins, searchTerm]);

  const handleReset = () => {
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newAdmin = {
      ...formData,
      supperAdminID: currentUser.userID // Ensure to pass this correctly
    };
  
    try {
      const response = await fetch('http://localhost:5000/admin/addAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to add new admin: ${errorData.error || 'Unknown error'}`);
        return;
      }
  
      const data = await response.json();
      toast.success('New admin added successfully');
      setAdmins((prevAdmins) => [...prevAdmins, data.newUser]); // Use the newUser from the response
      setFormData({ name: '', email: '', mobileNumber: '', type: '' });
      setShowModal(false);
  
    } catch (error) {
      toast.error('Error adding admin');
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/deleteAdmin/${type}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAdmins((prevAdmins) => prevAdmins.filter(admin => admin._id !== id));
        toast.success('Admin deleted successfully');
      } else {
        const errorData = await response.json();
        toast.error(`Error while deleting the admin: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Error while deleting the admin');
      console.error('Error in handleDelete:', error);
    }
  };

  const handleUpdateClick = (admin) => {
    setSelectedAdmin(admin);
    setUpdateFormData({
      name: admin.name,
      email: admin.email,
      mobileNumber: admin.mobileNumber,
      type: admin.type
    });
    setShowUpdateModal(true);
  };

  const handleUpdateInputChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/admin/updateAdmin/${selectedAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...updateFormData,
          supperAdminID: currentUser.userID
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update admin');
      }

      const updatedAdmin = await response.json();
      setAdmins((prevAdmins) =>
        prevAdmins.map(admin =>
          admin._id === selectedAdmin._id ? updatedAdmin : admin
        )
      );
      
      toast.success('Admin updated successfully');
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Failed to update admin');
    }
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const confirmDeleteAdmin = async () => {
    if (adminToDelete) {
      await handleDelete(adminToDelete._id, adminToDelete.type);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Operators</h1>
        <button className="add-admin-btn" onClick={() => setShowModal(true)}>
          Add New Admin
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
            {filteredAdmins.map(admin => (
              <tr key={admin._id}>
                <td>{admin.name}</td>
                <td>{admin.mobileNumber}</td>
                <td>{admin.email}</td>
                <td>{admin.type}</td>
                <td>
                  {admin.name === 'Default Product Admin' || admin.name === 'Default Sale Admin' ? null :
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleUpdateClick(admin)}>
                        <Edit size={16} />
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteClick(admin)}>
                        <Trash size={16} />
                      </button>
                    </div>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Admin</h2>
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
                <label>Admin Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="ProductAdmin">Product Admin</option>
                  <option value="SaleAdmin">Sale Admin</option>
                </select>
              </div>
              <div className="btn-NewAdmin">
                <button type="submit" className="add-admin-btn">Save Admin</button>
                <button onClick={() => setShowModal(false)} className="add-admin-btn">Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update Admin</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={updateFormData.name}
                  onChange={handleUpdateInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={updateFormData.email}
                  onChange={handleUpdateInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={updateFormData.mobileNumber}
                  onChange={handleUpdateInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Admin Type</label>
                <select name="type" value={updateFormData.type} disabled>
                  <option value="SaleAdmin">Sale Admin</option>
                  <option value="ProductAdmin">Product Admin</option>
                </select>
              </div>
              <div className="btn-UpdateAdmin">
                <button type="submit" className="add-admin-btn">Update Admin</button>
                <button onClick={() => setShowUpdateModal(false)} className="add-admin-btn">Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal modal-delete">
            <h2>Are you sure you want to delete this admin?</h2>
            <div className="btn-delete">
              <button onClick={confirmDeleteAdmin} className="add-admin-btn">Yes</button>
              <button onClick={() => setShowDeleteModal(false)} className="add-admin-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
