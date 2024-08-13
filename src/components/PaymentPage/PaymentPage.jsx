import React, { useState } from 'react';
import './PaymentPage.css';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [razorpayOrderId, setRazorpayOrderId] = useState('');

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleRazorpayPayment = async () => {
        // You need to create a Razorpay order from your server and pass the order id to this function
        const options = {
            key: 'YOUR_RAZORPAY_KEY_ID', // Enter the Key ID generated from the Dashboard
            amount: 50000, // Amount is in the smallest currency unit. For example, 50000 paise = INR 500.
            currency: 'INR',
            name: 'Edu_Web',
            description: 'School Fees Payment',
            order_id: razorpayOrderId, // This is a sample Order ID. Replace it with the actual Order ID from your server
            handler: function (response) {
                alert('Payment Successful!');
                // You can handle the successful payment response here
                // For example, you could send this response to your server for further processing
            },
            prefill: {
                email: '', // Prefill user's email address
                contact: '' // Prefill user's phone number
            },
            theme: {
                color: '#3399cc'
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else {
            // Handle other payment methods here
            alert('Payment Method is not Razorpay.');
        }
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

                <form className="payment-form" onSubmit={handleSubmit}>
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
                            <label htmlFor="google-upi">Google Pay UPI ID:</label>
                            <input type="text" id="google-upi" name="googleUpi" required />
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
                <p>&copy; 2024 Edu_Web. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PaymentPage;
