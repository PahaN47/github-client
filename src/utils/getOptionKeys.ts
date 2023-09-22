import { Option } from 'components/Dropdown';

export const getOptionKeys = <T extends string>(options: Option<T>[]) => options.map(({ key }) => key);
