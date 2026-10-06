"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { Button, Alert } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { addToCart, toggleFavorite } from "@/app/actions/items";

export default function ItemDetailActions({ item, initialFavorited, initialInCart, owned = false }) {
  const boundAddToCart = addToCart.bind(null, item.id);
  const [state, formAction, pending] = useActionState(boundAddToCart, undefined);
  const inCart = initialInCart || state?.success;

  const [favorited, setFavorited] = useState(initialFavorited);
  const [favPending, startFavTransition] = useTransition();

  const onToggleFavorite = () => {
    startFavTransition(async () => {
      const result = await toggleFavorite(item.id);
      if (result?.favorited !== undefined) setFavorited(result.favorited);
    });
  };

  const favoriteButton = (
    <Button
      shape="default"
      loading={favPending}
      onClick={onToggleFavorite}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      icon={favorited ? <HeartFilled className="text-danger!" /> : <HeartOutlined />}
    />
  );

  if (item.is_battle_pass) {
    return (
      <div className="flex gap-2.5 items-stretch">
        <Link href="/battle-pass" className="flex-1">
          <Button type="primary" block>
            BATTLE PASS
          </Button>
        </Link>
        {favoriteButton}
      </div>
    );
  }

  if (item.is_dlc) {
    return (
      <div className="flex gap-2.5 items-stretch">
        <Button
          type="primary"
          block
          className="flex-1"
          href={item.dlc_steam_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          STEAM
        </Button>
        {favoriteButton}
      </div>
    );
  }

  if (owned) {
    return (
      <div className="flex gap-2.5 items-stretch">
        <Button block disabled className="flex-1">
          ALREADY OWNED
        </Button>
        {favoriteButton}
      </div>
    );
  }

  if (inCart) {
    return (
      <div className="flex gap-2.5 items-stretch">
        <Button block disabled className="flex-1">
          IN CART
        </Button>
        {favoriteButton}
      </div>
    );
  }

  return (
    <div>
      <form action={formAction} className="flex gap-2.5 items-stretch">
        <Button type="primary" htmlType="submit" block loading={pending} className="flex-1">
          ADD TO CART
        </Button>
        {favoriteButton}
      </form>
      {state?.error && <Alert type="error" title={state.error} showIcon className="mt-3!" />}
    </div>
  );
}
