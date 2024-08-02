import React, { useState } from 'react';
import './PaymentPage.css';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('credit-card');

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    return (
        <div className="payment-page-container">
            <header className="payment-header">
                <h1>School Fees Payment</h1>
            </header>
            <section className="payment-content">
                <h2>Select Payment Method</h2>
                <div className="payment-methods">
                    <label>
                        <input
                            type="radio"
                            value="credit-card"
                            checked={paymentMethod === 'credit-card'}
                            onChange={handlePaymentMethodChange}
                        />
                        Credit Card
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="debit-card"
                            checked={paymentMethod === 'debit-card'}
                            onChange={handlePaymentMethodChange}
                        />
                        Debit Card
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="google-pay"
                            checked={paymentMethod === 'google-pay'}
                            onChange={handlePaymentMethodChange}
                        />
                        Google Pay
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="razorpay"
                            checked={paymentMethod === 'razorpay'}
                            onChange={handlePaymentMethodChange}
                        />
                        Razorpay
                    </label>
                </div>

                <form className="payment-form">
                    {paymentMethod === 'credit-card' || paymentMethod === 'debit-card' ? (
                        <>
                            <label htmlFor="card-number">Card Number:</label>
                            <input type="text" id="card-number" name="cardNumber" required />

                            <label htmlFor="expiry-date">Expiry Date:</label>
                            <input type="text" id="expiry-date" name="expiryDate" placeholder="MM/YY" required />

                            <label htmlFor="cvv">CVV:</label>
                            <input type="text" id="cvv" name="cvv" required />

                            <label htmlFor="cardholder-name">Cardholder Name:</label>
                            <input type="text" id="cardholder-name" name="cardholderName" required />
                        </>
                    ) : null}

                    {paymentMethod === 'google-pay' ? (
                        <>
                            <label htmlFor="google-email">Google Pay Email:</label>
                            <input type="email" id="google-email" name="googleEmail" required />

                            <label htmlFor="google-phone">Google Pay Phone Number:</label>
                            <input type="tel" id="google-phone" name="googlePhone" required />
                        </>
                    ) : null}

                    {paymentMethod === 'razorpay' ? (
                        <>
                            <label htmlFor="razorpay-email">Razorpay Email:</label>
                            <input type="email" id="razorpay-email" name="razorpayEmail" required />

                            <label htmlFor="razorpay-phone">Razorpay Phone Number:</label>
                            <input type="tel" id="razorpay-phone" name="razorpayPhone" required />
                        </>
                    ) : null}

                    <button type="submit" className="btn">Submit Payment</button>
                </form>
            </section>
            <footer className="payment-footer">
                <p>&copy; 2024 Our School. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PaymentPage;
