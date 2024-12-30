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
    <div className="cart-items">
            {currentCart.map((item) => (
              <CartCard
                key={item._id}
                item={item}
                currentMode={currentMode}
                handleQuantityChange={handleQuantityChange}
              />
            ))}
            <div className="modeContainer">
              <button
                className={`btn ${currentMode === "rent" ? "active" : ""}`}
                onClick={() => dispatch(updateCartMode("rent"))}
                disabled={cartItem.length === 0 && currentMode !== "rent"}
              >
                Rent
              </button>
              <button
                className={`btn ${currentMode === "sell" ? "active" : ""}`}
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