import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Text from 'components/Text';
import LogoIcon from 'components/icons/LogoIcon';
import MenuIcon from 'components/icons/MenuIcon';
import { AuthUserModel } from 'store/models/AuthStore';
import NavbarAvatar from './components/NavbarAvatar';
import cn from './Navbar.module.scss';

export type NavbarProps = {
  onMenuClick?: () => void;
  user?: AuthUserModel;
  authUrl: string;
  loading?: boolean;
  onLogout?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ loading, user, authUrl, onMenuClick, onLogout }) => {
  const handleLoginClick = useCallback(() => {
    if (authUrl) {
      window.location.assign(authUrl);
    }
  }, [authUrl]);

  return (
    <header className={cn['wrap']}>
      <div className={cn['wrap-left']}>
        <div className={cn['menu']} onClick={onMenuClick}>
          <MenuIcon width={32} height={32} />
        </div>
        <Link className={cn['logo-wrap']} to="/">
          <LogoIcon />
          <Text view="p-20" weight="bold" tag="p">
            GitHub Client
          </Text>
        </Link>
      </div>
      {loading ? (
        <Loader className={cn['loader']} />
      ) : user ? (
        <NavbarAvatar src={user.avatarUrl} login={user.login} onLogout={onLogout} />
      ) : (
        <Button onClick={handleLoginClick} small>
          Log in
        </Button>
      )}
    </header>
  );
};

export default Navbar;
