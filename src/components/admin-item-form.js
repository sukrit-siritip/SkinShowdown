"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { App, Button, Form, Input, InputNumber, Popconfirm, Select, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addItemBase, deleteItem, saveItem } from "@/app/actions/admin-items";
import { ITEM_TYPES, ITEM_TYPE_BY_VALUE } from "@/lib/item-type-groups";
import { RENDER_BUCKET, itemRender } from "@/lib/renders";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import AdminRenderField from "@/components/admin-render-field";

function BaseSelect({ value, onChange, options, onAdd, adding, canAdd, ...rest }) {
  const [search, setSearch] = useState("");
  const term = search.trim();
  const exists = options.some((name) => name.toLowerCase() === term.toLowerCase());

  return (
    <Select
      {...rest}
      value={value}
      onChange={onChange}
      placeholder="Pick from the list"
      options={options.map((name) => ({ value: name, label: name }))}
      showSearch={{ searchValue: search, onSearch: setSearch, optionFilterProp: "label" }}
      notFoundContent={<span className="text-xs text-muted">Not in the list yet</span>}
      popupRender={(menu) => (
        <>
          {menu}
          {canAdd && term && !exists && (
            <Button
              type="text"
              block
              icon={<PlusOutlined />}
              loading={adding}
              onClick={() => onAdd(term, () => setSearch(""))}
              className="justify-start! border-t! border-divider! text-gold!"
            >
              Add “{term}”
            </Button>
          )}
        </>
      )}
    />
  );
}

function Label({ children }) {
  return <span className="text-[10px] tracking-[0.08em] text-muted">{children}</span>;
}

function ToggleRow({ name, label, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-t border-divider">
      <span className="text-sm text-tan">{label}</span>
      <Form.Item name={name} valuePropName="checked" noStyle>
        <Switch size="small" aria-label={label} onChange={onChange} />
      </Form.Item>
    </div>
  );
}

function Note({ children }) {
  return (
    <div className="px-3 py-2.5 border border-hairline text-xs text-muted mb-3.5">{children}</div>
  );
}

export default function AdminItemForm({
  item,
  codesLeft,
  basesByType,
  readOnly,
}) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [state, formAction, saving] = useActionState(saveItem, null);
  const [, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [adding, startAdd] = useTransition();
  const [bases, setBases] = useState(basesByType);
  const [uploading, setUploading] = useState(false);
  const uploadedRef = useRef(null);

  const type = Form.useWatch("type", form);
  const typeInfo = ITEM_TYPE_BY_VALUE[type];

  const render = Form.useWatch("render", form);
  const published = Form.useWatch("published", form);
  const renderSrc = render?.pending?.preview ?? render?.src;

  useEffect(() => {
    if (state?.error) {
      message.error(state.error);
      const uploaded = uploadedRef.current;
      uploadedRef.current = null;
      if (uploaded) createBrowserClient().storage.from(RENDER_BUCKET).remove([uploaded]);
    } else if (state?.success) {
      uploadedRef.current = null;
      form.resetFields();
      message.success("Saved.");
    }
  }, [state, message, form]);

  const uploadRender = async (value) => {
    if (!value) return {};
    if (!value.pending) {
      return { render_path: value.path, render_width: value.width, render_height: value.height };
    }
    const { blob, ext, width, height } = value.pending;
    const path = `items/${crypto.randomUUID()}.${ext}`;
    const { error } = await createBrowserClient()
      .storage.from(RENDER_BUCKET)
      .upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
    if (error) throw new Error("Couldn't upload the render. Try again.");
    uploadedRef.current = path;
    return { render_path: path, render_width: width, render_height: height };
  };

  const onFinish = async (values) => {
    const rest = { ...values };
    delete rest.render;
    setUploading(true);
    let renderFields;
    try {
      renderFields = await uploadRender(values.render);
    } catch (error) {
      message.error(error.message);
      return;
    } finally {
      setUploading(false);
    }

    const fd = new FormData();
    if (item?.id) fd.set("id", item.id);
    for (const [key, value] of Object.entries({ ...rest, ...renderFields })) {
      if (value !== undefined && value !== null) fd.set(key, String(value));
    }
    fd.set("published", String(Boolean(values.published)));
    startSave(() => formAction(fd));
  };

  const onAddBase = (name, done) =>
    startAdd(async () => {
      const result = await addItemBase(type, name);
      if (result?.error) return message.error(result.error);
      setBases((prev) => ({
        ...prev,
        [type]: [...new Set([...(prev[type] ?? []), result.name])].sort(),
      }));
      form.setFieldValue("base", result.name);
      done();
    });

  const onTypeChange = (next) => {
    const current = form.getFieldValue("base");
    if (!bases[next]?.includes(current)) form.setFieldValue("base", undefined);
  };

  const onDelete = () =>
    startDelete(async () => {
      const result = await deleteItem(item.id);
      if (result?.error) message.error(result.error);
    });

  return (
    <div className="border border-hairline bg-card p-5">
      <div className="text-[11px] tracking-[0.16em] text-tan mb-4">
        {item ? "EDIT SKIN" : "NEW SKIN"}
      </div>
      {readOnly && <Note>View-only access — changes are disabled.</Note>}

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        disabled={readOnly}
        onFinish={onFinish}
        initialValues={{
          name: item?.name,
          type: item?.type ?? "compact_ammo",
          base: item?.base,
          price: item?.price != null ? Number(item.price) : undefined,
          description: item?.description ?? "",
          published: item?.published ?? false,
          render: itemRender(item),
        }}
      >
        <Form.Item
          name="name"
          label={<Label>NAME</Label>}
          rules={[{ required: true, whitespace: true, max: 80, message: "Name is required (80 max)." }]}
        >
          <Input allowClear />
        </Form.Item>

        <div className={typeInfo?.fixedBase ? "" : "grid grid-cols-2 gap-3"}>
          <Form.Item name="type" label={<Label>TYPE</Label>} extra={`Slot: ${typeInfo?.slot ?? "—"}`}>
            <Select options={ITEM_TYPES} onChange={onTypeChange} />
          </Form.Item>
          {!typeInfo?.fixedBase && (
            <Form.Item
              name="base"
              label={<Label>{typeInfo?.weapon ? "WEAPON" : typeInfo?.label.toUpperCase()}</Label>}
              rules={[{ required: true, message: "Pick one from the list." }]}
            >
              <BaseSelect
                allowClear
                options={bases[type] ?? []}
                onAdd={onAddBase}
                adding={adding}
                canAdd={!readOnly}
              />
            </Form.Item>
          )}
        </div>

        <div className="border-t border-divider pt-3.5">
          <Form.Item
            name="price"
            label={<Label>PRICE</Label>}
            rules={[{ required: true, message: "Price is required." }]}
          >
            <InputNumber min={0.01} max={9999.99} step={0.01} precision={2} prefix="$" className="w-full!" />
          </Form.Item>
        </div>

        {item && (
          <Link
            href={`/admin/stock?item=${item.id}`}
            className="flex items-center justify-between gap-3 px-3 py-2.5 mb-3.5 border border-hairline bg-input transition-colors duration-300 hover:border-gold"
          >
            <span className="text-[13px] text-tan">Codes left: {codesLeft ?? 0}</span>
            <span className="text-[11px] text-gold">MANAGE IN STOCK &amp; CODES →</span>
          </Link>
        )}

        <Form.Item
          name="description"
          label={<Label>DESCRIPTION</Label>}
          rules={[{ max: 500, message: "500 characters max." }]}
        >
          <Input.TextArea allowClear autoSize={{ minRows: 3, maxRows: 8 }} showCount maxLength={500} />
        </Form.Item>

        <div className="mb-3.5">
          <Label>SKIN RENDER</Label>
          <div className="mt-1.5">
            <Form.Item name="render" noStyle>
              <AdminRenderField label="RENDER" disabled={readOnly} />
            </Form.Item>
          </div>
          <div className="text-[10px] text-muted mt-1.5">
            16:9 recommended · resized to 2560px max and converted to WebP on save
          </div>
          {renderSrc && (
            <div className="mt-3">
              <Label>CARD PREVIEW</Label>
              <div className="relative h-37.5 w-58 max-w-full mt-1.5 border border-hairline overflow-hidden bg-background">
                <img src={renderSrc} alt="" className="absolute inset-0 w-full h-full object-contain p-2" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,18,0.85),transparent_45%,transparent_60%,rgba(10,14,18,0.85))]" />
              </div>
            </div>
          )}
        </div>

        <ToggleRow name="published" label="Published" />
        {published && !render && (
          <div className="text-[11px] text-gold -mt-1 mb-2">
            No render yet — the storefront will show a placeholder.
          </div>
        )}

        <div className="flex gap-2.5 pt-3">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={uploading || saving}
            className="flex-1"
          >
            {uploading ? "UPLOADING…" : "SAVE"}
          </Button>
          <Button onClick={() => form.resetFields()} disabled={readOnly || saving || uploading}>
            RESET
          </Button>
          {item && (
            <Popconfirm
              title="Delete this skin?"
              description="Removes it everywhere, including carts and unsold codes."
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
