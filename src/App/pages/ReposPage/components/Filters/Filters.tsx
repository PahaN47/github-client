import React, { useCallback, useMemo, useState } from 'react';
import Button from 'components/Button';
import Dropdown, { Option } from 'components/Dropdown';
import Input from 'components/Input';
import SearchIcon from 'components/icons/SearchIcon';
import repoTypeOptions from 'config/repoTypeOptions';
import { RepoType } from 'store/RepoListStore';
import getOptionValues from 'utils/getOptionValues';
import cn from './Filters.module.scss';

export type FilterValues = { org: string; types: Option<RepoType>[] };

export type FiltersProps = {
  initialOrg: string;
  initialTypes: RepoType[];
  onSearch: (value: FilterValues) => void;
  loading?: boolean;
};

const Filters: React.FC<FiltersProps> = ({ initialOrg, initialTypes, onSearch, loading }) => {
  const [org, setOrg] = useState<string>(initialOrg);
  const [types, setTypes] = useState<Option<RepoType>[]>(initialTypes.map((key) => repoTypeOptions.entities[key]));
  const options = useMemo(() => repoTypeOptions.order.map((key) => repoTypeOptions.entities[key]), []);

  const getDropdownTitle = useCallback(
    (types: Option<RepoType>[]) => (types.length ? getOptionValues(types).join(', ') : 'Type'),
    [],
  );

  const handleSearchClick = useCallback(() => {
    onSearch({ org, types });
  }, [onSearch, org, types]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key.toLowerCase() === 'enter') {
        onSearch({ org, types });
      }
    },
    [onSearch, org, types],
  );

  return (
    <div className={cn['wrap']}>
      <Dropdown
        className={cn['dropdown']}
        type="multi"
        options={options}
        value={types}
        getTitle={getDropdownTitle}
        onChange={setTypes}
      />
      <div className={cn['search']}>
        <Input
          className={cn['search-input']}
          value={org}
          onChange={setOrg}
          placeholder="Enter organization name"
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSearchClick} loading={loading}>
          <SearchIcon />
        </Button>
      </div>
    </div>
  );
};

export default Filters;
