const path = require('path');

module.exports = {
  'stories': ['./stories/**/*.stories.mdx', './stories/**/*.stories.@(js|jsx|ts|tsx)'],
  'addons': ['@storybook/addon-essentials', '@storybook/addon-links', '@storybook/addon-queryparams'],
  core: {
    builder: 'webpack5'
  }
};