"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Segmented, Skeleton } from "antd";
import { motion } from "motion/react";
import { SALES_RANGES, bucketLabel } from "@/lib/admin-stats";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <Skeleton.Node active className="w-full! h-42.5!" />,
});

const usd = (value) =>
  `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const tooltipFor =
  (unit) =>
  ({ series, seriesIndex, dataPointIndex, w }) => {
    const label = w.globals.labels[dataPointIndex].toUpperCase();
    const value = series[seriesIndex][dataPointIndex];
    return `<div style="padding:8px 12px;background:#0f131a;border:1px solid #2d3543;font-family:var(--font-newsreader),serif">
    <div style="font-size:10px;letter-spacing:.14em;color:#a89968;margin-bottom:2px">${unit === "week" ? `WEEK OF ${label}` : label}</div>
    <div style="font-size:15px;color:#e0a92a">${usd(value)}</div>
  </div>`;
  };

export function SalesPanel({ seriesByRange }) {
  const [range, setRange] = useState("3M");
  const points = useMemo(
    () =>
      (seriesByRange[range] ?? []).map((row) => ({
        label: bucketLabel(row.bucket_start, SALES_RANGES[range].unit),
        revenue: Number(row.revenue),
      })),
    [seriesByRange, range]
  );

  return (
    <div className="border border-hairline bg-card p-4.5 h-full">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3.5">
        <div className="text-[11px] tracking-[0.16em] text-tan">
          SALES · {SALES_RANGES[range].title}
        </div>
        <Segmented
          size="small"
          value={range}
          onChange={setRange}
          options={Object.keys(SALES_RANGES)}
          aria-label="Sales range"
        />
      </div>
      <SalesChart points={points} unit={SALES_RANGES[range].unit} />
    </div>
  );
}

function SalesChart({ points, unit }) {
  const last = points.length - 1;
  const peak = Math.max(...points.map((w) => w.revenue), 0);
  const options = {
    chart: {
      background: "transparent",
      fontFamily: "var(--font-newsreader), serif",
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
      animations: { enabled: true, speed: 700, animateGradually: { enabled: true, delay: 40 } },
    },
    theme: { mode: "dark" },
    colors: points.map((_, i) => (i === last ? "#c41e3a" : "#3d4556")),
    plotOptions: {
      bar: {
        columnWidth: "78%",
        distributed: true,
        borderRadius: 0,
        colors: { backgroundBarColors: ["#151a23"], backgroundBarOpacity: 1 },
      },
    },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
    fill: { opacity: 1 },
    grid: { show: false, padding: { left: 0, right: 0, top: -10, bottom: -6 } },
    legend: { show: false },
    dataLabels: { enabled: false },
    xaxis: {
      categories: points.map((w) => w.label),
      labels: {
        formatter: (label) =>
          [points[0]?.label, points[Math.floor(last / 2)]?.label, points[last]?.label].includes(label)
            ? label
            : "",
        rotate: 0,
        hideOverlappingLabels: false,
        style: { colors: "#6b7280", fontSize: "10px" },
      },
      axisBorder: { show: true, color: "#2d3543" },
      axisTicks: { show: false },
      crosshairs: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: { show: false, min: 0, max: peak > 0 ? peak * 1.08 : 1 },
    tooltip: { custom: tooltipFor(unit) },
  };

  return (
    <div className="[&_.apexcharts-bar-area:hover]:fill-gold!">
      <Chart
        type="bar"
        height={170}
        options={options}
        series={[{ name: "Revenue", data: points.map((w) => w.revenue) }]}
      />
    </div>
  );
}

export function TopSellers({ rows }) {
  const max = rows[0]?.sold ?? 1;
  return (
    <div className="flex flex-col gap-3.5">
      {rows.map((row, i) => (
        <div key={row.name}>
          <div className="flex justify-between gap-3 text-[13px] mb-1.25">
            <span className="truncate">{row.name}</span>
            <span className="shrink-0 text-tan">{row.sold} sold</span>
          </div>
          <div className="h-1.25 bg-raised">
            <motion.div
              className="h-full bg-gold origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: row.sold / max }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 + i * 0.08 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
