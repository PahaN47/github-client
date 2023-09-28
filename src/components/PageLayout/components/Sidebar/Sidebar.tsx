import React, { useCallback } from 'react';
import AboveLayout from 'components/AboveLayout';
import Text from 'components/Text';
import ArrowLeftIcon from 'components/icons/ArrowLeftIcon';
import LastSeenReposList from './components/LastSeenReposList';
import './Sidebar.scss';

export type SidebarProps = {
  visible?: boolean;
  setVisible?: (value: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ visible = true, setVisible }) => {
  const handleHideClick = useCallback(() => {
    setVisible?.(false);
  }, [setVisible]);

  return (
    <AboveLayout visible={visible} onClick={handleHideClick}>
      <div className="sidebar-component-wrap">
        <Text className="sidebar-component-title" view="p-20" weight="medium" tag="div">
          Recent repositories:
          <button className="sidebar-component-back" onClick={handleHideClick}>
            <ArrowLeftIcon />
          </button>
        </Text>
        <LastSeenReposList onItemClick={handleHideClick} />
      </div>
    </AboveLayout>
  );
};

export default Sidebar;
