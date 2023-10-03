export type OrgsApi = {
  items: {
    login: string;
  }[];
};

export type OrgsModel = string[];

export const normalizeOrgs = (orgs: OrgsApi) => orgs.items.map(({ login }) => login);
