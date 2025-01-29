import React, { useEffect, useState } from 'react';
import '../styles/CustomerManagement.scss';
import { infoToast,errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";
import { useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';

const CustomerManagement = () => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Add state to store selected customer

  // Fetch customers data
  const fetchCustomers = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/getAdmins/${user.mobileNumber}`);
    if (response.ok) {
      const data = await response.json();
      console.log("mnk", data);
      setCustomers(data.customers);
    } else {
      const error = await response.json();
      errorToast(error.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [showAddCustomer]);

  const handleEdit = (customer) => {
    // Logic to handle edit, e.g., show a form pre-filled with customer details
    console.log("Edit customer:", customer);
    //setSelectedCustomer(customer); // Optionally set customer details for editing
  };

  const handleClose =()=>{
    console.log("handleClose");
    setSelectedCustomer(null);
  }
  
  const handleDelete = async (customerId) => {
    // Logic to handle delete, e.g., call API to delete customer
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/deleteCustomer/${customerId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          successToast("Customer deleted successfully!");
          fetchCustomers(); // Refresh the customer list
        } else {
          const error = await response.json();
          errorToast(error.message);
        }
      } catch (err) {
        console.error("Error deleting customer:", err);
        errorToast("Failed to delete customer.");
      }
    }
  };

  // Customer List Component
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
              <th>KYC Status</th>
              <th>View Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(customers) && customers.length > 0 ? (
            customers.map((customer,index) => (
              <tr key={customer.id}>
                <td>{index+1}</td>
                <td>{customer.name}</td>
                <td>{customer.addresses?.[0].occupation}</td>
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
                    <button className="edit-btn" onClick={handleEdit(customer)}>✏️</button>
                    <button className="delete-btn">🗑️</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No customers found.</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );


  // Customer Detail Component - This will display when a customer is selected
  const CustomerDetail = ({ customer, handleClose }) => ( //bg-gray-900 bg-opacity-50
    <div className="sticky top-10 inset-0  flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 sm:p-8">
        {/* Popup Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-xl font-bold">Customer Details</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            X
          </button>
        </div>
  
        {/* Popup Body */}
        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              value={customer.name} 
              readOnly 
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
  
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={customer.email} 
              readOnly 
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
  
          {/* Occupation */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Occupation</label>
            <input 
              type="text" 
              value={customer.addresses[0].occupation} 
              readOnly 
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
  
          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              type="text" 
              value={customer.mobileNumber} 
              readOnly 
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
  
          {/* KYC Status */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">KYC Status</label>
            <input 
              type="text" 
              value={customer.kycStatus ? 'Verified' : 'Pending'} 
              readOnly 
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
  
          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
  
            {/* Address Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Address Type</label>
              <input 
                type="text" 
                value={customer.addresses[0].addressType} 
                readOnly 
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
  
            {/* Street */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input 
                type="text" 
                value={customer.addresses[0].street} 
                readOnly 
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
  
            {/* District */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">District</label>
              <input 
                type="text" 
                value={customer.addresses[0].district} 
                readOnly 
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
  
            {/* Sub-district */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Sub-district</label>
              <input 
                type="text" 
                value={customer.addresses[0].subDistrict} 
                readOnly 
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
  
            {/* State */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input 
                type="text" 
                value={customer.addresses[0].state} 
                readOnly 
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
  
            {/* Zip Code */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Zip Code</label>
              <input 
                type="text" 
                value={customer.addresses[0].zipCode} 
                readOnly 
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add Customer Form Component
  const AddCustomerForm = ({ setShowAddCustomer }) => {
    const [customerData, setCustomerData] = useState({
      name: '',
      email: '',
      occupation: '',
      mobileNumber: '',
      aadharNumber: '',
      addressType: '',
      houseNumber: '',
      street: '',
      landmark: '',
      zipCode: '',
      district: '',
      subDistrict: '',
      postOffice: '',
      state: '', // Updated to allow user selection from list
    });

    const [showAadhaarModal, setShowAadhaarModal] = useState(false); // State for KYC verification modal
    const [aadhaarToVerify, setAadhaarToVerify] = useState(''); // State to store entered Aadhaar number
    const [kycStatus, setKycStatus] = useState(null); // Store the KYC verification result (null, 'verified', 'pending')

    const statesOfIndia = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
      "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
      "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
      "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
      "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
    ];

    // Handle input change
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCustomerData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    // Handle form submission
    const handleAddCustomer = async (e) => {
      e.preventDefault();
      // Sending separate data for the user and the address
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/addNewUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerData, currentUser: { userId: user._id, role: user.role }, }),
      });

      if (response.ok) {
        const result = await response.json();
        successToast(result.message);
        setShowAddCustomer(false); // Hide the form after submission
      } else {
        const error = await response.json();
        errorToast(error.message);
      }
    };

    // Handle KYC Verification (simulated)
    const handleKycVerification = () => {
      if (!aadhaarToVerify) {
        alert("Please enter a valid Aadhaar number.");
        return;
      }

      // Simulate fetching Aadhaar details and verify KYC
      const isValidAadhaar = aadhaarToVerify.length === 12; // Aadhaar number must be 12 digits

      if (isValidAadhaar) {
        setKycStatus('verified');
        alert("KYC Verified successfully!");
      } else {
        setKycStatus('pending');
        alert("Invalid Aadhaar number.");
      }

      // Close the modal after verification attempt
      setShowAadhaarModal(false);
    };

    return (
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
                <input
                  type="text"
                  name="name"
                  value={customerData.name}
                  placeholder="Name"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerData.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Occupation</label>
                <select
                  name="occupation"
                  value={customerData.occupation}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Occupation</option>
                  <option value="SoftwareEngineer">Software Engineer</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={customerData.mobileNumber}
                  placeholder="Phone Number"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={customerData.aadharNumber}
                  placeholder="Enter Aadhar Number"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address Type</label>
                <select
                  name="addressType"
                  value={customerData.addressType}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Address Type</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>House Number</label>
                <input
                  type="text"
                  name="houseNumber"
                  value={customerData.houseNumber}
                  placeholder="House Number"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={customerData.street}
                  placeholder="Street"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  value={customerData.landmark}
                  placeholder="Landmark"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={customerData.zipCode}
                  placeholder="Zip Code"
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
                  value={customerData.district}
                  placeholder="District"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Sub District</label>
                <input
                  type="text"
                  name="subDistrict"
                  value={customerData.subDistrict}
                  placeholder="Sub District"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Post Office</label>
                <input
                  type="text"
                  name="postOffice"
                  value={customerData.postOffice}
                  placeholder="Post Office"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <select
                  name="state"
                  value={customerData.state}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select State</option>
                  {statesOfIndia.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="kyc-section">
              <button type="button" className="verify-btn" onClick={() => setShowAadhaarModal(true)}>
                VERIFY KYC
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="create-btn">Create</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddCustomer(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        {/* KYC Modal */}
        {showAadhaarModal && (
          <div className="kyc-modal">
            <div className="modal-content">
              <h3>Enter Aadhaar Number for Verification</h3>
              <input
                type="text"
                value={aadhaarToVerify}
                onChange={(e) => setAadhaarToVerify(e.target.value)}
                placeholder="Enter Aadhaar Number"
              />
              <button onClick={handleKycVerification}>Verify</button>
              <button onClick={() => setShowAadhaarModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* KYC Status */}
        {kycStatus && (
          <div className={`kyc-status ${kycStatus}`}>
            {kycStatus === 'verified' ? "KYC Verified!" : "KYC Verification Failed."}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="customer-management">
      {showAddCustomer ? (
        <AddCustomerForm setShowAddCustomer={setShowAddCustomer} />
      ) : selectedCustomer ? (
        <CustomerDetail customer={selectedCustomer} handleClose={handleClose}/> // Show customer details when selected
      ) : (
        <CustomerList />
      )}
    </div>
  );
};

export default CustomerManagement;
