// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader", // CSS를 스타일 태그로 주입
          "css-loader", // CSS 파일을 JS로 변환
          "postcss-loader", // PostCSS 처리 (자동 벤더 프리픽스 추가 등)
        ],
      },
    ],
  },
};
