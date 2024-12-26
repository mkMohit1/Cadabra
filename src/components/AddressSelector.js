import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import '../styles/AddressSelector.scss';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        {children}
      </div>
    </div>
  );
};

const AddressSelector = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Huzefa Bagwala',
      type: 'HOME',
      address: '1131 Dusty Townline, Jacksonville, TX 40322',
      contact: '(936) 361-0310'
    },
    {
      id: 2,
      name: 'IndiaTech',
      type: 'OFFICE',
      address: '1219 Harvest Path, Jacksonville, TX 40326',
      contact: '(936) 361-0310'
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [newAddress, setNewAddress] = useState({
    name: '',
    type: 'HOME',
    address: '',
    contact: ''
  });

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.address && newAddress.contact) {
      setAddresses([...addresses, {
        id: addresses.length + 1,
        ...newAddress
      }]);
      setNewAddress({ name: '', type: 'HOME', address: '', contact: '' });
      setIsOpen(false);
    }
  };

  return (
    <div className="address-container">
      <div className="progress-bar">
        <div className="progress-bar_step progress-bar_step--active">Address</div>
        <div className="progress-bar__separator">›</div>
        <div className="progress-bar_step progress-bar_step--inactive">Shipping</div>
        <div className="progress-bar__separator">›</div>
        <div className="progress-bar_step progress-bar_step--inactive">Payment</div>
      </div>

      <div className="address-list">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`address-card ${selectedAddress === addr.id ? 'address-card--selected' : ''}`}
          >
            <div className="address-card__content">
              <div className="address-card__info">
                <input
                  type="radio"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                />
                <div className="address-card__info-details">
                  <div className="name-badge">
                    <span className="name">{addr.name}</span>
                    <span className="badge">{addr.type}</span>
                  </div>
                  <div className="address-text">{addr.address}</div>
                  <div className="contact-text">Contact - {addr.contact}</div>
                </div>
              </div>
              <div className="address-card__actions">
                <button className="edit-btn">Edit</button>
                <button className="remove-btn">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-address-btn" onClick={() => setIsOpen(true)}>
        <PlusCircle />
        <span>Add New Address</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="modal__header">
          <h2 className="modal__header-title">Add New Address</h2>
          <button 
            className="modal__header-close"
            onClick={() => setIsOpen(false)}
          >
            <X />
          </button>
        </div>
        
        <div className="modal__form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={newAddress.name}
              onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Address Type</label>
            <select
              value={newAddress.type}
              onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
            >
              <option value="HOME">Home</option>
              <option value="OFFICE">Office</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={newAddress.address}
              onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Contact</label>
            <input
              type="text"
              value={newAddress.contact}
              onChange={(e) => setNewAddress({...newAddress, contact: e.target.value})}
            />
          </div>
        </div>

        <div className="modal__footer">
          <button
            className="cancel-btn"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="add-btn"
            onClick={handleAddAddress}
          >
            Add Address
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AddressSelector;
