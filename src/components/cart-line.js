"use client";

import { useTransition } from "react";
import Image from "next/image";
import { itemRender } from "@/lib/renders";
import { App, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { removeCartItem } from "@/app/actions/cart";

export default function CartLine({ item }) {
  const [pending, startTransition] = useTransition();
  const { message } = App.useApp();

  const onRemove = () => {
    startTransition(async () => {
      const result = await removeCartItem(item.id);
      if (result?.error) message.error(result.error);
    });
  };

  const meta = [item.slot, item.weapon].filter(Boolean).join(" · ").toUpperCase();
  const cover = itemRender(item);

  return (
    <div
      className={`flex gap-3.5 items-center p-3.5 border-b border-divider transition-opacity duration-200 hover:bg-hover ${
        pending ? "opacity-40" : ""
      }`}
    >
      <div
        className="relative w-[82px] h-[58px] flex-none overflow-hidden"
        style={{
          background: cover
            ? "#0a0e12"
            : "repeating-linear-gradient(135deg, #131820 0 6px, #181f2a 6px 12px)",
        }}
      >
        {cover && <Image src={cover.src} alt="" fill sizes="82px" quality={90} className="object-contain p-0.5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[17px]">{item.name}</div>
        <div className="text-[11px] text-dim">{meta}</div>
      </div>
      <div className="text-[15px] w-20 text-right">${Number(item.price).toFixed(2)}</div>
      <Button
        type="text"
        size="small"
        loading={pending}
        onClick={onRemove}
        aria-label={`Remove ${item.name} from cart`}
        icon={!pending && <CloseOutlined />}
        className="text-muted! hover:text-danger!"
      />
    </div>
  );
}
