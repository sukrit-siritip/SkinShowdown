"use client";

import { useActionState, startTransition } from "react";
import Link from "next/link";
import { Form, Input, Button, Alert } from "antd";
import { forgotPassword } from "@/app/actions/auth";
import { fieldLabel } from "../field-label";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPassword, undefined);

  const onFinish = (values) => {
    const fd = new FormData();
    fd.append("email", values.email);
    startTransition(() => formAction(fd));
  };

  return (
    <>
      <h1 className="font-bold text-[26px] mb-2">Forgot password</h1>
      <p className="text-sm text-muted mb-5 leading-relaxed">
        We&apos;ll send a reset link to your email.
      </p>

      {state?.success ? (
        <div className="text-xs text-success mb-4">
          Reset link sent to {state.email}. Check your inbox.
        </div>
      ) : (
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label={fieldLabel("EMAIL")}
            rules={[
              { required: true, message: "Email is required." },
              { type: "email", message: "Enter a valid email." },
            ]}
          >
            <Input placeholder="hunter@bayou.mail" autoComplete="email" />
          </Form.Item>
          {state?.error && (
            <Alert type="error" title={state.error} showIcon className="mb-4" />
          )}
          <Button type="primary" htmlType="submit" block loading={pending}>
            SEND RESET LINK
          </Button>
        </Form>
      )}

      <div className="text-center mt-4">
        <Link href="/login" className="text-[11px] text-muted">
          ← BACK TO SIGN IN
        </Link>
      </div>
    </>
  );
}
