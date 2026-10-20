"use client";

import dynamic from "next/dynamic";
import CheckoutFormSkeleton from "@/components/checkout-form-skeleton";

const CheckoutForm = dynamic(() => import("@/components/checkout-form"), {
  ssr: false,
  loading: () => <CheckoutFormSkeleton />,
});

export default CheckoutForm;
