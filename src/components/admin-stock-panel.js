"use client";

import { useOptimistic, useState, useTransition } from "react";
import { App, Button, Checkbox, Input } from "antd";
import {
  generateCodes,
  addPastedCodes,
  removeCodes,
} from "@/app/actions/admin-stock";

function StatusBadge({ status }) {
  const sold = status === "sold";
  return (
    <span
      className={`text-[10px] px-2 py-0.75 border inline-block justify-self-start ${
        sold ? "border-hairline text-muted" : "border-line text-success"
      }`}
    >
      {sold ? "SOLD" : "AVAILABLE"}
    </span>
  );
}

const COLUMNS = "auto 1.6fr 0.8fr 0.6fr";

export default function AdminStockPanel({ item, codes, readOnly }) {
  const { message } = App.useApp();
  const [paste, setPaste] = useState("");
  const [generating, startGenerate] = useTransition();
  const [adding, startAdd] = useTransition();
  const [removing, startRemove] = useTransition();
  const [selected, setSelected] = useState(() => new Set());

  const [optimisticCodes, removeOptimistically] = useOptimistic(
    codes,
    (state, removedIds) => state.filter((c) => !removedIds.includes(c.id)),
  );

  if (!item) {
    return (
      <div className="border border-hairline bg-card p-8 text-center text-sm text-muted">
        {codes === null
          ? "No skins yet — add one in Content Management first."
          : "Select a skin to manage its stock."}
      </div>
    );
  }

  const available = optimisticCodes.filter((c) => c.status === "available");
  const removableIds = available.map((c) => c.id);
  const allSelected =
    removableIds.length > 0 && removableIds.every((id) => selected.has(id));

  const toggleOne = (id, checked) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  const toggleAll = (checked) =>
    setSelected(checked ? new Set(removableIds) : new Set());

  const doRemove = (codeIds) =>
    startRemove(async () => {
      removeOptimistically(codeIds);
      setSelected((prev) => {
        const next = new Set(prev);
        codeIds.forEach((id) => next.delete(id));
        return next;
      });
      const result = await removeCodes(item.id, codeIds);
      if (result?.error) message.error(result.error);
      else
        message.success(
          codeIds.length > 1
            ? `Removed ${result.removed} codes.`
            : "Code removed.",
        );
    });

  const onGenerate = () =>
    startGenerate(async () => {
      const result = await generateCodes(item.id, 10);
      if (result?.error) message.error(result.error);
      else message.success(`Added ${result.added} codes.`);
    });

  const onAddPasted = () =>
    startAdd(async () => {
      const result = await addPastedCodes(item.id, paste);
      if (result?.error) message.error(result.error);
      else {
        message.success(`Added ${result.added} codes.`);
        setPaste("");
      }
    });

  return (
    <div className="border border-hairline bg-card p-5">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <div className="text-base">{item.name}</div>
          <div className="text-[10px] text-muted">{item.base}</div>
        </div>
        <span className="text-xs text-tan">{available.length} available</span>
      </div>

      {!readOnly && (
        <>
          <Button onClick={onGenerate} loading={generating} className="mb-4">
            + GENERATE 10 CODES
          </Button>

          <Input.TextArea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder="Paste codes, one per line"
            rows={2}
            className="mb-2.5"
          />
          <Button
            onClick={onAddPasted}
            loading={adding}
            disabled={!paste.trim()}
            className="mb-4.5"
          >
            ADD PASTED CODES
          </Button>
        </>
      )}

      <div className="border-t border-divider max-h-[420px] overflow-y-auto scrollbar-thin">
        <div
          className="grid gap-2.5 py-2.5 text-[10px] tracking-[0.16em] text-muted border-b border-divider items-center"
          style={{ gridTemplateColumns: COLUMNS }}
        >
          {readOnly ? (
            <span />
          ) : (
            <Checkbox
              checked={allSelected}
              indeterminate={selected.size > 0 && !allSelected}
              disabled={removableIds.length === 0}
              onChange={(e) => toggleAll(e.target.checked)}
              aria-label="Select all available codes"
            />
          )}
          <span>CODE</span>
          <span>STATUS</span>
          <span className="text-right">ACTION</span>
        </div>

        {!readOnly && selected.size > 0 && (
          <div className="flex items-center justify-between py-2.5 border-b border-divider">
            <span className="text-xs text-tan">{selected.size} selected</span>
            <Button
              size="small"
              danger
              loading={removing}
              onClick={() => doRemove([...selected])}
            >
              ✕ DELETE SELECTED
            </Button>
          </div>
        )}

        {optimisticCodes.map((c) => (
          <div
            key={c.id}
            className="grid gap-2.5 py-2.5 border-b border-divider last:border-b-0 items-center"
            style={{ gridTemplateColumns: COLUMNS }}
          >
            {!readOnly && c.status === "available" ? (
              <Checkbox
                checked={selected.has(c.id)}
                onChange={(e) => toggleOne(c.id, e.target.checked)}
                aria-label={`Select code ${c.code}`}
              />
            ) : (
              <span />
            )}
            <span className="text-xs tracking-[0.04em]">{c.code}</span>
            <StatusBadge status={c.status} />
            <span className="text-right">
              {!readOnly && c.status === "available" && (
                <Button
                  type="text"
                  size="small"
                  danger
                  onClick={() => doRemove([c.id])}
                  className="text-[11px]!"
                >
                  ✕ REMOVE
                </Button>
              )}
            </span>
          </div>
        ))}
        {optimisticCodes.length === 0 && (
          <div className="py-8 text-center text-[13px] text-muted">
            No codes yet.
          </div>
        )}
      </div>
    </div>
  );
}
