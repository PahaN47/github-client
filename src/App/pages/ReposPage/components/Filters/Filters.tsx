import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'components/Button';
import Dropdown, { Option } from 'components/Dropdown';
import Input from 'components/Input';
import SearchIcon from 'components/icons/SearchIcon';
import repoTypeOptions from 'config/repoTypeOptions';
import { RepoType } from 'store/RepoListStore';
import { useRepoList } from 'store/RepoListStore/RepoListStore.context';
import getOptionValues from 'utils/getOptionValues';
import cn from './Filters.module.scss';

export type FilterValues = { org: string; types: Option<RepoType>[] };

const getDropdownTitle = (types: RepoType[]) =>
  types.length ? getOptionValues(types.map((type) => repoTypeOptions.entities[type])).join(', ') : 'Type';

const Filters: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const options = useMemo(() => repoTypeOptions.order.map((key) => repoTypeOptions.entities[key]), []);

  const store = useRepoList();

  const handleSearchClick = useCallback(() => {
    store.getRepoList();
    navigate({ pathname: `/repos/${store.org}`, search });
  }, [search]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key.toLowerCase() !== 'enter') {
        return;
      }

      handleSearchClick();
    },
    [handleSearchClick],
  );

  return (
    <div className={cn['wrap']}>
      <Dropdown
        className={cn['dropdown']}
        type="multi"
        options={options}
        value={store.types}
        getTitle={getDropdownTitle}
        onChange={store.setTypes}
      />
      <div className={cn['search']}>
        <Input
          className={cn['search-input']}
          value={store.org}
          onChange={store.setOrg}
          placeholder="Enter organization name"
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSearchClick} loading={store.status.isPending}>
          <SearchIcon />
        </Button>
      </div>
    </div>
  );
};

export default observer(Filters);
