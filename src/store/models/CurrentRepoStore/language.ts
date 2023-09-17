import languageColors from 'config/languageColors';

export type LanguagesApi = Record<string, number>;

export type LanguageModel = {
  name: string;
  value: string;
  color: string;
};

export const normalizeLanguages = (from: LanguagesApi): LanguageModel[] => {
  const langaugesSum = Object.values(from).reduce((acc, value) => acc + value, 0);

  return Object.entries(from).map(([name, count]) => ({
    name,
    value: `${((count / langaugesSum) * 100).toFixed(1)}%`,
    color: languageColors[name]?.color ?? 'var(--brand)',
  }));
};
