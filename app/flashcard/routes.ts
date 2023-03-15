/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 10:04:53
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-15 10:39:35
 * @FilePath: /yuzhou/app/flashcard/routes.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export default [
  {
    path: '/',
    component: '@/layouts/',
    layout: false,
    routes: [
      { path: '/', redirect: '/record/' },
      { path: '/record/', component: 'record' },
      { path: '/review/', component: 'review' },
      // { redirect: '/record/' },
    ],
  },
];
