import React, {  useState, useEffect } from 'react';
import { Search, Edit, Trash } from 'lucide-react';
import '../styles/AdminPage.scss';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [showModal, setShowModal] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    type: ''
  });

   useEffect(() => {
      const fetchAdmins = async () => {
        try {
          const response = await fetch(`https://server-lmhc.onrender.com/admin/getAdmins/${currentUser.mobileNumber}`);
          if (!response.ok) {
            toast.error('Failed to fetch managers');
            return;
          }
          const data = await response.json();
          //console.log('Admins:', data);
          setAdmins(data);
        } catch (error) {
          console.error('Failed to fetch managers:', error);
          toast.error('Failed to fetch managers');
        }
      };
      fetchAdmins();
    },[]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.phone.includes(searchTerm) ||
    admin.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReset = () => {
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newAdmin = {
      id: admins.length + 1,
      ...formData
    };
    console.log(formData);
    const response = await fetch('https://server-lmhc.onrender.com/admin/addAdmin',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...formData, supperAdminID:currentUser.userID })
    });
    if(!response.ok) {
      toast.error('Failed to add new admin');
      return;
    }
      toast.success('New admin added successfully');
    setAdmins([...admins, newAdmin]);
    setFormData({ name: '', email: '', mobileNumber: '', type: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
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
              <tr key={admin.id}>
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
                      onClick={() => handleDelete(admin.id)}
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
                  <option value="SaleAdmin">Sales Admin</option>
                  <option value="ProductAdmin">Product Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;