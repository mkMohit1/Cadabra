import React, { useState } from 'react';
import '../styles/CustomerManagement.scss';

const CustomerManagement = () => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Hitesh Dhawan', occupation: 'Business', phone: '9871146105', kycStatus: false },
    { id: 2, name: 'Rajnish Upadhay', occupation: 'Business', phone: '8887623735', kycStatus: false },
    { id: 3, name: 'Mansi', occupation: 'Business', phone: '8882610840', kycStatus: false },
    { id: 4, name: 'Manish Traders', occupation: 'Business', phone: '9312059688', kycStatus: false },
    { id: 5, name: 'Tanishk Tiwari', occupation: 'Business', phone: '7579787827', kycStatus: false },
    { id: 6, name: 'Sahai Sagar Assosciates', occupation: 'Business', phone: '9953561119', kycStatus: false },
    { id: 7, name: 'Satyam Vishwakarma', occupation: 'Business', phone: '9625789270', kycStatus: true },
  ]);

  const CustomerList = () => (
    <div className="customer-list">
      <div className="header">
        <h2>Customers</h2>
        <button 
          className="add-customer-btn"
          onClick={() => setShowAddCustomer(true)}
        >
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
              <th>kyc Status</th>
              <th>View Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.occupation}</td>
                <td>{customer.phone}</td>
                <td>
                  <span className={`kyc-status ${customer.kycStatus ? 'verified' : 'pending'}`}>
                    {customer.kycStatus ? '✓' : '⭘'}
                  </span>
                </td>
                <td><button className="detail-btn">Detail</button></td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn">✏️</button>
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

  const AddCustomerForm = () => (
    <div className="add-customer-form">
      <div className="header">
        <h2>Add New Customer</h2>
        <button 
          className="back-btn"
          onClick={() => setShowAddCustomer(false)}
        >
          Back
        </button>
      </div>
      
      <form onSubmit={handleAddCustomer}>
        <div className="form-content">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Email" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Occupation</label>
              <select defaultValue="">
                <option value="" disabled>Select Occupation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="Phone Number" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Aadhar Number</label>
              <input type="text" placeholder="Enter Aadhar Number" />
            </div>
            <div className="form-group">
              <label>Address Type</label>
              <select defaultValue="">
                <option value="" disabled>Select Address Type</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>House Number</label>
              <input type="text" placeholder="House Number" />
            </div>
            <div className="form-group">
              <label>Street</label>
              <input type="text" placeholder="Street" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Landmark</label>
              <input type="text" placeholder="Landmark" />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input type="text" placeholder="Zip Code" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>District</label>
              <input type="text" placeholder="District" />
            </div>
            <div className="form-group">
              <label>Sub District</label>
              <input type="text" placeholder="Sub District" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Post Office</label>
              <input type="text" placeholder="Post Office" />
            </div>
            <div className="form-group">
              <label>State</label>
              <select defaultValue="">
                <option value="" disabled>Select the state</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <select defaultValue="India">
                <option value="India">India</option>
              </select>
            </div>
          </div>

          <div className="kyc-section">
            <button type="button" className="verify-btn">VERIFY KYC</button>
          </div>

          <div className="form-actions">
            <button type="submit" className="create-btn">Create</button>
            <button type="button" className="cancel-btn" onClick={() => setShowAddCustomer(false)}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const handleAddCustomer = (e) => {
    e.preventDefault();
    const newCustomer = {
      id: customers.length + 1,
      name: e.target[0].value,
      occupation: e.target[1].value,
      phone: e.target[2].value,
      kycStatus: false,
    };

    setCustomers([...customers, newCustomer]);
    setShowAddCustomer(false);
  };

  return (
    <div className="customer-management">
      {showAddCustomer ? <AddCustomerForm /> : <CustomerList />}
    </div>
  );
};

export default CustomerManagement;
