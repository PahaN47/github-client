import { default as languageColors } from './languageColors.json';

export type LanguageColors = {
  [x: string]: {
    color: string | null;
    url: string;
  };
};

export default languageColors as LanguageColors;
