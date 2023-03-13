export default [
  {
    path: '/',
    component: '@/layouts/',
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
