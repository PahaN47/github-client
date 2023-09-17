import classNames from 'classnames';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Text from 'components/Text';
import LinkIcon from 'components/icons/LinkIcon';
import cn from './RepoHomeLink.module.scss';

export type RepoHomeLinkProps = {
  className?: string;
  url: string;
};

const RepoHomeLink: React.FC<RepoHomeLinkProps> = memo(({ className, url }) => (
  <div className={classNames(className, cn['wrap'])}>
    <LinkIcon color="primary" />
    <Link to={url} target="_blank">
      <Text view="p-16" weight="bold">
        {url.split('://')[1]}
      </Text>
    </Link>
  </div>
));

RepoHomeLink.displayName = 'RepoHomeLink';

export default RepoHomeLink;
