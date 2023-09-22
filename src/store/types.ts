export enum FetchStatus {
  PENDGING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
  IDLE = 'idle',
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
