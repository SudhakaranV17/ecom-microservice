"use client";
import { ShippingFormInputs } from "@repo/types";
import {
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import { ConfirmError } from "@stripe/stripe-js";
import React, { useState } from "react";

function CheckOutForm({ shippingform }: { shippingform: ShippingFormInputs }) {
  const checkoutState = useCheckoutElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ConfirmError | null>(null);

  if (checkoutState.type === "loading") {
    return <div>Loading checkout...</div>;
  }

  if (checkoutState.type === "error") {
    console.log(checkoutState.error);
    return <div>Error loading checkout...</div>;
  }

  const { checkout } = checkoutState;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    // Update email and address via Custom Checkout API
    try {
      await checkout.updateShippingAddress({
        name: "shipping_address",
        address: {
          line1: shippingform.address,
          city: shippingform.city,
          country: "IN", // Stripe expects ISO codes
        },
      });

      const confirmResult = await checkout.confirm();
      if (confirmResult.type === "error") {
        setErrorMessage(confirmResult.error);
      }
    } catch (error) {
      console.log("something is wrong here ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement options={{ layout: "accordion" }} />
      <button
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded disabled:bg-gray-400 mt-4"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage.message}</div>
      )}
    </form>
  );
}

export default CheckOutForm;
