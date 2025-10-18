import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import './CartIcon.css';

const CartIcon = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="fixed-cart-icon" onClick={() => navigate('/cart')}>
      <img src={assets.basket_icon} alt="Cart" />
      {getTotalCartAmount() > 0 && <span className="cart-count-dot"></span>}
    </div>
  );
};

export default CartIcon;
