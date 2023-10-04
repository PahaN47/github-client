export const getPageValues = (page: number, pageCount: number, pageSpread: number = 2) => {
  const valueArray: { value: number; hideValue?: boolean }[] = new Array(pageCount)
    .fill(0)
    .map((_, index) => ({ value: index + 1 }));

  const leftInvisible = page > 1 + pageSpread ? Math.floor((page + 1) / 2) : 0;
  const rightInvisible = page < pageCount - pageSpread ? Math.ceil((page + pageCount) / 2) : 0;

  return valueArray
    .map(({ value }) => ({
      value,
      hideValue:
        (value === leftInvisible && value !== pageSpread) ||
        (value === rightInvisible && value !== pageCount + 1 - pageSpread),
    }))
    .filter(
      ({ value }) =>
        Math.abs(value - page) < pageSpread ||
        value === leftInvisible ||
        value === rightInvisible ||
        value === 1 ||
        value === pageCount ||
        (page === 1 && value === pageSpread + 1) ||
        (page === pageCount && value === pageCount - pageSpread),
    );
};
