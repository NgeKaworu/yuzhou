/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-13 17:00:04
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-13 17:09:28
 * @FilePath: /yuzhou/app/todo-list/.umirc.ts
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
  title: '待办清单',
  theme,
  routes,
  proxy: {
      '/api/todo-list': {
        target: 'http://localhost:8040',
        changeOrigin: true,
        pathRewrite: {
          '/api/todo-list': '',
        },
      },
    },
  base: '/todo-list',
  publicPath: '/micro/todo-list/',
});
