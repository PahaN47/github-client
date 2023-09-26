import classNames from 'classnames';
import React, { forwardRef, useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import cn from './PageLayout.module.scss';

export type PageLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  background?: 'primary' | 'secondary';
  children: React.ReactNode;
};

const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ className, children, background = 'primary', ...props }, ref) => {
    const [showSidebar, setShowSidebar] = useState(false);

    const handleMenuClick = useCallback(() => {
      setShowSidebar(true);
    }, []);

    return (
      <div className={cn['wrap']}>
        <Navbar onMenuClick={handleMenuClick} />
        <div className={classNames(className, cn['content'])} data-background={background} ref={ref} {...props}>
          {children}
        </div>
        <Sidebar visible={showSidebar} setVisible={setShowSidebar} />
      </div>
    );
  },
);

PageLayout.displayName = 'PageLayout';

export default PageLayout;
