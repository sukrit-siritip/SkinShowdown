"use client";

import { useActionState, useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { App, Button, Form, Input, Popconfirm, Switch } from "antd";
import { deleteEvent, saveEvent } from "@/app/actions/admin-events";
import AdminEventMediaField from "@/components/admin-event-media-field";

function Label({ children }) {
  return (
    <span className="text-[10px] tracking-[0.08em] text-muted">{children}</span>
  );
}

function ToggleRow({ name, label }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-t border-divider">
      <span className="text-sm text-tan">{label}</span>
      <Form.Item name={name} valuePropName="checked" noStyle>
        <Switch size="small" aria-label={label} />
      </Form.Item>
    </div>
  );
}

export default function AdminEventForm({ event, readOnly }) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [state, formAction, saving] = useActionState(saveEvent, null);
  const [, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (state?.error) message.error(state.error);
    else if (state?.success) message.success("Saved.");
  }, [state, message]);

  useEffect(() => {
    if (searchParams.get("saved") !== "1") return;
    message.success("Event created.");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("saved");
    router.replace(
      params.size > 0 ? `${pathname}?${params.toString()}` : pathname,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onFinish = (values) => {
    const fd = new FormData();
    if (event?.id) fd.set("id", event.id);
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && value !== null) fd.set(key, String(value));
    }
    fd.set("active", String(Boolean(values.active)));
    startSave(() => formAction(fd));
  };

  const onDelete = () =>
    startDelete(async () => {
      const result = await deleteEvent(event.id);
      if (result?.error) message.error(result.error);
    });

  return (
    <div className="border border-hairline bg-card p-5">
      <div className="text-[11px] tracking-[0.16em] text-tan mb-4">
        {event ? "EDIT EVENT" : "NEW EVENT"}
      </div>
      {readOnly && (
        <div className="px-3 py-2.5 border border-hairline text-xs text-muted mb-3.5">
          View-only access — changes are disabled.
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        disabled={readOnly}
        onFinish={onFinish}
        initialValues={{
          title: event?.title,
          tag: event?.tag,
          body: event?.body ?? "",
          cta_label: event?.cta_label,
          cta_link: event?.cta_link,
          media_url: event?.media_url ?? "",
          active: event?.active ?? false,
        }}
      >
        <Form.Item
          name="title"
          label={<Label>TITLE</Label>}
          rules={[
            {
              required: true,
              whitespace: true,
              max: 80,
              message: "Title is required (80 max).",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          name="tag"
          label={<Label>TAG (e.g. ACTIVE EVENT · ENDS IN 84 DAYS)</Label>}
          rules={[
            {
              required: true,
              whitespace: true,
              max: 60,
              message: "Tag is required (60 max).",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          name="body"
          label={<Label>BODY</Label>}
          rules={[{ max: 600, message: "600 characters max." }]}
        >
          <Input.TextArea
            allowClear
            autoSize={{ minRows: 3, maxRows: 8 }}
            showCount
            maxLength={600}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="cta_label"
            label={<Label>CTA LABEL</Label>}
            rules={[
              {
                required: true,
                whitespace: true,
                max: 40,
                message: "Required (40 max).",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="cta_link"
            label={<Label>CTA LINKS TO</Label>}
            rules={[{ required: true, whitespace: true, message: "Required." }]}
          >
            <Input allowClear placeholder="/items, /category, https://…" />
          </Form.Item>
        </div>

        <Form.Item
          name="media_url"
          label={<Label>MEDIA (IMAGE OR YOUTUBE LINK)</Label>}
          rules={[{ max: 500, message: "500 characters max." }]}
          className="mb-3.5!"
        >
          <AdminEventMediaField disabled={readOnly} />
        </Form.Item>

        <ToggleRow name="active" label="Active" />

        <div className="flex gap-2.5 pt-3.5">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={saving}
            className="flex-1"
          >
            SAVE
          </Button>
          <Button
            onClick={() => form.resetFields()}
            disabled={readOnly || saving || deleting}
          >
            RESET
          </Button>
          {event && (
            <Popconfirm
              title="Delete this event?"
              description="Removes it from the homepage carousel immediately."
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={onDelete}
              disabled={readOnly}
            >
              <Button danger loading={deleting}>
                DELETE
              </Button>
            </Popconfirm>
          )}
        </div>
      </Form>
    </div>
  );
}
