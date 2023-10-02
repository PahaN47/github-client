import React, { useCallback, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Text from 'components/Text';
import { NAVBAR_AVATAR_TRANSITION_DURATION } from './NavbarAvatar.const';
import cn from './NavbarAvatar.module.scss';

const transitionClassNames = {
  enterDone: cn['menu-enter-done'],
  enterActive: cn['menu-enter-active'],
  exitActive: cn['menu-exit-active'],
};

export type NavbarAvatarProps = {
  src: string;
  login: string;
  onLogout?: () => void;
};

const NavbarAvatar: React.FC<NavbarAvatarProps> = ({ src, login, onLogout }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const handleAvatarClick = useCallback(() => setIsMenuVisible((prev) => !prev), []);
  const handleMenuClick = useCallback(() => setIsMenuVisible(false), []);

  return (
    <div className={cn['wrap']}>
      <CSSTransition
        in={isMenuVisible}
        nodeRef={menuRef}
        timeout={NAVBAR_AVATAR_TRANSITION_DURATION}
        classNames={transitionClassNames}
        mountOnEnter
        unmountOnExit
      >
        <div className={cn['menu']} onClick={handleMenuClick} ref={menuRef}>
          <Text className={cn['login']} view="p-18" weight="medium" tag="div" maxLines={1}>
            {login}
          </Text>
          <div className={cn['content']}>
            <Button className={cn['logout']} onClick={onLogout} small>
              Log out
            </Button>
          </div>
        </div>
      </CSSTransition>
      <Avatar className={cn['avatar']} src={src} onClick={handleAvatarClick} />
    </div>
  );
};

export default NavbarAvatar;
