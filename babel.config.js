module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const isDev = process.env.NODE_ENV === 'development';

  return {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
      isDev && 'react-refresh/babel',
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-destructuring',
    ].filter(Boolean),
  };
};
