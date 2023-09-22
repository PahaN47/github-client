export type Collection<K extends string | number, T> = {
  order: K[];
  entities: Record<K, T>;
};

export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export const getEmptyCollection = <K extends string | number, T>(): Collection<K, T> => ({
  order: [],
  entities: {} as Record<K, T>,
});

export const normalizeCollection = <K extends string | number, T>(
  list: T[],
  key: KeysMatching<T, K>,
): Collection<K, T> => {
  const collection: Collection<K, T> = getEmptyCollection<K, T>();

  list.forEach((item) => {
    collection.order.push(item[key] as K);
    collection.entities[item[key] as K] = item;
  });

  return collection;
};

export const expandCollection = <K extends string | number, T>(
  oldCollection: Collection<K, T>,
  newList: T[],
  key: KeysMatching<T, K>,
): Collection<K, T> => normalizeCollection<K, T>([...(Object.values(oldCollection.entities) as T[]), ...newList], key);
