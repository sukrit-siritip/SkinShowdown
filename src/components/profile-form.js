"use client";

import { useActionState, startTransition } from "react";
import { Form, Input, Button, Alert } from "antd";
import { updateProfile } from "@/app/actions/profile";

function label(text) {
  return <span className="text-[11px] tracking-[0.14em] text-tan">{text}</span>;
}

export default function ProfileForm({ initialName, initialEmail, locked = false }) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  const onFinish = (values) => {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("email", values.email);
    fd.append("password", values.password || "");
    fd.append("confirmPassword", values.confirmPassword || "");
    startTransition(() => formAction(fd));
  };

  return (
    <Form
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      disabled={locked}
      initialValues={{ name: initialName, email: initialEmail }}
    >
      {locked && (
        <Alert
          type="info"
          title="Demo account — profile changes are disabled."
          showIcon
          className="mb-4!"
        />
      )}
      <Form.Item
        name="name"
        label={label("DISPLAY NAME")}
        rules={[{ required: true, message: "Display name is required." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label={label("EMAIL")}
        rules={[
          { required: true, message: "Email is required." },
          { type: "email", message: "Enter a valid email." },
        ]}
      >
        <Input />
      </Form.Item>

      <div className="pt-3 mb-4.5">
        <div className="h-px bg-hairline" />
      </div>

      <Form.Item name="password" label={label("NEW PASSWORD")}>
        <Input.Password placeholder="Leave blank to keep current" autoComplete="new-password" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label={label("CONFIRM PASSWORD")}
        dependencies={["password"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!getFieldValue("password") || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match."));
            },
          }),
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>

      {state?.error && <Alert type="error" title={state.error} showIcon className="mb-4!" />}
      {state?.success && <Alert type="success" title={state.message} showIcon className="mb-4!" />}

      <Button type="primary" htmlType="submit" block loading={pending} className="mt-6!">
        SAVE CHANGES
      </Button>
    </Form>
  );
}
