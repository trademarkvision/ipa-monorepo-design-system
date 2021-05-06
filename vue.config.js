const productionEnv = (process.env.NODE_ENV === 'production');
const reportEnv = (process.env.REPORT && process.env.REPORT !== 'false');
const productionOrReportEnv = (productionEnv || reportEnv);

const plugins = [];
if (reportEnv) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  const StatsPlugin = require('stats-webpack-plugin');

  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html',
      openAnalyzer: true
    }),
    new StatsPlugin('stats.json')
  );
}

module.exports = {
  lintOnSave: false,
  parallel: false,
  outputDir: 'build/lib',
  configureWebpack: {
    plugins,
    ...(reportEnv && {profile: true})
  },
  chainWebpack: (config) => {
    if (!productionOrReportEnv) {
      return;
    }

    config.module
      .rule('ts')
      .use('ts-loader')
      .loader('ts-loader')
      .tap(opts => {
        // without this declaration files are not emited
        opts.transpileOnly = false;
        opts.happyPackMode = false;
        opts.onlyCompileBundledFiles = true;
        return opts;
      });
  }
};
