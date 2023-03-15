import { defineConfig } from 'umi';
import theme from './src/theme/';
import routes from './routes';

export default defineConfig({
  plugins: ['@umijs/plugins/dist/qiankun'],
  qiankun: {
    slave: {},
  },
  hash: true,
  runtimePublicPath: {},
  npmClient: 'pnpm',
  routes,
  theme,
  title: '加权计算器',
  base: '/stock',
  publicPath: '/micro/stock/',
  proxy: {
    '/api/stock': {
      // target: 'http://localhost:8060',
      target: 'https://api.furan.xyz/stock',
      changeOrigin: true,
      pathRewrite: {
        '/api/stock': '',
      },
    },
  }
});
