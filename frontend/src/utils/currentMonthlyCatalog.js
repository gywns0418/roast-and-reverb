export const koreaToday = () => new Intl.DateTimeFormat('sv-SE', {timeZone: 'Asia/Seoul'}).format(new Date());

// Keep archived catalog records intact; only current sale windows are selectable.
export function currentMonthlyCatalog(rows, today = koreaToday()) {
  return rows.filter(product =>
    /^\d{4}-\d{2}-\d{2}$/.test(product.saleStart || '') &&
    /^\d{4}-\d{2}-\d{2}$/.test(product.saleEnd || '') &&
    product.saleStart <= today && today <= product.saleEnd &&
    product.items?.length > 0
  );
}
