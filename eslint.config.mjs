import config from '@repo/eslint-config';

export default [
  ...config,
  {
    ignores: ['.dependency-cruiser.cjs'],
  },
];
