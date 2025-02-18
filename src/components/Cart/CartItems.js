import React,{useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartCard from './CartCard';
import { updateCartItem, updateCartCount, updateCartMode } from "../../redux/cartSlice";

const CartItems = ({currentCart, checkBook, hadleUpdateBook}) => {
    const dispatch = useDispatch();
    const cartItem = useSelector((state) => state.cart.cartItem);
    const sellCartItem = useSelector((state) => state.cart.sellCartItem);
    const currentMode = useSelector((state) => state.cart.cartMode);
    const [openMore, setOpenMore] = useState(false);
    //console.log(currentCart);
    const bookref = useRef();

    
    const toggleMore = () => {
      setOpenMore((prevState) => !prevState);
    };
  return (
    <div className="space-y-4 font-mulish">
      <div className="grid gap-4">
        {currentCart.map((item) => (
          <CartCard
            key={item._id}
            item={item}
            currentMode={currentMode}
          />
        ))}
      </div>
      {1==0?
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
      :null}
      <div className='w-full bg-gray-200 flex items-center pl-2 py-3 cursor-pointer' onClick={hadleUpdateBook}>
          <input type='checkbox' name='BookOrder' className=''
          ref={bookref}
          checked={checkBook} // Controlled by the `checkBook` state
          onChange={hadleUpdateBook} // Optional if the `div` click handler handles it
          />
          <span className='ml-2 text-lg'>Book now and pay at the time of installation.</span>
      </div>
      
    </div>
  )
}

export default CartItems