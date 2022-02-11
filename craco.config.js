const CracoAlias = require('craco-alias');

module.exports = {
  eslint: {
    enable: false,
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        baseUrl: './',
        source: 'jsconfig',
      },
    },
  ],
};
