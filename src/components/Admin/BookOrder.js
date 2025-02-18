import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Pencil, Calendar, MapPin, Phone, Mail, Eye, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { infoToast, errorToast, successToast } from "../../DecryptoAndOther/ToastUpdate";

const BookedOrders = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [installers, setInstallers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUpdateState, setShowUpdateStatus] = useState(false);
  const [showUpdateMode, setShowUpdateMode] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.auth.user);

  // Fetch orders from the backend
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch installers when needed
  useEffect(() => {
    if (showAssignModal) {
      fetchInstallers();
    }
  }, [showAssignModal]);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/orders/booked`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      if (currentUser.role === 'Installer') {
        const datafilter = data.filter((item) => item.technician == currentUser._id);
        setOrders(datafilter);
      } else {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      errorToast('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all installers
  const fetchInstallers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/installers`);
      if (!response.ok) {
        throw new Error('Failed to fetch installers');
      }
      const data = await response.json();
      if (data.installers.length == 0) {
        infoToast("Please ask the Installer Admin to add Installer");
      }
      else {
        setInstallers(data.installers);
      }

    } catch (error) {
      console.error('Error fetching installers:', error);
      errorToast('Failed to fetch installers');
    }
  };

  // Fetch detailed order information
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/order/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data = await response.json();
      setOrderDetails(data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      errorToast('Failed to fetch order details');
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Reset search
  const handleReset = () => {
    setSearchTerm('');
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.userID && order.userID.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle technician assignment
  const handleAssignTechnician = async (orderId, technicianId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/orders/assign-technician`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          technicianId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign technician');
      }

      successToast('Technician assigned successfully');
      setShowAssignModal(false);

      // Update orders list
      await fetchOrders();
    } catch (error) {
      console.error('Error assigning technician:', error);
      errorToast('Failed to assign technician');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssign = (order) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
  }

  const handleStatus = async (order) => {
    setSelectedOrder(order);
    setShowUpdateStatus(true);
  }

  const handlePaymentMode = async (order) => {
    setSelectedOrder(order);
    setShowUpdateMode(true);
  }

  const handleUpdateStatus = async (status = null, paymentMethod = null) => {
    try {
      const bodyData = {};
      // Only add values if they exist
      if (status) bodyData.status = status;
      if (paymentMethod) bodyData.paymentMethod = paymentMethod;

      // Prevent empty update request
      if (Object.keys(bodyData).length === 0) {
        errorToast("Please select at least one update (status or payment mode)");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACK_URL}/order/status/${selectedOrder?._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        errorToast("Failed to update the status or payment method");
        return;
      }

      const data = await response.json();
      successToast(data.message);

      // Refresh orders after update
      await fetchOrders();

      // Close relevant modal based on update type
      if (status) setShowUpdateStatus(false);
      if (paymentMethod) setShowUpdateMode(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      errorToast('Something went wrong');
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header Section - Responsive Layout */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Booked Orders</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 w-full sm:w-auto"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Mobile View - Card Layout */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500">Order ID:</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="truncate text-sm font-medium mb-2">{order._id}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xs text-gray-500 mb-1">Products:</h3>
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="text-sm mb-1">
                      {item.productId?.title} x {item.quantity}
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-3 mb-3">
                    <span className="text-xs text-gray-500">Amount:</span>
                    <span className="font-medium">{formatCurrency(order.amountPay)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-xs text-gray-500 block">Payment:</span>
                      <span className="text-sm">{order.paymentMethod}</span>
                    </div>
                    {currentUser.role === 'Installer' && (
                      <button
                        onClick={() => handlePaymentMode(order)}
                        className="p-1 bg-blue-600 text-white rounded-md"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => fetchOrderDetails(order._id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors w-full"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    {!order.technician && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleAssign(order)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
                      >
                        <UserPlus size={16} />
                        Assign Technician
                      </button>
                    )}
                    {currentUser.role === 'Installer' && (
                      <button
                        onClick={() => handleStatus(order)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
                      >
                        <Pencil size={16} />
                        Update Status
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table Layout */}
          <div className="hidden md:block">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="hidden xl:inline">{order._id}</span>
                          <span className="xl:hidden">{order._id.substring(0, 8)}...</span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="mb-1 truncate">
                              {item.productId?.title} x {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.amountPay)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex text-xs font-semibold items-center gap-2">
                            <span className={`rounded-full px-2 leading-[1.7rem] ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            {currentUser.role === 'Installer' && (
                              <button
                                onClick={() => handleStatus(order)}
                                className="flex items-center justify-center p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              >
                                <Pencil size={14} />
                              </button>
                            )}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>{order.paymentMethod}</span>
                            {currentUser.role === 'Installer' && (
                              <button
                                onClick={() => handlePaymentMode(order)}
                                className="flex items-center justify-center p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              >
                                <Pencil size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2 flex-wrap xl:flex-nowrap">
                            <button
                              onClick={() => fetchOrderDetails(order._id)}
                              className="flex items-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs"
                            >
                              <Eye size={14} />
                              <span className="hidden lg:inline">View</span>
                            </button>
                            {!order.technician && order.status !== 'cancelled' && (
                              <button
                                onClick={() => handleAssign(order)}
                                className="flex items-center gap-1 px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                              >
                                <UserPlus size={14} />
                                <span className="hidden lg:inline">Assign</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">No orders found</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Assign Technician Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">Assign Technician</h2>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {installers.map((installer) => (
                <div 
                  key={installer._id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b hover:bg-gray-50 gap-3"
                >
                  <div>
                    <h3 className="font-medium">{installer.name}</h3>
                    <div className="text-sm text-gray-500">
                      <p className="flex items-center gap-2">
                        <Phone size={16} />
                        {installer.mobileNumber}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail size={16} />
                        {installer.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssignTechnician(selectedOrder._id, installer._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-4 md:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">Update Status</h2>
              <button 
                onClick={() => setShowUpdateStatus(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex flex-wrap gap-3 max-h-[60vh] overflow-y-auto justify-center">
              {[
                { status: "pending", color: "bg-yellow-500" },
                { status: "completed", color: "bg-green-500" },
                { status: "failed", color: "bg-red-500" },
                { status: "cancelled", color: "bg-gray-500" },
                { status: "assigned", color: "bg-blue-500" }
              ].map(({ status, color }) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status, null)}
                  className={`${color} text-white px-6 py-2 rounded-lg shadow-md hover:opacity-80 transition-all text-sm font-medium`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Method Modal */}
      {showUpdateMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-4 md:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">Update Payment Method</h2>
              <button 
                onClick={() => setShowUpdateMode(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {["COD", "Credit Card", "UPI", "Net Banking"].map((method) => (
                <button
                  key={method}
                  onClick={() => handleUpdateStatus(null, method)}
                  className={`bg-gray-300 text-gray-800 px-6 py-2 rounded-lg shadow-md hover:bg-gray-400 transition-all text-sm font-medium`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg md:text-xl font-bold">Order Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Order Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Order Information</h3>
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">Order ID:</span> 
                    <span className="break-all">{orderDetails._id}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span> {formatDate(orderDetails.createdAt)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(orderDetails.status)}`}>
                      {orderDetails.status}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Payment Method:</span> {orderDetails.paymentMethod}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Amount:</span> {formatCurrency(orderDetails.amountPay)}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Delivery Address</h3>
                <div className="space-y-3">
                {orderDetails.address && (
                    <>
                        <p className="text-sm flex items-center gap-2">
                        <User size={16} />
                        {orderDetails.address.name}
                        </p>
                        <p className="text-sm flex items-start gap-2">
                        <MapPin size={16} className="mt-1 flex-shrink-0" />
                        <span>
                            {orderDetails.address.street}, 
                            {orderDetails.address.city}, 
                            {orderDetails.address.state} - {orderDetails.address.zipCode}
                        </span>
                        </p>
                        <p className="text-sm flex items-center gap-2">
                        <Phone size={16} />
                        {orderDetails.address.mobileNumber}
                        </p>
                        <p className="text-sm flex items-center gap-2">
                        <Mail size={16} />
                        {orderDetails.address.email ?? "------------------"}
                        </p>                        
                    </>
                )}
                  </div>
                </div>

                {/* Products */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <h3 className="font-semibold mb-4">Products</h3>
                  <div className="space-y-4">
                    {orderDetails.orderItems.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2 gap-2">
                        <div>
                        <p className="font-medium break-words">Product ID: <span className="break-all">{item.productId?._id}</span> ({item.productId?.title})</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatCurrency(item.productId?.mrp * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold">{formatCurrency(orderDetails.amountPay)}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Technician (if any) */}
                {orderDetails.technician && (
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h3 className="font-semibold mb-4">Assigned Technician</h3>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{orderDetails.technician.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone size={16} />
                          {orderDetails.technician.mobileNumber}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail size={16} />
                          {orderDetails.technician.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BookedOrders;