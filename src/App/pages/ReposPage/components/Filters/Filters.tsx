import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useState } from 'react';
import Button from 'components/Button';
import Dropdown, { Option } from 'components/Dropdown';
import Loader from 'components/Loader';
import SearchIcon from 'components/icons/SearchIcon';
import repoTypeOptions from 'config/repoTypeOptions';
import OrgSearchStore from 'store/OrgSearchStore';
import { RepoType } from 'store/RepoListStore';
import getOptionValues from 'utils/getOptionValues';
import { useLocalStore } from 'utils/hooks';
import FiltersInput from './components/FiltersInput';
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
  const repoSearch = useLocalStore(() => new OrgSearchStore());

  const handleOrgChange = useCallback(
    (value: string) => {
      setOrg(value);
      repoSearch.updateOptions(value);
    },
    [repoSearch],
  );

  const getDropdownTitle = useCallback(
    (types: Option<RepoType>[]) => (types.length ? getOptionValues(types).join(', ') : 'Type'),
    [],
  );

  const handleSearch = useCallback(() => {
    onSearch({ org, types });
  }, [onSearch, org, types]);

  const handleEnter = useCallback(
    (newOrg?: string) => {
      onSearch({ org: newOrg || org, types });
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
        <FiltersInput
          className={cn['search-input']}
          value={org}
          onChange={handleOrgChange}
          placeholder="Enter organization name"
          onEnterKey={handleEnter}
          options={repoSearch.options}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader className={cn['button-loader']} size="s" /> : <SearchIcon />}
        </Button>
      </div>
    </div>
  );
};

export default observer(Filters);
