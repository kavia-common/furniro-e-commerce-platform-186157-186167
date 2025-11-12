"use client";
import Button from "./ui/Button";

/**
 * PUBLIC_INTERFACE
 * Pagination - prev/next and page indicator
 */
export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < maxPage;
  return (
    <div className="flex items-center justify-between mt-6">
      <Button variant="ghost" disabled={!canPrev} onClick={() => canPrev && onPageChange(page - 1)} aria-label="Previous page">
        ← Prev
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {maxPage} · {total} items
      </span>
      <Button variant="ghost" disabled={!canNext} onClick={() => canNext && onPageChange(page + 1)} aria-label="Next page">
        Next →
      </Button>
    </div>
  );
}
