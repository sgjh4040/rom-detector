// trendsHelpers.ts — Trends 페이지 공용 헬퍼.

export const formatDate = (ts: string): string => {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};
