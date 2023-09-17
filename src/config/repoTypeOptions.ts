import { Option } from 'components/Dropdown';
import { RepoType } from 'store/RepoListStore';
import { Collection, normalizeCollection } from 'store/models/shared';

const repoTypeOptions: Collection<string, Option<RepoType>> = normalizeCollection(
  [
    {
      key: 'public',
      value: 'Public',
    },
    {
      key: 'private',
      value: 'Private',
    },
    {
      key: 'forks',
      value: 'Forks',
    },
    {
      key: 'sources',
      value: 'Sources',
    },
    {
      key: 'member',
      value: 'Member',
    },
  ],
  'key',
);

export default repoTypeOptions;
