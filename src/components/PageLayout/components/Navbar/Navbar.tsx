import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar';
import Text from 'components/Text';
import LogoIcon from 'components/icons/LogoIcon';
import cn from './Navbar.module.scss';

const Navbar: React.FC = () => (
  <header className={cn['wrap']}>
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
