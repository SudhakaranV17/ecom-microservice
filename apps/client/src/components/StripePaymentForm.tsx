"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { useAuth } from "@clerk/nextjs";
import { ShippingFormInputs, CartItemsType } from "@repo/types";
import CheckOutForm from "./CheckOutForm";
import useCartStore from "@/stores/cartStore";

const stripePromise = loadStripe(
  "pk_test_51RFF7dR7mPs0Edj7bGky1UccwF5DPVXYv2hIeZPqfq92c9LUWcC8WoGhoByPL9CwdmrY6zvKV2PXIOmTS3Bb4xJD0018LBrMJG",
);

const fetchClientSecret = async (
  token: string,
  cart: CartItemsType,
  shippingForm: ShippingFormInputs,
) => {
  // Create a Checkout Session
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/session/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart, shippingForm }),
    },
  );
  const data = await res.json();
  return data.checkoutSessionClientSecret;
};
export default function StripePaymentForm({
  shippingform,
}: {
  shippingform: ShippingFormInputs;
}) {
  const [token, setToken] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { cart } = useCartStore();
  useEffect(() => {
    getToken().then((res) => setToken(res));

    return () => {
      setToken(null);
    };
  }, []);

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchClientSecret(token, cart, shippingform).then((secret) => {
        if (!secret) {
          console.log("Failed to fetch client secret. Check backend logs.");
        }
        setClientSecret(secret);
      });
    }
  }, [token]);

  if (!token || !clientSecret) {
    return <div>loading...</div>;
  }
  return (
    <div id="checkout">
      <CheckoutElementsProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <CheckOutForm shippingform={shippingform} />
      </CheckoutElementsProvider>
    </div>
  );
}
