/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-13 23:05:58
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2024-10-28 11:14:25
 * @FilePath: /yuzhou/app/user-center/.umirc.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { defineConfig } from 'umi';
import theme from './src/theme';
import routes from './routes';

export default defineConfig({
  plugins: ['@umijs/plugins/dist/qiankun'],
  qiankun: {
    slave: {},
  },
  hash: true,
  runtimePublicPath: {},
  npmClient: 'pnpm',
  theme,
  title: '用户中心',
  base: '/user-center',
  publicPath: '/micro/user-center/',
  routes,
  proxy: {
    '/api/user-center': {
      target: 'http://localhost:8020',
      // target: 'https://api.furan.xyz/user-center',
      changeOrigin: true,
      pathRewrite: {
        '/api/user-center': '',
      },
    },
  },
});
