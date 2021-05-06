module.exports = api => ({
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: false
      }
    ]
  ],
  ...(api.env('test') && {plugins: ['require-context-hook']})
});
