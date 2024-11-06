/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 10:04:53
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2024-10-31 16:56:28
 * @FilePath: /yuzhou/app/flashcard/routes.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export default [
  {
    path: '/',
    component: '@/layouts',
    layout: false,
    routes: [
      {
        path: '/',
        component: '@/layouts/app',
        layout: false,
        routes: [
          { path: '/', redirect: '/record/' },
          { path: '/record/', component: 'record' },
          { path: '/review/', component: 'review' },
        ],
      },

      { path: '/mgt/', component: 'mgt' },
      // { redirect: '/record/' },
    ],
  },
];
