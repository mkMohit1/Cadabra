import React, { useEffect, useState } from 'react';
import '../styles/CustomerManagement.scss';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const CustomerManagement = () => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false); // New state for editing
  const user = useSelector((state) => state.auth.user);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // To store selected customer

  // Fetch customers data
  const fetchCustomers = async () => {
    const response = await fetch(`http://localhost:5000/admin/getAdmins/${user.mobileNumber}`);
    if (response.ok) {
      const data = await response.json();
      setCustomers(data.customers);
    } else {
      const error = await response.json();
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Customer List Component
  const CustomerList = () => (
    <div className="customer-list">
      <div className="header">
        <h2>Customers</h2>
        <button className="add-customer-btn" onClick={() => setShowAddCustomer(true)}>
          Add Customer
        </button>
      </div>

      <div className="controls">
        <button className="reset-btn">Reset</button>
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Occupation</th>
              <th>Phone Number</th>
              <th>KYC Status</th>
              <th>View Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.addresses.occupation}</td>
                <td>{customer.mobileNumber}</td>
                <td>
                  <span className={`kyc-status ${customer.kycStatus ? 'verified' : 'pending'}`}>
                    {customer.kycStatus ? '✓' : '⭘'}
                  </span>
                </td>
                <td>
                  <button
                    className="detail-btn"
                    onClick={() => setSelectedCustomer(customer)} // Set selected customer when clicking 'View Details'
                  >
                    Detail
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => { setSelectedCustomer(customer); setShowEditCustomer(true); }}>✏️</button>
                    <button className="delete-btn">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Customer Detail Component - This will display when a customer is selected
  const CustomerDetail = ({ customer }) => (
    <div className="customer-detail">
      <h2>Customer Details</h2>
      <button onClick={() => setSelectedCustomer(null)}>Back to List</button>

      <div className="detail-info">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Occupation:</strong> {customer.occupation}</p>
        <p><strong>Phone Number:</strong> {customer.mobileNumber}</p>
        <p><strong>KYC Status:</strong> {customer.kycStatus ? 'Verified' : 'Pending'}</p>
        <h3>Address</h3>
        <p><strong>Address Type:</strong> {customer.addressType}</p>
        <p><strong>Street:</strong> {customer.street}</p>
        <p><strong>City:</strong> {customer.district}</p>
        <p><strong>State:</strong> {customer.state}</p>
        <p><strong>Zip Code:</strong> {customer.zipCode}</p>
      </div>
    </div>
  );

  // Edit Customer Form Component
  const EditCustomerForm = ({ customer, setShowEditCustomer }) => {
    const [updatedCustomerData, setUpdatedCustomerData] = useState({
      name: customer.name,
      email: customer.email,
      occupation: customer.occupation,
      mobileNumber: customer.mobileNumber,
      addressType: customer.addressType,
      street: customer.street,
      district: customer.district,
      zipCode: customer.zipCode,
      state: customer.state,
    });

    // Handle input change
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUpdatedCustomerData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    // Handle customer update
    const handleUpdateCustomer = async (e) => {
      e.preventDefault();
      const response = await fetch(`http://localhost:5000/admin/updateCustomer/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedCustomerData }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setShowEditCustomer(false); // Close the edit form after update
        fetchCustomers(); // Refresh customer list
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    };

    return (
      <div className="edit-customer-form">
        <div className="header">
          <h2>Edit Customer</h2>
          <button
            className="back-btn"
            onClick={() => setShowEditCustomer(false)} // Close edit form
          >
            Back
          </button>
        </div>

        <form onSubmit={handleUpdateCustomer}>
          <div className="form-content">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={updatedCustomerData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={updatedCustomerData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={updatedCustomerData.occupation}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={updatedCustomerData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Address Type</label>
                <input
                  type="text"
                  name="addressType"
                  value={updatedCustomerData.addressType}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={updatedCustomerData.street}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>District</label>
                <input
                  type="text"
                  name="district"
                  value={updatedCustomerData.district}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={updatedCustomerData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={updatedCustomerData.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="update-btn">Update</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowEditCustomer(false)} // Cancel edit
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="customer-management">
      {showAddCustomer ? (
        <AddCustomerForm setShowAddCustomer={setShowAddCustomer} />
      ) : showEditCustomer ? (
        <EditCustomerForm
          customer={selectedCustomer}
          setShowEditCustomer={setShowEditCustomer}
        />
      ) : selectedCustomer ? (
        <CustomerDetail customer={selectedCustomer} />
      ) : (
        <CustomerList />
      )}
    </div>
  );
};

export default CustomerManagement;
