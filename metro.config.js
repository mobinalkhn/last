const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// GitHub Pages configuration
if (process.env.NODE_ENV === 'production') {
  config.resolver.platforms = ['web', 'native', ...config.resolver.platforms];
}

module.exports = config;