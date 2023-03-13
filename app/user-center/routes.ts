/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-13 23:05:58
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-13 23:50:05
 * @FilePath: /yuzhou/app/user-center/routes.ts
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
      { path: '/', redirect: '/profile/' },
      { path: '/perm/', component: 'perm' },
      { path: '/role/', component: 'role' },
      { path: '/user/', component: 'user' },
      { path: '/profile/', component: 'profile' },
      { path: '/:entry/', component: 'entry' },
      // { redirect: '/profile/' },
    ],
  },
];
