/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 01:55:13
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-05 19:07:36
 * @FilePath: /monorepo-lab/workspace/time-mgt-umi/.umirc.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { defineConfig } from 'umi';
import routes from './routes';
import theme from './src/theme';

export default defineConfig({
  plugins: ['@umijs/plugins/dist/qiankun'],
  qiankun: {
    slave: {},
  },
  hash: true,
  runtimePublicPath: {},
  npmClient: 'pnpm',
  theme,
  title: '柳比歇夫时间管理法',
  routes,

  proxy: {
    '/api/time-mgt': {
      target: 'http://localhost:8050',
      changeOrigin: true,
      pathRewrite: {
        '/api/time-mgt': '',
      },
    },
  },

  base: '/time-mgt',
  publicPath: '/micro/time-mgt/',
});
