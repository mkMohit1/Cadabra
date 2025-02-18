import React, { useState } from 'react';
import "../../styles/CartCard.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { removeCartItem, removeSellCartItem } from '../../redux/cartSlice';
import { errorToast, successToast } from '../../DecryptoAndOther/ToastUpdate';
import { syncCartWithServer , updateQuantity} from '../../redux/cartSlice';

const CartCard = ({ item, currentMode }) => {
  const user = useSelector(state => state.auth.user);
  const cartItem = useSelector(state => state.cart.cartItem);
  const dispatch = useDispatch();
  const [openMore, setOpenMore] = useState(false);
  console.log("item",item);
  const toggleMore = () => setOpenMore(prevState => !prevState);

  const deleteCartItem = async (userId, productId) => {
    if(user){
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/cart/item`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, productId }),
        });

        if (response.ok) {
          console.log(productId,user);
          dispatch(removeCartItem({ _id: productId , user}));
          successToast('Cart item deleted successfully');
        } else {
          errorToast('Error deleting cart item');
        }
      } catch (error) {
        console.error('Error deleting cart item:', error);
        errorToast('Failed to delete cart item');
      }
    }else{
      console.log(item.productId);
      dispatch(removeCartItem({product: item.productId }));
    }
  };

  const handleQuantityChange = (id, delta, user) => {
    console.log("delta",delta);
          try {
            if(item.quantity === 1 && delta == -1){
              return
            }
            console.log("id",id);
            console.log("delta",delta); 
            console.log("user",user);
            dispatch(updateQuantity({ id, quantity: delta , user}));
            if(user){ 
              dispatch(syncCartWithServer({ userId: user._id, cartItems: [item] , delta}));
            }
            
            successToast('Cart item count updated successfully');
          } catch (error) {
            console.error('Error updating cart item:', error);
          }
  };

  console.log(cartItem);
  // Ensure price is displayed with a currency symbol, for example ₹ or $.
  const price = currentMode === 'rent' ? item.productId.mrp : item.productId.mrp;
  const quantity = currentMode === "rent" ? item.quantity : item.quantity;
  return (
    <div className="cart-item">
      <div className="cart-item-content">
        <div className="item-details">
          <img src={`${process.env.REACT_APP_BACK_URL}${item.productId.productImage}`} alt={item.title} className="item-image" />
          <div>
            <h4>{item.productId.title}</h4>
            <p>{item.productId.subTitle}</p>
          </div>
        </div>
        <div className="quantity-controls">
          <button onClick={() => user?handleQuantityChange(item._id, -1, user):handleQuantityChange(item.productId._id, -1)}>◄</button>
          <span>{quantity}</span>
          <button onClick={() => user?handleQuantityChange(item._id, 1, user):handleQuantityChange(item.productId._id, 1)}>►</button>
        </div>
        <div className="item-actions">
          <span className="price">{price}</span>
          <button
            onClick={
              currentMode === 'rent'
                ? () => deleteCartItem(user?user._id:null,item.productId._id)
                : () => dispatch(removeSellCartItem(item))
            }
            className="remove-button"
          >
            🗑️
          </button>
          <div
            className="more-item"
            onClick={toggleMore}
            aria-expanded={openMore}
            aria-controls={`more-content-${item._id}`}
          >
            <span className="icon">
              {openMore ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faPlus} />}
            </span>
          </div>
        </div>
      </div>
      {openMore && (
        <div id={`more-content-${item._id}`} className="more-content">
          {/* Placeholder for additional content */}
          <span>Additional Information</span>
        </div>
      )}
    </div>
  );
};

export default CartCard;
