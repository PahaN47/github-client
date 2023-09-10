import React, { useCallback } from 'react';
import Button from 'components/Button';
import Input from 'components/Input';
import MultiDropdown, { Option } from 'components/MultiDropdown';
import SearchIcon from 'components/icons/SearchIcon';
import cn from './Filters.module.scss';

export type FilterValues = { org: string; types: Option[] };

export type FiltersProps = {
  value: FilterValues;
  onChange: (value: FilterValues) => void;
  onSearch: (value: FilterValues) => void;
  loading?: boolean;
};

const Filters: React.FC<FiltersProps> = ({ value, onChange, onSearch, loading }) => {
  const getDropdownTitle = useCallback(() => 'Type', []);

  const handleTypesChange = useCallback(
    (types: Option[]) => {
      onChange({ ...value, types });
    },
    [onChange, value],
  );

  const handleOrgChange = useCallback(
    (org: string) => {
      onChange({ ...value, org });
    },
    [onChange, value],
  );

  const handleSearchClick = useCallback(() => {
    onSearch(value);
  }, [onSearch, value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key.toLowerCase() === 'enter') {
        onSearch(value);
      }
    },
    [onSearch, value],
  );

  return (
    <div className={cn['wrap']}>
      <MultiDropdown
        className={cn['dropdown']}
        options={[]}
        value={value.types}
        getTitle={getDropdownTitle}
        onChange={handleTypesChange}
      />
      <div className={cn['search']}>
        <Input
          className={cn['search-input']}
          value={value.org}
          onChange={handleOrgChange}
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
