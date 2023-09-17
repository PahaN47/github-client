import classNames from 'classnames';
import React, { forwardRef } from 'react';
import Navbar from './components/Navbar';
import cn from './PageLayout.module.scss';

export type PageLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  background?: 'primary' | 'secondary';
  children: React.ReactNode;
};

const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ className, children, background = 'primary', ...props }, ref) => (
    <div className={cn['wrap']}>
      <Navbar />
      <div className={classNames(className, cn['content'])} data-background={background} ref={ref} {...props}>
        {children}
      </div>
    </div>
  ),
);

PageLayout.displayName = 'PageLayout';

export default PageLayout;
