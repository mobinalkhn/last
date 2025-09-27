const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Fix asset paths for hosting
config.transformer.publicPath = './';

module.exports = config;