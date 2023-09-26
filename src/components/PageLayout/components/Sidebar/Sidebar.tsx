import classNames from 'classnames';
import React, { useCallback } from 'react';
import AboveLayout from 'components/AboveLayout';
import Text from 'components/Text';
import ArrowLeftIcon from 'components/icons/ArrowLeftIcon';
import LastSeenReposList from './components/LastSeenReposList';
import cn from './Sidebar.module.scss';

export type SidebarProps = React.PropsWithChildren & {
  className?: string;
  visible?: boolean;
  setVisible?: (value: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ className, visible = true, setVisible }) => {
  const handleHideClick = useCallback(() => {
    setVisible?.(false);
  }, [setVisible]);

  return (
    <AboveLayout className={classNames(className, cn['layout'])} visible={visible} onClick={handleHideClick}>
      <div className={cn['sidebar-wrap']} data-visible={visible}>
        <Text className={cn['sidebar-title']} view="p-20" weight="medium" tag="div">
          Recent repositories:
          <button className={cn['back']} onClick={handleHideClick}>
            <ArrowLeftIcon />
          </button>
        </Text>
        <LastSeenReposList onItemClick={handleHideClick} />
      </div>
    </AboveLayout>
  );
};

export default Sidebar;
