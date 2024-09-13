import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ClubPaymentPage.css';
import Header from '../Header/Header';

const paymentOptions = ['Credit Card', 'Debit Card', 'Google Pay', 'Razorpay'];

const ClubPaymentPage = () => {
  const location = useLocation();
  const { club } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  if (!club) {
    return <div>No club selected.</div>;
  }

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <div>
      <Header/>
    <div className="payment-page-container">
      <header className="payment-header">
        <h1>Payment for {club.name}</h1>
      </header>
      <section className="payment-content">
        <p><strong>Amount: ${club.amount}</strong></p>
        <h2>Select Payment Method</h2>
        <div className="payment-methods">
          {paymentOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option.toLowerCase().replace(' ', '-')}
                checked={paymentMethod === option.toLowerCase().replace(' ', '-')}
                onChange={handlePaymentMethodChange}
              />
              {option}
            </label>
          ))}
        </div>

        <form className="payment-form">
          {paymentMethod === 'credit-card' || paymentMethod === 'debit-card' ? (
            <>
              <div className="form-group">
                <label htmlFor="card-number">Card Number:</label>
                <input type="text" id="card-number" name="cardNumber" required />
              </div>

              <div className="form-group">
                <label htmlFor="expiry-date">Expiry Date:</label>
                <input type="text" id="expiry-date" name="expiryDate" placeholder="MM/YY" required />
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV:</label>
                <input type="text" id="cvv" name="cvv" required />
              </div>

              <div className="form-group">
                <label htmlFor="cardholder-name">Cardholder Name:</label>
                <input type="text" id="cardholder-name" name="cardholderName" required />
              </div>
            </>
          ) : null}

          {paymentMethod === 'google-pay' ? (
            <div className="form-group">
              <label htmlFor="google-upi">Google Pay UPI ID:</label>
              <input type="text" id="google-upi" name="googleUpi" required />
            </div>
          ) : null}

          {paymentMethod === 'razorpay' ? (
            <>
              <div className="form-group">
                <label htmlFor="razorpay-email">Razorpay Email:</label>
                <input type="email" id="razorpay-email" name="razorpayEmail" required />
              </div>

              <div className="form-group">
                <label htmlFor="razorpay-phone">Razorpay Phone Number:</label>
                <input type="tel" id="razorpay-phone" name="razorpayPhone" required />
              </div>
            </>
          ) : null}

          <button type="submit" className="btn">Submit Payment</button>
        </form>
      </section>
      <footer className="payment-footer">
        <p>&copy; 2024 Edu_Web. All rights reserved.</p>
      </footer>
    </div>
          
    </div>
  );
};

export default ClubPaymentPage;
