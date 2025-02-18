import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { errorToast } from "../../DecryptoAndOther/ToastUpdate";

const BookingConfirmation = () => {
  const { orderId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/order/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setOrderDetails(data);
        } else {
          errorToast("Failed to fetch order details.");
        }
      } catch (error) {
        console.error(error);
        errorToast("An error occurred while fetching the order.");
      } finally {
        setLoading(false); // ✅ Stop loading after fetch attempt
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg mt-[3rem]">
        {/* Header */}
        <div className="text-center p-4 sm:p-6">
          <div className="flex justify-center mb-2 sm:mb-4">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-green-700">
            Order Successfully Placed!
          </h1>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6">
          {loading ? (
            <p className="text-center text-gray-600">Fetching order details...</p>
          ) : orderDetails ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                    <p className="text-sm sm:text-base text-gray-600">
                      Order ID: <span className="font-medium">{orderDetails?._id || "N/A"}</span>
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      Email: <span className="font-medium break-all">{orderDetails?.userID.email || "N/A"}</span>
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="mt-4">
                  <h4 className="text-sm sm:text-base font-medium mb-2">Items Ordered:</h4>
                  <div className="space-y-2">
                    {orderDetails?.orderItems?.length > 0 ? (
                      orderDetails.orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row justify-between text-sm sm:text-base text-gray-600 border-b pb-2 sm:pb-1 last:border-b-0"
                        >
                          <div className="flex justify-between sm:w-2/3">
                            <span>
                              {item.quantity}x {item.productId.title || "Unknown Item"}
                            </span>
                            <span className="sm:hidden">
                              ${((item.productId.mrp || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <span className="hidden sm:block">
                            ${((item.productId.mrp || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No items found.</p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between font-semibold text-sm sm:text-base">
                      <span>Total Amount:</span>
                      <span>${orderDetails?.amountPay?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-700">What's Next?</h3>
                <ul className="space-y-2 text-sm sm:text-base text-blue-600">
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>A confirmation email has been sent to {orderDetails?.userID.email || "your email"}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>Expected delivery: {orderDetails?.estimatedDelivery || "TBD"}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>You can track your order status using your Order ID</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">Order not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
