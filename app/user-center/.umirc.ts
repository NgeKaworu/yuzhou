import { defineConfig } from 'umi';
import theme from './src/theme';
import routes from './routes';
import base from './src/js-sdk/configs/.umirc.default';

export default defineConfig({
  ...base,
  theme,
  title: '用户中心',
  base: '/user-center',
  publicPath: '/micro/user-center/',
  routes,
  webpack5: {},
  devServer: {
    port: 8021,
    proxy: {
      '/api/user-center': {
        target: 'http://localhost:8020',
        changeOrigin: true,
        pathRewrite: {
          '/api/user-center': '',
        },
      },
    },
  },
});
