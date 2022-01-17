module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'object-curly-newline': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'operator-linebreak': 'off',
    'no-await-in-loop': 'off',
  },
};
