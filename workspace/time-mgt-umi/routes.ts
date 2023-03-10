/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 01:55:13
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-06 11:51:26
 * @FilePath: /yuzhou/workspace/time-mgt-umi/routes.ts
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
      { path: '/statistic/', component: 'statistic' },
      // { redirect: '/record/' },
    ],
  },
];
