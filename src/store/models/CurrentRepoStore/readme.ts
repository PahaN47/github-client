import { Base64 } from 'js-base64';

export type ReadmeApi = {
  content: string;
};

export type ReadmeModel = string;

export const normalizeReadme = ({ content }: ReadmeApi): ReadmeModel => Base64.decode(content);
