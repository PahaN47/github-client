import languageColors from 'config/languageColors';
import { Language } from 'store/CurrentRepoStore';

const getParsedLanguages = (list: Record<string, number>): Language[] => {
  const langaugesSum = Object.values(list).reduce((acc, value) => acc + value, 0);

  return Object.entries(list).map(([name, count]) => ({
    name,
    value: `${((count / langaugesSum) * 100).toFixed(1)}%`,
    color: languageColors[name]?.color ?? 'var(--brand)',
  }));
};

export default getParsedLanguages;
