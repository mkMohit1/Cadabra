import React, { useEffect, useState } from 'react';
import { PlusCircle} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { errorToast, infoToast, successToast } from '../../DecryptoAndOther/ToastUpdate';
import {  ChevronRight } from 'lucide-react';
import { updateCurrentContainer } from '../../redux/cartSlice';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {children}
      </div>
    </div>
  );
};

const AddressSelector = ({currentAddress,handleAdrress}) => {
  const dispatch= useDispatch();
  const [addresses, setAddresses] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(currentAddress);
  const [editingAddress, setEditingAddress] = useState(null);
   const currentContainer = useSelector((state) => state.cart.currentContainer);
  const [newAddress, setNewAddress] = useState({
    name: '',
    addressType: 'Permanent',
    mobileNumber: '',
    state: '',
    street: '',
    zipCode: '',
  });

  useEffect(()=>{
    const fetchAddresses = async()=>{
      if (!user || !user._id) return; // Ensure user is available
      console.log(user._id);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/addresses/${user._id}`);
        const data = await response.json();

        if (response.ok) {
          setAddresses(data.addresses);
          if(data.addresses.length ==1){
            //infoToast(`selected address 1`);
            setSelectedAddress(data.addresses[0]._id);
            handleAdrress(data.addresses[0]._id);
          }
        } else {
          console.error('Error fetching addresses:', data.message);
          errorToast(data.message ||'Error fetching addresses:');
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        errorToast('Error fetching addresses:');
      }
    }
    fetchAddresses();
  },[])

  const handleUpdateContainer = (currentMode)=>{
      dispatch(updateCurrentContainer(currentMode));
    }

  const handleAddOrUpdateAddress = async () => {
    console.log(newAddress);
    const filteredAddress = newAddress;
    
    // Object.fromEntries(
    //   Object.entries(newAddress).filter(([key, value]) => value.trim() !== '')
    // );

    if (filteredAddress.street && filteredAddress.mobileNumber) {
      const endpoint = editingAddress
        ? `${process.env.REACT_APP_BACK_URL}/commonUser/updateAddress/${editingAddress._id}`
        :  `${process.env.REACT_APP_BACK_URL}/commonUser/addNewAddress`;
      const method = editingAddress ? 'PUT' : 'POST';

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerData: filteredAddress,
            currentUser: { userId: user._id, role: user.role },
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("check data",data)  ; 
          if (editingAddress) {
            setAddresses(addresses.map((addr) =>
              addr._id === data.address._id ? { ...data.address } : addr
            ));
            successToast(data.message || 'Address updated successfully');
          } else {
            setAddresses([...addresses,data.address]);
            successToast(data.message || 'Address added successfully');
          }
        } else {
          errorToast(data.message || 'Failed to process the address');
        }
      } catch (error) {
        console.error('Error processing address:', error);
        errorToast('An error occurred while processing the address');
      } finally {
        resetForm();
      }
    } else {
      infoToast('Please fill out all required fields');
    }
  };

  // Remove an address
  const handleRemoveAddress = async (addressId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await response.json();

      if (response.ok) {
        setAddresses(addresses.filter((addr) => addr._id !== addressId));
        console.log(data.message);
        successToast(data.message || 'Address removed successfully');
      } else {
        console.error('Error removing address:', data.message);
        errorToast(data.message || 'Error removing address:');
      }
    } catch (error) {
      console.error('Error removing address:', error);
    }
  };

  const resetForm = () => {
    setNewAddress({
      name: '',
      addressType: 'Permanent',
      mobileNumber: '',
      state: '',
      street: '',
      zipCode: '',
    });
    setEditingAddress(null);
    setIsOpen(false);
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setNewAddress({ ...address });
    setIsOpen(true);
  };

  const updateHadleAdress =(addr)=>{
    setSelectedAddress(addr._id);
    handleAdrress(addr._id);
  }

  // const handleRemoveAddress = (id) => {
  //   setAddresses(addresses.filter((addr) => addr.id !== id));
  //   if (selectedAddress === id && addresses.length > 1) {
  //     setSelectedAddress(addresses.find((addr) => addr.id !== id).id);
  //   }
  // };

  return (
    <div className="space-y-6">
       {/* Progress Bar */}
       <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-sm md:text-base">
      <span className={`text-gray-500`} onClick={()=>handleUpdateContainer("CartItem")}>Carts</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className={`font-medium text-blue-600`}>Address</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className={`text-gray-500`}>Shipping</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-500">Payment</span>
      </div>
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className={`p-4 rounded-lg border-2 ${
              selectedAddress === addr._id ? 'border-blue-600' : 'border-gray-200'
            }`}
          >
            <div className="flex space-x-4">
              <input
                type="radio"
                checked={selectedAddress === addr._id}
                onChange={() => updateHadleAdress(addr)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{addr.name}</span>
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded">{addr.addressType}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {addr.street}, {addr.state} {addr.zipCode}
                </p>
                <p className="text-sm text-gray-600">Mobile - {addr.mobileNumber}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => handleEditClick(addr)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleRemoveAddress(addr._id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-gray-50"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Add New Address</span>
      </button>

      <Modal isOpen={isOpen} onClose={resetForm}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>

          <div className="space-y-4">
            <label>
              Full Name
              <input
                type="text"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </label>
            <label>
              Address Type
              <select
                value={newAddress.addressType}
                onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Permanent">Permanent</option>
                <option value="Temporary">Temporary</option>
                <option value="House">House</option>
                <option value="Office">Office</option>
              </select>
            </label>
            <label>
              Street
              <input
                type="text"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </label>
            <label>
              State
              <input
                type="text"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </label>
            <label>
              PIN Code
              <input
                type="text"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </label>
            <label>
              Mobile Number
              <input
                type="text"
                value={newAddress.mobileNumber}
                onChange={(e) => setNewAddress({ ...newAddress, mobileNumber: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={resetForm} className="text-gray-600">
              Cancel
            </button>
            <button
              onClick={handleAddOrUpdateAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressSelector;
