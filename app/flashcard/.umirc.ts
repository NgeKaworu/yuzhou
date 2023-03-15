/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 10:04:53
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-15 10:17:38
 * @FilePath: /yuzhou/app/flashcard/.umirc.ts
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
  title: '单词卡',
  theme,
  routes,
  base: '/flashcard',
  publicPath: '/micro/flashcard/',
  proxy: {
    '/api/flashcard': {
      target: 'https://api.furan.xyz/flashcard',
      // target: 'http://localhost:8030',
      changeOrigin: true,
      pathRewrite: {
        '/api/flashcard': '',
      },
    },
  }
});
