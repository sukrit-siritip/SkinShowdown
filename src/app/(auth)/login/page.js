"use client";

import { useActionState, startTransition } from "react";
import Link from "next/link";
import { Form, Input, Button, Alert } from "antd";
import { login } from "@/app/actions/auth";
import AuthTabs from "../auth-tabs";
import { fieldLabel } from "../field-label";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  const onFinish = (values) => {
    const fd = new FormData();
    fd.append("email", values.email);
    fd.append("password", values.password);
    startTransition(() => formAction(fd));
  };

  return (
    <>
      <AuthTabs active="login" />
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
        <Form.Item
          name="password"
          label={fieldLabel("PASSWORD")}
          rules={[{ required: true, message: "Password is required." }]}
        >
          <Input.Password placeholder="Your password" autoComplete="current-password" />
        </Form.Item>
        <div className="text-right -mt-2 mb-5">
          <Link href="/forgot-password" className="text-[11px] text-gold!">
            FORGOT PASSWORD?
          </Link>
        </div>
        {state?.error && (
          <Alert type="error" title={state.error} showIcon className="mb-4" />
        )}
        <Button type="primary" htmlType="submit" block loading={pending}>
          SIGN IN
        </Button>
      </Form>
    </>
  );
}
