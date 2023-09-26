import { CurrentRepoModel } from 'store/models/CurrentRepoStore';

export type LastSeenRepo = Pick<CurrentRepoModel, 'id' | 'name' | 'stargazersCount' | 'owner'>;

export const normalizeLastSeenRepoFromCurrent = (repo: CurrentRepoModel): LastSeenRepo => {
  const { id, name, stargazersCount, owner } = repo;

  return {
    id,
    name,
    stargazersCount,
    owner,
  };
};

export const normalizeLastSeenRepoFromJSON = (storeItem: LastSeenRepo): LastSeenRepo | null => {
  if (
    typeof storeItem !== 'object' ||
    storeItem?.id == null ||
    storeItem?.name == null ||
    storeItem?.stargazersCount == null ||
    storeItem?.owner == null ||
    storeItem.owner.login == null ||
    storeItem.owner.id == null ||
    storeItem.owner.avatarUrl == null
  ) {
    return null;
  }

  return {
    id: +storeItem.id,
    name: String(storeItem.name),
    stargazersCount: +storeItem.stargazersCount,
    owner: storeItem.owner as LastSeenRepo['owner'],
  };
};

export const normalizeLastSeenRepoList = (jsonItems: string | null) => {
  if (jsonItems == null) {
    return [];
  }

  try {
    const itemsParsed = JSON.parse(jsonItems);
    if (!itemsParsed || !Array.isArray(itemsParsed)) {
      return [];
    }
    return itemsParsed
      .map((item) => normalizeLastSeenRepoFromJSON(item as LastSeenRepo))
      .filter(Boolean) as LastSeenRepo[];
  } catch {
    return [];
  }
};
