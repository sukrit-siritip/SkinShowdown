"use client";

import { useActionState, startTransition } from "react";
import { Form, Input, Button, Alert } from "antd";
import { resetPassword } from "@/app/actions/auth";
import { fieldLabel } from "../field-label";

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, undefined);

  const onFinish = (values) => {
    const fd = new FormData();
    fd.append("password", values.password);
    fd.append("confirmPassword", values.confirmPassword);
    startTransition(() => formAction(fd));
  };

  return (
    <>
      <h1 className="font-bold text-[26px] mb-5">Set a new password</h1>
      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          name="password"
          label={fieldLabel("NEW PASSWORD")}
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
            { required: true, message: "Please re-enter your new password." },
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
          <Input.Password placeholder="Re-enter your new password" autoComplete="new-password" />
        </Form.Item>
        {state?.error && (
          <Alert type="error" title={state.error} showIcon className="mb-4" />
        )}
        <Button type="primary" htmlType="submit" block loading={pending}>
          UPDATE PASSWORD
        </Button>
      </Form>
    </>
  );
}
