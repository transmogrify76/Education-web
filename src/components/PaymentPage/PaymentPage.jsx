import React, { useState } from 'react';
import './PaymentPage.css';
import Header from '../Header/Header';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('razorpay'); // Default to Razorpay
    const amount = 50000; // Amount in smallest currency unit (e.g., 50000 paise = INR 500)

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Redirect based on selected payment method
        switch (paymentMethod) {
            case 'razorpay':
                window.open('https://razorpay.com', '_blank');
                break;
            case 'credit-card':
                window.open('https://example.com/credit-card', '_blank');
                break;
            case 'debit-card':
                window.open('https://example.com/debit-card', '_blank');
                break;
            case 'google-pay':
                window.open('https://example.com/google-pay', '_blank');
                break;
            default:
                alert('Please select a valid payment method.');
        }
    };

    return (
        <div>
            <Header />
            <div className="payment-page-container">
                <header className="payment-header">
                    <h1>School Fees Payment</h1>
                </header>
                <section className="payment-content">
                    <h2>Amount: ₹{(amount / 100).toFixed(2)}</h2> {/* Displaying amount in INR */}
                    <h2>Select Payment Method</h2>
                    <form className="payment-form" onSubmit={handleSubmit}>
                        <label htmlFor="payment-method">Payment Method:</label>
                        <select id="payment-method" value={paymentMethod} onChange={handlePaymentMethodChange}>
                            <option value="credit-card">Credit Card</option>
                            <option value="debit-card">Debit Card</option>
                            <option value="google-pay">Google Pay</option>
                            <option value="razorpay">Razorpay</option>
                        </select>

                        <button type="submit" className="btn">Proceed to Payment</button>
                    </form>
                </section>
                <footer className="infra-footer">
                <p>
                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
                <p className="footer-text">© 2024 Edu-Web. All rights reserved.</p>
            </footer>
            </div>
        </div>
    );
};

export default PaymentPage;
