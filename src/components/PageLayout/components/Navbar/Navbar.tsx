import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar';
import Text from 'components/Text';
import LogoIcon from 'components/icons/LogoIcon';
import MenuIcon from 'components/icons/MenuIcon';
import cn from './Navbar.module.scss';

export type NavbarProps = {
  onMenuClick?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => (
  <header className={cn['wrap']}>
    <div className={cn['menu']} onClick={onMenuClick}>
      <MenuIcon width={32} height={32} />
    </div>
    <Link className={cn['logo-wrap']} to="/">
      <LogoIcon />
      <Text view="p-20" weight="bold">
        GitHub Client
      </Text>
    </Link>
    <Avatar src="" />
  </header>
);

export default Navbar;
