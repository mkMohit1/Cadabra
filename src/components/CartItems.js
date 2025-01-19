import React,{useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartCard from './CartCard';
import { updateCartItem, updateSellCartCount, updateCartCount, updateCartMode } from "../redux/cartSlice";

const CartItems = ({currentCart}) => {
    const dispatch = useDispatch();
    const cartItem = useSelector((state) => state.cart.cartItem);
    const sellCartItem = useSelector((state) => state.cart.sellCartItem);
    const currentMode = useSelector((state) => state.cart.cartMode);
    const [openMore, setOpenMore] = useState(false);
    console.log(currentCart);
     const handleQuantityChange = (id, delta) => {
        const updatedCart = currentMode === "rent" ? (cartItem || []) : (sellCartItem || []);
        const updatedItem = updatedCart.find((item) => item._id === id);
    
        if (updatedItem) {
            const currentQuantity = currentMode === "rent" ? updatedItem.rentQuantity : updatedItem.saleQuantity;
            const updatedQuantity = Math.max(1, currentQuantity + delta);
    
            if (currentMode === "rent") {
                dispatch(updateCartItem({ ...updatedItem, rentQuantity: updatedQuantity }));
            } else {
                dispatch(updateSellCartCount({ ...updatedItem, saleQuantity: updatedQuantity }));
            }
        }
    };

    const toggleMore = () => {
      setOpenMore((prevState) => !prevState);
    };
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {currentCart.map((item) => (
          <CartCard
            key={item._id}
            item={item}
            currentMode={currentMode}
            handleQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          className={`py-2 px-4 rounded-lg transition-colors ${
            currentMode === "rent" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => dispatch(updateCartMode("rent"))}
          disabled={cartItem.length === 0 && currentMode !== "rent"}
        >
          Rent
        </button>
        <button
          className={`py-2 px-4 rounded-lg transition-colors ${
            currentMode === "sell" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => dispatch(updateCartMode("sell"))}
          disabled={sellCartItem.length === 0 && currentMode !== "sell"}
        >
          Sell
        </button>
      </div>
    </div>
  )
}

export default CartItems