/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 11:56:08
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-15 16:35:16
 * @FilePath: /yuzhou/app/stock/.umirc.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
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
  },
});
