export default [
  {
    path: '/',
    component: '@/layouts/',
    routes: [
      { path: '/', redirect: '/record/' },
      { path: '/record/', component: 'record' },
      { path: '/statistic/', component: 'statistic' },
      // { redirect: '/record/' },
    ],
  },
];
