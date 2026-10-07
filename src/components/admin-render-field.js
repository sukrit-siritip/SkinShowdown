"use client";

import { useEffect, useState } from "react";
import { App, Button, Image, Upload } from "antd";
import { DeleteOutlined, InboxOutlined, SwapOutlined } from "@ant-design/icons";
import { ACCEPTED_TYPES, prepareRender } from "@/lib/image-resize";

export default function AdminRenderField({ label, value, onChange, disabled }) {
  const { message } = App.useApp();
  const [processing, setProcessing] = useState(false);
  const src = value?.pending?.preview ?? value?.src;
  const width = value?.pending?.width ?? value?.width;
  const height = value?.pending?.height ?? value?.height;

  useEffect(() => {
    const preview = value?.pending?.preview;
    return () => preview && URL.revokeObjectURL(preview);
  }, [value?.pending?.preview]);

  const beforeUpload = async (file) => {
    setProcessing(true);
    try {
      onChange({ pending: await prepareRender(file) });
    } catch (error) {
      message.error(error.message);
    } finally {
      setProcessing(false);
    }
    return Upload.LIST_IGNORE;
  };

  const picker = {
    accept: ACCEPTED_TYPES.join(","),
    multiple: false,
    showUploadList: false,
    disabled: disabled || processing,
    beforeUpload,
  };

  if (!src) {
    return (
      <Upload.Dragger {...picker} className="block! [&_.ant-upload-drag]:bg-sunken! [&_.ant-upload-drag]:border-line!">
        <div className="py-2 px-1">
          <InboxOutlined className="text-xl text-muted!" />
          <div className="text-[11px] text-tan mt-1">{processing ? "PROCESSING…" : label}</div>
          <div className="text-[9px] text-muted mt-0.5">Drop or click · PNG, JPG, WebP · 10 MB</div>
        </div>
      </Upload.Dragger>
    );
  }

  return (
    <div className="border border-line bg-sunken">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={src}
          alt={label}
          width="100%"
          height="100%"
          rootClassName="block! h-full!"
          className="object-contain! h-full! p-2!"
        />
        <span className="absolute top-1.5 left-1.5 text-[9px] tracking-[0.08em] px-1.5 py-0.5 bg-background/80 text-tan pointer-events-none">
          {label}
          {value?.pending && " · UNSAVED"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1 px-2 py-1.5">
        <span className="text-[10px] text-muted">
          {width}×{height}
        </span>
        <div className="flex gap-1">
          <Upload {...picker}>
            <Button size="small" type="text" icon={<SwapOutlined />} loading={processing} aria-label={`Replace ${label}`} />
          </Upload>
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            disabled={disabled}
            onClick={() => onChange(null)}
            aria-label={`Remove ${label}`}
          />
        </div>
      </div>
    </div>
  );
}
