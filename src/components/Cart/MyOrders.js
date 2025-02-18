import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Search, UserPlus, Pencil, Calendar, MapPin, Phone, Mail, Eye, User } from 'lucide-react';

const MyOrders = () => {
  const currentUser = useSelector(state => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const userId = currentUser?._id; // Ensure userId exists

  useEffect(() => {
    if (!userId) return; // Prevent fetch if userId is missing
    fetch(`${process.env.REACT_APP_BACK_URL}/orders/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || [])) // Ensure orders array is not undefined
      .catch((error) => console.error("Error fetching orders:", error));
  }, [userId]);

  const handleViewMore = (order) => {
    if (!order || !order.orderID) return; // Ensure order exists before setting state
    setOrderDetails(order);
    setShowDetailsModal(true);
  };

  return (
    <div className="pt-[5rem] mb-[2rem]">
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border p-4 mb-2 rounded-md flex flex-row justify-between">
              <div className="flex flex-col">
                <p className="text-gray-700">Order ID: {order._id}</p>
                <p className="text-gray-500">
                  Total: ₹{order?.orderID?.amountPay ?? "N/A"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-700">
                  Status: {order?.orderID?.status ?? "Pending"}
                </p>
                <button
                  className="text-gray-500 underline hover:text-gray-700"
                  onClick={() => handleViewMore(order)}
                  disabled={!order?.orderID} // Disable if orderID is missing
                >
                  View More
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
                  <p className="text-sm"><span className="font-medium">Order ID:</span> {orderDetails._id}</p>
                  <p className="text-sm"><span className="font-medium">Date:</span> {new Date(orderDetails?.orderID?.createdAt).toLocaleString()}</p>
                  <p className="text-sm"><span className="font-medium">Status:</span> {orderDetails?.orderID?.status ?? "N/A"}</p>
                  <p className="text-sm"><span className="font-medium">Payment Method:</span> {orderDetails?.orderID?.paymentMethod ?? "N/A"}</p>
                  <p className="text-sm"><span className="font-medium">Amount:</span> ₹{orderDetails?.orderID?.amountPay ?? "N/A"}</p>
                </div>
              </div>

               {/* Delivery Address */}
               <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Delivery Address</h3>
                <div className="space-y-3">
                {orderDetails.orderID.address && (
                    <>
                        <p className="text-sm flex items-center gap-2">
                        <User size={16} />
                        {orderDetails.orderID.address.name}
                        </p>
                        <p className="text-sm flex items-start gap-2">
                        <MapPin size={16} className="mt-1 flex-shrink-0" />
                        <span>
                            {orderDetails.orderID.address.street}, 
                            {orderDetails.orderID.address.city}, 
                            {orderDetails.orderID.address.state} - {orderDetails.orderID.address.zipCode}
                        </span>
                        </p>
                        <p className="text-sm flex items-center gap-2">
                        <Phone size={16} />
                        {orderDetails.orderID.address.mobileNumber}
                        </p>
                        <p className="text-sm flex items-center gap-2">
                        <Mail size={16} />
                        {orderDetails.orderID.address.email ?? "------------------"}
                        </p>                        
                    </>
                )}
                  </div>
                </div>

              {/* Products */}
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <h3 className="font-semibold mb-4">Products</h3>
                {orderDetails?.orderID?.orderItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <p className="text-sm">{item?.productId?.title ?? "Unknown"} (Qty: {item?.quantity ?? "N/A"})</p>
                    <p className="text-sm font-medium">
                      ₹{(item?.productId?.mrp ?? 0) * (item?.quantity ?? 0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
