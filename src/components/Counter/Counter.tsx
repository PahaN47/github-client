import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useStore } from 'store/store';

const Counter: React.FC = () => {
  const { repoList, getRepoList: getRepos } = useStore((store) => store.repos);

  useEffect(() => {
    if (!repoList.length) {
      getRepos('ktsstudio');
    }
  }, [getRepos, repoList.length]);

  return (
    <div>
      <button />
      <h1>{repoList.length}</h1>
      {repoList.map((repo) => (
        <div key={repo.id}>{repo.name}</div>
      ))}
    </div>
  );
};

export default observer(Counter);
