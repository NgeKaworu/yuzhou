/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2022-02-11 13:51:09
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-15 13:50:50
 * @FilePath: /yuzhou/app/stock/routes.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export default [
  {
    path: '/',
    component: '@/layout/',
    layout: false,
    routes: [
      { path: '/', component: 'stock' },
      { path: '/lab', component: 'lab' },

      { path: '/position', component: 'position' },
      { path: '/exchange/:code', component: 'exchange' },
    ],
  },
];
