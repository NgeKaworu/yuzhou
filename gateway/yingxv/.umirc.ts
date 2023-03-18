import { defineConfig } from 'umi';

export default defineConfig({
  plugins: ['@umijs/plugins/dist/qiankun'],
  qiankun: { master: {} },
  hash: true,
  runtimePublicPath: {},
  npmClient: 'pnpm',
  title: '盈虚',
  favicons: ['/favicon.ico'],
  links: [
    {
      rel: 'manifest',
      href: '/manifest.webmanifest',
    },
  ],
  routes: [
    {
      path: '/',
      component: '@/layouts/',
      layout: false,
      routes: [
        { path: '/', redirect: '/user-center/' },
        ...[
          {
            path: '/user-center/*',
            microApp: 'user-center',
          },
          {
            path: '/flashcard/*',
            microApp: 'flashcard',
          },
          {
            path: '/time-mgt/*',
            microApp: 'time-mgt',
          },
          {
            path: '/todo-list/*',
            microApp: 'todo-list',
          },
          {
            path: '/stock/*',
            microApp: 'stock',
          },
        ].map((r) => ({
          ...r,
          microAppProps: {
            loader: (loading: boolean) => loading && '加载中...',
          },
        })),
        { redirect: '/user-center/' },
      ],
    },
  ],
  proxy: {
    '/api': {
      target: 'https://api.furan.xyz',
      changeOrigin: true,
      pathRewrite: {
        '/api': '',
      },
    },
    '/micro': {
      target: 'https://micro.furan.xyz',
      changeOrigin: true,
      pathRewrite: {
        '/micro': '',
      },
    },
  },
  metas: [
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent',
    },
    { name: 'browsermode', content: 'application' },
    { name: 'full-screen', content: 'yes' },
    { name: 'x5-fullscreen', content: 'true' },
    { name: 'x5-page-mode', content: 'app' },
    { name: '360-fullscreen', content: 'true' },
  ],
});
