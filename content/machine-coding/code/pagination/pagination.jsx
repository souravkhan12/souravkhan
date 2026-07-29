import { useMemo, useState } from "react";

export function Pagination({
  data = [],
  pageSize = 10,
  initialPage = 1,
  renderItem,
  renderPagination,
}) {
  const [page, setPage] = useState(initialPage);

  const totalPages = Math.ceil(data.length / pageSize);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  function goTo(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  }

  return (
    <div>
      <div>{pageData.map((item, idx) => renderItem(item, idx))}</div>

      {renderPagination({
        page,
        totalPages,
        goTo,
        next: () => goTo(page + 1),
        prev: () => goTo(page - 1),
      })}
    </div>
  );
}
