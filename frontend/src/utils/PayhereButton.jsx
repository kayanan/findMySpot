/*global payhere*/
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentButton = ({ paymentDetails ,onComplete}) => {
  
  const navigate = useNavigate();
  const handlePayment = async () => {
    // paymentDetails = {
    //   order_id: "ItemNo12345",
    //   amount: "1005.00",
    //   currency: "LKR",
    //   first_name: "Saman",
    //   last_name: "Perera",
    //   email: "samanp@gmail.com",
    //   phone: "0771234567",
    //   address: "No.1, Galle Road",
    //   city: "Colombo",
    //   country: "Sri Lanka",
    // };

    try {
      //Request backend to generate the hash value
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}/v1/subscription-payment/generate-hash`,
        paymentDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        const { hash, merchant_id } = response.data;

        // Payment configuration
        const payment = {
          sandbox: true, // Use sandbox for testing
          merchant_id: merchant_id,
          return_url: paymentDetails.return_url,
          cancel_url: paymentDetails.cancel_url,
          notify_url: paymentDetails.notify_url,
          order_id: paymentDetails.order_id,
          items: paymentDetails.items,
          amount: paymentDetails.amount,
          currency: "LKR",
          first_name: paymentDetails.first_name,
          last_name: paymentDetails.last_name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          address: paymentDetails.address,
          city: paymentDetails.city,
          country: paymentDetails.country,
          custom_1: paymentDetails.custom_1,
          custom_2: paymentDetails.custom_2,
          hash: hash,
        };
        const modifiedPayment = {
          ...payment,
          iframe: undefined,
        };
        delete modifiedPayment.iframe;
        console.log(modifiedPayment,"--------------------------------modifiedPayment--------------------------------");
        //Initialize PayHere payment
        // const redirectToPayHere = (paymentData) => {
        //   const form = document.createElement('form');
        //   form.method = 'POST';
        //   form.action = 'https://sandbox.payhere.lk/pay/checkout';

        //   Object.keys(paymentData).forEach(key => {
        //     const input = document.createElement('input');
        //     input.type = 'hidden';
        //     input.name = key;
        //     input.value = paymentData[key];
        //     form.appendChild(input);
        //   });

        //   document.body.appendChild(form);
        //   console.log(form,"-----------------------------form--------------------------------");
        //   form.submit();
        // };

        // redirectToPayHere(payment);
        payhere.startPayment(modifiedPayment);
        // Payment completed. It can be a successful failure.
        payhere.onCompleted = function onCompleted(orderId) {
        
        onComplete();
          // Note: validate the payment and show success or failure page to the customer
        };

       // Payment window closed
        // payhere.onDismissed = function onDismissed() {
        //  // navigate(paymentDetails.cancel_url);
        // };

        // Error occurred
        payhere.onError = function onError(error) {
          toast.error("Payment failed");
        };
      } else {
        alert("Failed to generate hash for payment.");
        console.error("Failed to generate hash for payment.");
      }
    } catch (error) {
      alert("An error occurred:");
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <button id="payhere-payment" onClick={handlePayment} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
        Card Payment
      </button>
    </div>
  );
};

export default PaymentButton;