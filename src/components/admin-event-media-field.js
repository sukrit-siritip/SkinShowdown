"use client";

import { useState } from "react";
import { App, Button, Input, Upload } from "antd";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { ACCEPTED_TYPES, prepareRender } from "@/lib/image-resize";
import { RENDER_BUCKET, renderUrl } from "@/lib/renders";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { parseEventMedia } from "@/lib/event-media";

export default function AdminEventMediaField({ value, onChange, disabled }) {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const media = parseEventMedia(value);

  const beforeUpload = async (file) => {
    setUploading(true);
    try {
      const { blob, ext } = await prepareRender(file);
      const path = `events/${crypto.randomUUID()}.${ext}`;
      const { error } = await createBrowserClient()
        .storage.from(RENDER_BUCKET)
        .upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
      if (error) throw new Error("Couldn't upload the image. Try again.");
      onChange(renderUrl(path));
    } catch (error) {
      message.error(error.message);
    } finally {
      setUploading(false);
    }
    return Upload.LIST_IGNORE;
  };

  return (
    <div>
      <Input
        allowClear
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="https://… or a youtube.com / youtu.be link"
        className="mb-2"
      />

      {media?.type === "image" ? (
        <div className="relative border border-line bg-sunken aspect-video overflow-hidden mb-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.src} alt="" className="w-full h-full object-contain" />
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            disabled={disabled}
            onClick={() => onChange("")}
            className="absolute! top-1! right-1! bg-background/80!"
            aria-label="Remove media"
          />
        </div>
      ) : media?.type === "youtube" ? (
        <div className="flex items-center justify-between px-3 py-2 border border-line bg-sunken mb-1">
          <span className="text-xs text-tan">YouTube video linked</span>
          <Button size="small" type="text" danger disabled={disabled} onClick={() => onChange("")}>
            REMOVE
          </Button>
        </div>
      ) : (
        <Upload.Dragger
          accept={ACCEPTED_TYPES.join(",")}
          multiple={false}
          showUploadList={false}
          disabled={disabled || uploading}
          beforeUpload={beforeUpload}
          className="block! [&_.ant-upload-drag]:bg-sunken! [&_.ant-upload-drag]:border-line!"
        >
          <div className="py-2 px-1">
            <InboxOutlined className="text-xl text-muted!" />
            <div className="text-[11px] text-tan mt-1">
              {uploading ? "UPLOADING…" : "OR DROP AN IMAGE"}
            </div>
            <div className="text-[9px] text-muted mt-0.5">PNG, JPG, WebP · 10 MB</div>
          </div>
        </Upload.Dragger>
      )}
    </div>
  );
}
