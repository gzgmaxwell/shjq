export function pageHandle(current, size, total) {
  const pageTotal = Math.ceil((total - 1) / size);
  const pageNum = current > pageTotal ? pageTotal : current;
  return pageNum < 1 ? 1 : pageNum;
}
