import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ClubPaymentPage.css';
import Header from '../Header/Header';

const paymentOptions = ['Credit Card', 'Debit Card', 'Google Pay', 'Razorpay'];

const ClubPaymentPage = () => {
  const location = useLocation();
  const { club } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  // Dynamically load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => console.log("Razorpay script loaded!");
      script.onerror = () => alert("Failed to load Razorpay script");
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  if (!club) {
    return <div>No club selected.</div>;
  }

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (paymentMethod === 'razorpay') {
      initiateRazorpayPayment();
    } else {
      // Handle other payment methods here
      alert('Payment method ' + paymentMethod + ' is not implemented yet.');
    }
  };

  const initiateRazorpayPayment = () => {
    if (typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK is not loaded. Please try again later.");
      return;
    }

    const options = {
      key: 'rzp_test_nzmqxQYhvCH9rD', // Replace with your Razorpay test/live key
      amount: club.amount * 100, // Amount in paise (100 paise = 1 INR)
      currency: 'INR',
      name: `Payment for ${club.name}`,
      description: 'Club Membership Payment',
      handler: (response) => {
        alert('Payment successful. Payment ID: ' + response.razorpay_payment_id);
        // Handle success (e.g., update payment status on your server)
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '1234567890',
      },
      notes: {
        address: 'User Address',
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <Header />
      <div className="payment-page-container">
        <header className="payment-header">
          <h1>Payment for {club.name}</h1>
        </header>
        <section className="payment-content">
          <p><strong>Amount: ₹{club.amount}</strong></p>
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

          <form className="payment-form" onSubmit={handleSubmit}>
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

            {/* No Razorpay-specific fields */}
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
