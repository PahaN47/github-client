import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import Text from 'components/Text';
import cn from './Card.module.scss';

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** URL изображения */
  image: string;
  /** Слот над заголовком */
  captionSlot?: React.ReactNode;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Описание карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  contentSlot?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
  /** Слот для действия */
  actionSlot?: React.ReactNode;
  link?: string;
};

const Card: React.FC<CardProps> = ({
  className,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
  link,
}) => {
  const children = (
    <>
      <img className={cn['image']} src={image} alt="Not Found" />
      <div className={cn['content']}>
        <div className={cn['description']}>
          {captionSlot && (
            <Text view="p-14" weight="medium" color="secondary" tag="div">
              {captionSlot}
            </Text>
          )}
          <Text view="p-20" weight="medium" color="primary" maxLines={2}>
            {title}
          </Text>
          <Text view="p-16" color="secondary" maxLines={3}>
            {subtitle}
          </Text>
        </div>
        {(contentSlot || actionSlot) && (
          <div className={cn['action']}>
            <Text view="p-18" weight="bold" color="primary">
              {contentSlot}
            </Text>
            {actionSlot}
          </div>
        )}
      </div>
    </>
  );

  return link ? (
    <Link to={link} className={classNames(className, cn['card'])} onClick={onClick}>
      {children}
    </Link>
  ) : (
    <div className={classNames(className, cn['card'])} onClick={onClick}>
      {children}
    </div>
  );
};
export default Card;
