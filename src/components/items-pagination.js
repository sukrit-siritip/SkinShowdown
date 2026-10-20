"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Pagination } from "antd";

export default function ItemsPagination({ page, pageSize, total }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (total <= pageSize) return null;

  const onChange = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) params.set("page", String(nextPage));
    else params.delete("page");
    router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
  };

  return (
    <div className="flex justify-center mt-10">
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
      />
    </div>
  );
}
