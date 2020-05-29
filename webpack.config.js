module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
    ]
  },
  output: {
    publicPath: 'dist/'
  },
  resolve: {
    extensions: [
      '.ts'
    ]
  }
};