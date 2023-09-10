import React, { useCallback, useMemo } from 'react';
import ArrowLeftIcon from 'components/icons/ArrowLeftIcon';
import PageButton from './components/PageButton';
import cn from './PageSelector.module.scss';

export type PageSelectorProps = {
  page: number;
  onChange: (page: number) => void;
  pageCount: number;
};

const PageSelector: React.FC<PageSelectorProps> = ({ page, onChange, pageCount }) => {
  const handleBackClick = useCallback(() => {
    onChange(page - 1);
  }, [onChange, page]);

  const handleForwardClick = useCallback(() => {
    onChange(page + 1);
  }, [onChange, page]);

  const pageValues = useMemo(() => {
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
  }, [page, pageCount]);

  return (
    <div className={cn['wrap']}>
      <button className={cn['back']} onClick={handleBackClick} disabled={page === 1}>
        <ArrowLeftIcon />
      </button>
      {pageValues.map(({ value, hideValue }) => (
        <PageButton key={value} value={value} onClick={onChange} hideValue={hideValue} selected={value === page} />
      ))}
      <button className={cn['forward']} onClick={handleForwardClick} disabled={page === pageCount}>
        <ArrowLeftIcon />
      </button>
    </div>
  );
};

export default PageSelector;
