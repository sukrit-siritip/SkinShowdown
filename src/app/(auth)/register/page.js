"use client";

import { useActionState, startTransition } from "react";
import { Form, Input, Button, Alert, Checkbox } from "antd";
import { register } from "@/app/actions/auth";
import AuthTabs from "../auth-tabs";
import { fieldLabel } from "../field-label";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, undefined);

  if (state?.success) {
    return (
      <>
        <AuthTabs active="register" />
        <Alert type="success" showIcon title={state.message} />
      </>
    );
  }

  const onFinish = (values) => {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("email", values.email);
    fd.append("password", values.password);
    fd.append("confirmPassword", values.confirmPassword);
    if (values.agree) fd.append("agree", "on");
    startTransition(() => formAction(fd));
  };

  return (
    <>
      <AuthTabs active="register" />
      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          name="name"
          label={fieldLabel("DISPLAY NAME")}
          rules={[{ required: true, message: "Display name is required." }]}
        >
          <Input placeholder="e.g. Bayou_Reaper" />
        </Form.Item>
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
          rules={[
            { required: true, message: "Password is required." },
            { min: 8, message: "Password must be at least 8 characters." },
          ]}
        >
          <Input.Password placeholder="At least 8 characters" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label={fieldLabel("CONFIRM PASSWORD")}
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please re-enter your password." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match."));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Re-enter your password" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, checked) =>
                checked
                  ? Promise.resolve()
                  : Promise.reject(new Error("You must agree to the terms to continue.")),
            },
          ]}
        >
          <Checkbox>
            <span className="text-muted text-xs">
              I agree to the terms and confirm this is a fan project, unaffiliated with the
              game&apos;s publisher.
            </span>
          </Checkbox>
        </Form.Item>
        {state?.error && (
          <Alert type="error" title={state.error} showIcon className="mb-4!" />
        )}
        <Button type="primary" htmlType="submit" block loading={pending}>
          REGISTER
        </Button>
      </Form>
    </>
  );
}
