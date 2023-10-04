import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import ArrowLeftIcon from 'components/icons/ArrowLeftIcon';
import { getPageValues } from 'utils/getPageValues';
import { useWindowSize } from 'utils/hooks';
import { PAGINATION_MOBILE_PAGE_SPREAD, PAGINATION_PAGE_SPREAD } from './Pagination.const';
import PageButton from './components/PageButton';
import cn from './Pagination.module.scss';

export type PaginationProps = {
  className?: string;
  page: number;
  onChange: (page: number) => void;
  pageCount: number;
};

const Pagination: React.FC<PaginationProps> = ({ className, page, onChange, pageCount }) => {
  const windowSize = useWindowSize();

  const handleBackClick = useCallback(() => {
    onChange(page - 1);
  }, [onChange, page]);

  const handleForwardClick = useCallback(() => {
    onChange(page + 1);
  }, [onChange, page]);

  const pageValues = useMemo(
    () =>
      getPageValues(
        page,
        pageCount,
        windowSize.isTablet || windowSize.isMobile ? PAGINATION_MOBILE_PAGE_SPREAD : PAGINATION_PAGE_SPREAD,
      ),
    [page, pageCount, windowSize.isMobile, windowSize.isTablet],
  );

  return (
    <div className={classNames(className, cn['wrap'])}>
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

export default observer(Pagination);
