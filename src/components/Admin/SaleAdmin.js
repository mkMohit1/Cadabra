import React, { useEffect, useState } from 'react';
import { Search, Edit, Trash } from 'lucide-react';
import '../../styles/AdminPage.scss';
import { useSelector } from 'react-redux';
import { infoToast,errorToast, successToast } from "../../DecryptoAndOther/ToastUpdate";

const SaleAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null); // To store the admin being edited
  const currentUser = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState([]); // List of all admins
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    type: currentUser.role=='SaleAdmin'?'SaleManager':'Installer', // Default to 'SaleManager'
  });

  // Handle search term change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter admins based on search
  const filteredAdmins = admins && admins.length>0 && admins.filter((admin) =>
    (admin.name && admin.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (admin.email && admin.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (admin.mobileNumber && admin.mobileNumber.includes(searchTerm)) ||
    (admin.role && admin.role.toLowerCase().includes(searchTerm.toLowerCase()))
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

  // Handle form submission (add or update admin)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // If editing an admin, update them
    if (editingAdmin) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/updateAdmin/${editingAdmin._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          errorToast(data.error || "Failed to update manager");
          return;
        }

        successToast('Manager updated successfully');
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin._id === editingAdmin._id ? { ...admin, ...formData } : admin
          )
        );

        // Reset form data and close modal
        setFormData({
          name: '',
          email: '',
          mobileNumber: '',
          type: currentUser.role=='SaleAdmin'?'SaleManager':'Installer',
        });
        setEditingAdmin(null);
        setShowModal(false);
      } catch (error) {
        console.error('Failed to update manager:', error);
        errorToast('Failed to update manager');
      }
    } else {
      // Add new admin
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/addAdmin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, supperAdminID: currentUser._id }),
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          errorToast(data.error || "Failed to add new manager/Installer");
          return;
        }

        successToast('New Manager/Installer added successfully');
        const newAdmin = { ...data.newSaleManager };
        setAdmins([...admins, newAdmin]);

        // Reset form data and close modal
        setFormData({
          name: '',
          email: '',
          mobileNumber: '',
          type: currentUser.role=='SaleAdmin'?'SaleManager':'Installer',
        });
        setShowModal(false);
      } catch (error) {
        console.error('Failed to add new manager:', error);
        errorToast('Failed to add new manager');
      }
    }
  };

  // Handle delete action
  const handleDelete = async (id, type) => {
    try {
      console.log(id, type);
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/deleteAdmin/${type}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        errorToast('Failed to delete manager');
        return;
      }
      successToast('Manager deleted successfully');
    
      // Filter out the deleted admin by _id (assuming _id is used as the unique identifier)
      setAdmins(admins.filter((admin) => admin._id !== id)); // Use _id for deletion
    } catch (error) {
      console.error('Failed to delete manager:', error);
      errorToast('Failed to delete manager');
    }
  };

  // Fetch Sale Manager from the backend
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/getAdmins/${currentUser.mobileNumber}`);
        if (!response.ok) {
          errorToast('Failed to fetch managers');
          return;
        }
        const data = await response.json();
        console.log("mknsds", data);
        if(currentUser.role =='SaleAdmin'){
          setAdmins(data.saleManagers);
        }else{
          setAdmins(data.Installer);
        }
        
      } catch (error) {
        console.error('Failed to fetch managers:', error);
        errorToast('Failed to fetch managers');
      }
    };
    fetchAdmins();
  }, [currentUser.mobileNumber, editingAdmin, admins]);

  // Open modal for editing
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    console.log(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      mobileNumber: admin.mobileNumber,
      type: admin.role,
    });
    setShowModal(true);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Operators</h1>
        <button className="add-admin-btn" onClick={() => setShowModal(true)}>
           {currentUser.role=='SaleAdmin'?'Add New Manager':'Add New Installer'}
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
              <tr key={admin._id}>
                <td>{admin.name}</td>
                <td>{admin.mobileNumber}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(admin)}>
                      <Edit size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(admin._id, admin.role)} // Pass _id to handleDelete
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
            <h2>{editingAdmin && currentUser.role =='SaleAdmin' ? 'Update Sales Manager' : !editingAdmin && currentUser.role =='SaleAdmin' ? 'Add Sales Manager': editingAdmin && currentUser.role =='InstallerAdmin'?'Update Installer':'Add Installer'}</h2>
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
                  {currentUser.role =='SaleAdmin'?<option value="SaleManager">Sales Manager</option>:<option value="Installer">Installer</option>}

                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">{editingAdmin && currentUser.role =='SaleAdmin'? 'Update Sales Manager' : !editingAdmin && currentUser.role =='SaleAdmin'? 'Add Sales Manager': editingAdmin && currentUser.role =='InstallerAdmin'?'Update Installer':'Add Installer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleAdmin;
