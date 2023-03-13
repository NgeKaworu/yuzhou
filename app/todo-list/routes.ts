/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-13 17:00:04
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-13 18:38:32
 * @FilePath: /yuzhou/app/todo-list/routes.ts
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
      { path: '/', redirect: '/task/' },
      { path: '/task/', component: 'task' },
      { path: '/history/', component: 'history' },
      // { redirect: '/record/' },
    ],
  },
];
