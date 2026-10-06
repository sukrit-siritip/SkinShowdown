import Link from "next/link";
import { Card } from "antd";

export default function StatCard({
  href,
  label,
  labelClassName = "text-tan",
  value,
  valueClassName = "text-[32px]",
  description,
  descriptionClassName = "text-muted",
  style,
}) {
  const card = (
    <Card
      hoverable
      variant="borderless"
      className="h-full"
      classNames={{ body: "p-4.5! h-full flex flex-col justify-between" }}
      style={{ border: "1px solid #2d3543", background: "#0f131a", borderRadius: 0, ...style }}
    >
      <div className={`text-[10px] tracking-[0.18em] mb-2.5 ${labelClassName}`}>{label}</div>
      <div className={valueClassName}>{value}</div>
      <div className={`text-[13px] ${descriptionClassName}`}>{description}</div>
    </Card>
  );

  return href ? (
    <Link href={href} className="block h-full text-foreground!">
      {card}
    </Link>
  ) : (
    card
  );
}
