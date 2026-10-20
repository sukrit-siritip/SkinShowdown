import { Skeleton } from "antd";

export default function HistoryFiltersSkeleton() {
  return (
    <div className="flex items-end gap-3.5 flex-wrap mb-5.5">
      <div>
        <div className="text-[11px] tracking-[0.14em] text-tan mb-2">FROM</div>
        <Skeleton.Input active size="default" />
      </div>
      <div>
        <div className="text-[11px] tracking-[0.14em] text-tan mb-2">TO</div>
        <Skeleton.Input active size="default" />
      </div>
    </div>
  );
}
