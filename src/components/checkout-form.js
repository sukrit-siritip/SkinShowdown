"use client";

import {
  startTransition,
  useActionState,
  useState,
  useTransition,
} from "react";
import { Button, Input, Alert, Segmented, Radio, Form } from "antd";
import { checkout, applyPromoCode } from "@/app/actions/cart";

function fieldLabel(text) {
  return (
    <span className="text-[10px] tracking-[0.04em] text-muted">{text}</span>
  );
}

function formatCardNumber(value) {
  const digits = (value ?? "").replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value) {
  const digits = (value ?? "").replace(/\D/g, "").slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function formatCvc(value) {
  return (value ?? "").replace(/\D/g, "").slice(0, 4);
}

export default function CheckoutForm({ email, cartItems, initialPromo = "" }) {
  const [form] = Form.useForm();
  const [state, formAction, pending] = useActionState(checkout, undefined);
  const paymentMethod = Form.useWatch("payment_method", form) ?? "card";
  const paypalEmailChoice =
    Form.useWatch("paypal_email_choice", form) ?? "same";

  const [promoResult, setPromoResult] = useState(null);
  const [promoPending, startPromoTransition] = useTransition();

  const onApplyPromo = () => {
    const code = form.getFieldValue("promo_code");
    startPromoTransition(async () => {
      const result = await applyPromoCode(code);
      setPromoResult(result);
    });
  };

  const onValuesChange = (changed) => {
    if ("promo_code" in changed) setPromoResult(null);
  };

  const onFinish = (values) => {
    const fd = new FormData();
    fd.set("payment_method", values.payment_method ?? "card");
    fd.set("promo_code", promoResult?.valid ? values.promo_code : "");
    startTransition(() => formAction(fd));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
  const discount = promoResult?.valid
    ? subtotal * (promoResult.discountPct / 100)
    : 0;
  const displayedTotal = subtotal - discount + (subtotal - discount) * 0.08;

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{
        payment_method: "card",
        paypal_email_choice: "same",
        promo_code: initialPromo,
      }}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      className="grid grid-cols-1 md:grid-cols-[minmax(300px,1.4fr)_minmax(260px,0.8fr)] gap-7 items-start"
    >
      <div className="border border-hairline bg-card p-5.5">
        <div className="text-[11px] tracking-[0.16em] text-tan mb-3.5">
          CONTACT
        </div>
        <Input value={email} readOnly className="mb-1.5!" />
        <div className="text-[11px] text-muted mb-5.5">
          Locked to your account email.
        </div>

        <div className="text-[11px] tracking-[0.16em] text-tan mb-3.5">
          PAYMENT METHOD
        </div>
        <Form.Item name="payment_method" className="mb-5.5!">
          <Segmented
            block
            size="large"
            options={[
              { label: "CARD", value: "card" },
              { label: "PAYPAL", value: "paypal" },
            ]}
          />
        </Form.Item>

        {paymentMethod === "card" && (
          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="card_number"
              label={fieldLabel("CARD NUMBER")}
              className="col-span-2 mb-3!"
              getValueFromEvent={(e) => formatCardNumber(e.target.value)}
              validateTrigger="onBlur"
              rules={[
                { required: true, message: "Card number is required." },
                {
                  validator: (_, value) => {
                    const digits = (value ?? "").replace(/\D/g, "").length;
                    if (digits < 13 || digits > 19) {
                      return Promise.reject(new Error("Enter a valid card number."));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="4242 4242 4242 4242" maxLength={23} inputMode="numeric" />
            </Form.Item>
            <Form.Item
              name="card_expiry"
              label={fieldLabel("EXPIRY")}
              className="mb-0!"
              getValueFromEvent={(e) => formatExpiry(e.target.value)}
              validateTrigger="onBlur"
              rules={[
                { required: true, message: "Expiry is required." },
                {
                  pattern: /^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/,
                  message: "Use MM / YY.",
                },
              ]}
            >
              <Input placeholder="09 / 28" maxLength={7} inputMode="numeric" />
            </Form.Item>
            <Form.Item
              name="card_cvc"
              label={fieldLabel("CVC")}
              className="mb-0!"
              getValueFromEvent={(e) => formatCvc(e.target.value)}
              validateTrigger="onBlur"
              rules={[
                { required: true, message: "CVC is required." },
                { pattern: /^\d{3,4}$/, message: "3 or 4 digits." },
              ]}
            >
              <Input placeholder="•••" maxLength={4} inputMode="numeric" />
            </Form.Item>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div>
            <div className="text-[10px] text-muted mb-1.5">PAYPAL EMAIL</div>
            <Form.Item name="paypal_email_choice" className="mb-0!">
              <Radio.Group className="flex! flex-col! gap-2!">
                <Radio value="same">Use my account email ({email})</Radio>
                <Radio value="other">Use a different email</Radio>
              </Radio.Group>
            </Form.Item>
            {paypalEmailChoice === "other" && (
              <Form.Item
                name="paypal_email"
                className="mt-2.5! mb-0!"
                rules={[
                  { required: true, message: "PayPal email is required." },
                  { type: "email", message: "Enter a valid email." },
                ]}
              >
                <Input placeholder="you@example.com" />
              </Form.Item>
            )}
          </div>
        )}

        <div className="text-[11px] tracking-[0.16em] text-tan mt-5.5 mb-2">
          PROMO CODE
        </div>
        <div className="flex gap-2 items-start">
          <Form.Item name="promo_code" className="flex-1 mb-0!">
            <Input
              placeholder="Promo code"
              onPressEnter={(e) => e.preventDefault()}
            />
          </Form.Item>
          <Button loading={promoPending} onClick={onApplyPromo}>
            APPLY
          </Button>
        </div>
        {promoResult?.valid && (
          <div className="text-[11px] text-success mt-1.5">
            Promo applied — {promoResult.discountPct}% off.
          </div>
        )}
        {promoResult?.error && (
          <div className="text-[11px] text-danger mt-1.5">
            {promoResult.error}
          </div>
        )}

        {state?.error && (
          <Alert
            type="error"
            message={state.error}
            showIcon
            className="mt-4!"
          />
        )}
      </div>

      <div className="border border-hairline bg-card p-5">
        <div className="text-xl font-semibold mb-3.5">Order</div>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-2.5 py-2 border-b border-divider text-sm text-tan"
          >
            <span>{item.name}</span>
            <span className="text-foreground">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>
        ))}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-tan py-1">
            <span>PROMO DISCOUNT</span>
            <span className="text-danger">−${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline py-4">
          <span className="text-lg">Total</span>
          <span className="text-[26px] text-gold-light">
            ${displayedTotal.toFixed(2)}
          </span>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={pending}
          className="h-auto! py-3.5! text-[13px]! font-semibold! tracking-[0.14em]!"
        >
          {pending ? "PROCESSING…" : `PAY $${displayedTotal.toFixed(2)}`}
        </Button>
        <div className="text-[10px] text-muted text-center mt-3">
          MOCK STORE · NO REAL CHARGE
        </div>
      </div>
    </Form>
  );
}
