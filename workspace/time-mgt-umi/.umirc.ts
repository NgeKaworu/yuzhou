import { defineConfig } from 'umi';
import base from './src/js-sdk/configs/.umirc.default';
import routes from './routes';
import theme from './src/theme';

export default defineConfig({
  ...base,
  theme,
  title: '柳比歇夫时间管理法',
  routes,
  devServer: {
    port: 8051,
    proxy: {
      '/api/time-mgt': {
        target: 'http://localhost:8050',
        changeOrigin: true,
        pathRewrite: {
          '/api/time-mgt': '',
        },
      },
    },
  },
  base: '/time-mgt',
  publicPath: '/micro/time-mgt/',
});
