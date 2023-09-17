const getPageValues = (page: number, pageCount: number) => {
  const valueArray: { value: number; hideValue?: boolean }[] = new Array(pageCount)
    .fill(0)
    .map((_, index) => ({ value: index + 1 }));

  const leftInvisible = page > 3 ? Math.floor((page + 1) / 2) : 0;
  const rightInvisible = page < pageCount - 2 ? Math.ceil((page + pageCount) / 2) : 0;

  return valueArray
    .map(({ value }) => ({
      value,
      hideValue: (value === leftInvisible && value !== 2) || (value === rightInvisible && value !== pageCount - 1),
    }))
    .filter(
      ({ value }) =>
        Math.abs(value - page) < 2 ||
        value === leftInvisible ||
        value === rightInvisible ||
        value === 1 ||
        value === pageCount ||
        (page === 1 && value === 3) ||
        (page === pageCount && value === pageCount - 2),
    );
};

export default getPageValues;
