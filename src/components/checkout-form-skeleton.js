import { Skeleton } from "antd";

export default function CheckoutFormSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(300px,1.4fr)_minmax(260px,0.8fr)] gap-7 items-start">
      <div className="border border-hairline bg-card p-5.5">
        <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 1, width: "100%" }} />
        <Skeleton.Button active size="large" block className="mt-5! mb-5.5!" />
        <Skeleton active title={false} paragraph={{ rows: 3, width: ["100%", "60%", "40%"] }} />
      </div>
      <div className="border border-hairline bg-card p-5">
        <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 3 }} />
        <Skeleton.Button active size="large" block className="mt-3!" />
      </div>
    </div>
  );
}
