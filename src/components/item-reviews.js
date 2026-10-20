"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Button, Rate, Input } from "antd";
import { submitReview, deleteReview } from "@/app/actions/items";

function StarLine({ rating }) {
  return <Rate disabled allowHalf={false} value={rating} className="text-sm!" />;
}

function ReviewForm({ itemId, existingReview, onDone }) {
  const boundSubmit = submitReview.bind(null, itemId);
  const [state, formAction, pending] = useActionState(boundSubmit, undefined);
  const [rating, setRating] = useState(existingReview?.rating ?? 0);

  useEffect(() => {
    if (state?.success && onDone) onDone();
  }, [state]);

  return (
    <div className="border border-hairline bg-card p-5">
      <div className="text-sm font-semibold mb-3.5">
        {existingReview ? "Edit your review" : "Write a review"}
      </div>
      <form action={formAction}>
        <input type="hidden" name="rating" value={rating} />
        <Rate value={rating} onChange={setRating} className="mb-4!" />
        <Input.TextArea
          name="text"
          rows={3}
          placeholder="Share your thoughts on this skin..."
          defaultValue={existingReview?.text}
          className="mb-3!"
        />
        {state?.error && <div className="text-xs text-danger mb-3">{state.error}</div>}
        <div className="flex gap-3">
          <Button type="primary" htmlType="submit" loading={pending}>
            POST REVIEW
          </Button>
          {onDone && (
            <Button type="text" onClick={onDone}>
              CANCEL
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function ItemReviews({ itemId, reviews, currentUserId, ownsItem }) {
  const [formOpen, setFormOpen] = useState(false);
  const [, startDeleteTransition] = useTransition();

  const myReview = reviews.find((r) => r.user_id === currentUserId);
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-190 mt-14 pt-10 border-t border-hairline">
      <div className="flex items-baseline gap-3.5 flex-wrap mb-5.5">
        <h2 className="font-bold text-2xl m-0">Reviews</h2>
        {reviews.length > 0 && (
          <>
            <span className="text-lg text-gold-light">{"★".repeat(Math.round(avgRating))}</span>
            <span className="text-[13px] text-muted">
              {avgRating.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          </>
        )}
      </div>

      {reviews.length === 0 && (
        <div className="border border-hairline bg-card p-6 text-center text-muted mb-7">
          No reviews yet. Be the first to leave one.
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mb-7">
          {reviews.map((r) => (
            <div key={r.id} className="border border-hairline bg-card p-4 mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold">{r.authorName}</span>
                <span className="text-[11px] text-muted">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-2">
                <StarLine rating={r.rating} />
              </div>
              <p className="text-sm leading-relaxed text-tan m-0">{r.text}</p>
              {r.user_id === currentUserId && (
                <div className="flex gap-3.5 mt-2.5">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => setFormOpen(true)}
                    className="text-[11px] tracking-[0.08em] text-tan cursor-pointer transition-colors hover:text-gold-light"
                  >
                    EDIT
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => startDeleteTransition(() => deleteReview(itemId, r.id))}
                    className="text-[11px] tracking-[0.08em] text-tan cursor-pointer transition-colors hover:text-danger"
                  >
                    DELETE
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {currentUserId === null && (
        <div className="border border-hairline bg-card p-5.5 text-center text-sm text-tan">
          <Link href="/login" className="text-gold-light! underline">
            Sign in
          </Link>{" "}
          to leave a review.
        </div>
      )}

      {currentUserId !== null && !ownsItem && (
        <div className="border border-hairline bg-card p-5.5 text-center text-sm text-tan">
          You must own this skin to leave a review.
        </div>
      )}

      {currentUserId !== null && ownsItem && !formOpen && (
        <Button type="primary" onClick={() => setFormOpen(true)}>
          {myReview ? "EDIT YOUR REVIEW" : "WRITE A REVIEW"}
        </Button>
      )}

      {currentUserId !== null && ownsItem && formOpen && (
        <ReviewForm itemId={itemId} existingReview={myReview} onDone={() => setFormOpen(false)} />
      )}
    </div>
  );
}
