import { Option } from 'components/Dropdown';

const getOptionValues = <T extends string>(options: Option<T>[]) => options.map(({ value }) => value);

export default getOptionValues;
