const withSass = require('@zeit/next-sass');

module.exports = withSass({
  sassLoaderOptions: {
    outputStyle: 'expanded',
  },
  exportPathMap: function() {
    return {
      '/': { page: '/' },
    };
  },
});
