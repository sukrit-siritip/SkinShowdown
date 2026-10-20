import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/admin";
import { SALES_RANGES, stockStatus } from "@/lib/admin-stats";
import StatCard from "@/components/stat-card";
import { SalesPanel, TopSellers } from "@/components/admin-charts";
import StockAlertsTable from "@/components/stock-alerts-table";
import { RevealGroup, RevealItem } from "@/components/reveal";

export const metadata = { title: "Summary" };

const usd = (value) =>
  `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Panel({ label, children, className = "" }) {
  return (
    <div className={`border border-hairline bg-card p-4.5 ${className}`}>
      <div className="text-[11px] tracking-[0.16em] text-tan mb-4.5">{label}</div>
      {children}
    </div>
  );
}

export default async function AdminSummaryPage() {
  await requireStaff();
  const supabase = await createClient();

  const rangeKeys = Object.keys(SALES_RANGES);
  const [{ data: overview }, { data: sellers }, { data: stockLevels }, ...seriesResults] =
    await Promise.all([
      supabase.rpc("admin_overview").single(),
      supabase.rpc("admin_top_sellers", { p_limit: 5 }),
      supabase.rpc("admin_stock_levels"),
      ...rangeKeys.map((key) =>
        supabase.rpc("admin_sales_series", {
          p_unit: SALES_RANGES[key].unit,
          p_buckets: SALES_RANGES[key].buckets,
        })
      ),
    ]);

  const seriesByRange = Object.fromEntries(
    rangeKeys.map((key, i) => [key, seriesResults[i].data ?? []])
  );
  const stock = (stockLevels ?? [])
    .map((row) => ({
      id: row.id,
      name: row.name,
      codesLeft: Number(row.codes_left),
      sold7d: Number(row.sold_7d),
      status: stockStatus(Number(row.codes_left)),
    }))
    .sort((a, b) => a.codesLeft - b.codesLeft || b.sold7d - a.sold7d);
  const topRows = (sellers ?? []).map((row) => ({ name: row.name, sold: Number(row.sold) }));

  return (
    <>
      <h1 className="font-bold text-[32px] m-0 mb-5.5">Summary</h1>

      <RevealGroup className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6.5">
        <RevealItem>
          <StatCard
            label="REVENUE"
            value={usd(overview?.revenue ?? 0)}
            valueClassName="text-[26px] text-gold-light"
            description={`▲ ${usd(overview?.revenue_7d ?? 0)} last 7 days`}
            descriptionClassName="text-[11px] text-success"
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            label="ORDERS"
            value={Number(overview?.orders ?? 0).toLocaleString("en-US")}
            valueClassName="text-[26px]"
            description={`▲ ${overview?.orders_7d ?? 0} last 7 days`}
            descriptionClassName="text-[11px] text-success"
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            label="CATALOGUE SIZE"
            value={overview?.catalog_size ?? 0}
            valueClassName="text-[26px]"
            description="skins published"
            descriptionClassName="text-[11px] text-muted"
          />
        </RevealItem>
      </RevealGroup>

      <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <RevealItem>
          <SalesPanel seriesByRange={seriesByRange} />
        </RevealItem>
        <RevealItem>
          <Panel label="MOST SOLD SKINS" className="h-full">
            {topRows.length > 0 ? (
              <TopSellers rows={topRows} />
            ) : (
              <p className="text-sm text-muted m-0">No sales yet.</p>
            )}
          </Panel>
        </RevealItem>
      </RevealGroup>

      <RevealGroup>
        <RevealItem>
          <Panel label="STOCK ALERTS">
            <StockAlertsTable rows={stock} />
          </Panel>
        </RevealItem>
      </RevealGroup>
    </>
  );
}
