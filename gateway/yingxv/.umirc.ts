import { defineConfig } from 'umi';

export default defineConfig({
  plugins: ['@umijs/plugins/dist/qiankun'],
  qiankun: { master: {} },
  hash: true,
  runtimePublicPath: false,
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
            path: '/user-center/',
            microApp: 'user-center',
          },
          {
            path: '/flashcard/',
            microApp: 'flashcard',
          },
          {
            path: '/time-mgt/',
            microApp: 'time-mgt',
          },
          {
            path: '/todo-list/',
            microApp: 'todo-list',
          },
          {
            path: '/stock/',
            microApp: 'stock',
          },
        ].map((r) => ({
          ...r,
          microAppProps: {
            className: 'root-slave',
            wrapperClassName: 'load-wrap',
            autoSetLoading: true,
          },
        })),
        { redirect: '/user-center/' },
      ],
    },
  ],
  proxy: {
    '/api/user-center': {
      // target: 'http://localhost:8020',
      target: 'https://api.furan.xyz/user-center',
      changeOrigin: true,
      pathRewrite: {
        '/api/user-center': '',
      },
    },
    '/api/flashcard': {
      // target: 'http://localhost:8030',
      target: 'https://api.furan.xyz/flashcard',
      changeOrigin: true,
      pathRewrite: {
        '/api/flashcard': '',
      },
    },
    '/api/todo-list': {
      // target: 'http://localhost:8040',
      target: 'https://api.furan.xyz/todo-list',
      changeOrigin: true,
      pathRewrite: {
        '/api/todo-list': '',
      },
    },
    '/api/time-mgt': {
      // target: 'http://localhost:8050',
      target: 'https://api.furan.xyz/time-mgt',
      changeOrigin: true,
      pathRewrite: {
        '/api/time-mgt': '',
      },
    },
    '/api/stock': {
      // target: 'http://localhost:8060',
      target: 'https://api.furan.xyz/stock',
      changeOrigin: true,
      pathRewrite: {
        '/api/stock': '',
      },
    },

    // '/micro/user-center/': {
    //   // target: 'http://localhost:8020',
    //   target: 'https://micro.furan.xyz/user-center/',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '/micro/user/-center': '',
    //   },
    // },
    // '/micro/flashcard/': {
    //   // target: 'http://localhost:8030',
    //   target: 'https://micro.furan.xyz/flashcard/',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '/micro/flashcard/': '',
    //   },
    // },
    // '/micro/todo-list/': {
    //   // target: 'http://localhost:8040',
    //   target: 'https://micro.furan.xyz/todo-list/',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '/micro/todo/-list': '',
    //   },
    // },
    // '/micro/time-mgt/': {
    //   // target: 'http://localhost:8050',
    //   target: 'https://micro.furan.xyz/time-mgt/',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '/micro/time/-mgt': '',
    //   },
    // },
    // '/micro/stock/': {
    //   // target: 'http://localhost:8060',
    //   target: 'https://micro.furan.xyz/stock/',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '/micro/stock/': '',
    //   },
    // },
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
