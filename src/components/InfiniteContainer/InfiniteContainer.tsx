import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useIsVisible } from 'utils/hooks';
import cn from './InfiniteContainer.module.scss';

export type InfiniteContainerProps = React.PropsWithChildren & {
  className?: string;
  onReachBottom?: () => void;
  hasMore: boolean;
  loader?: React.ReactNode;
  loading: boolean;
  hideOnLoading?: boolean;
  showInitialLoader?: boolean;
};

const InfiniteContainer: React.FC<InfiniteContainerProps> = ({
  className,
  children,
  onReachBottom,
  hasMore,
  loader,
  hideOnLoading,
  loading,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(bottomRef);
  const shouldShowChildren = !hideOnLoading || !loading;
  const shouldLoadMore = !loading && isVisible && hasMore;
  const shouldShowLoader = loading && hasMore;

  useEffect(() => {
    if (shouldLoadMore) {
      onReachBottom?.();
    }
  }, [onReachBottom, shouldLoadMore]);

  useEffect(() => {}, []);

  return (
    <div className={classNames(className, cn['container'])}>
      {shouldShowChildren && children}
      {shouldShowLoader && loader}
      <div className={cn['bottom-observer']} ref={bottomRef} />
    </div>
  );
};

export default InfiniteContainer;
