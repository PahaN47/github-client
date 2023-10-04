import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import { useAuth, useIsVisible } from 'utils/hooks';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Sidebar from './components/Sidebar';
import cn from './PageLayout.module.scss';

export type PageLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  background?: 'primary' | 'secondary';
  children: React.ReactNode;
  useScrollToTop?: boolean;
  topScrollHeight?: string;
};

const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ className, children, background = 'primary', useScrollToTop, topScrollHeight, ...props }, ref) => {
    const topAnchorRef = useRef<HTMLDivElement>(null);
    const isTopAnchorVisible = useIsVisible(topAnchorRef);

    const topAnchorStyle = useMemo<React.HTMLAttributes<HTMLDivElement>['style']>(
      () => (useScrollToTop ? { height: topScrollHeight } : undefined),
      [topScrollHeight, useScrollToTop],
    );
    const [showSidebar, setShowSidebar] = useState(false);

    const navigate = useNavigate();

    const auth = useAuth();
    const loading = auth.status.isPending;
    const rejected = auth.status.isRejected;

    const handleMenuClick = useCallback(() => {
      setShowSidebar(true);
    }, []);

    const handleLogout = useCallback(() => {
      auth.logout();
      navigate(0);
    }, [auth, navigate]);

    const handleScrollToTop = useCallback(() => {
      topAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
      if (rejected) {
        handleLogout();
      }
    }, [handleLogout, rejected]);

    return (
      <div className={cn['wrap']}>
        <Navbar
          onMenuClick={handleMenuClick}
          authUrl={auth.authUrl}
          user={auth.user}
          loading={loading}
          onLogout={handleLogout}
        />
        <ScrollToTop onClick={handleScrollToTop} visible={useScrollToTop && !isTopAnchorVisible} />
        <div className={classNames(className, cn['content'])} data-background={background} ref={ref} {...props}>
          <div className={cn['top-anchor']} style={topAnchorStyle} ref={topAnchorRef} />
          {loading ? (
            <div className={cn['loader']}>
              <Loader />
            </div>
          ) : (
            children
          )}
        </div>
        <Sidebar visible={showSidebar} setVisible={setShowSidebar} />
      </div>
    );
  },
);

PageLayout.displayName = 'PageLayout';

export default observer(PageLayout);
