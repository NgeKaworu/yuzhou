import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { App, ConfigProvider, GlobalToken, Layout, theme } from 'antd';

import { FormOutlined, SyncOutlined } from '@ant-design/icons';
import clsx from 'clsx';

const { Content, Footer } = Layout;

import zhCN from 'antd/es/locale/zh_CN';

import defaultTheme, { prefixCls } from '@/theme';

import { CSSInterpolation, useStyleRegister } from '@ant-design/cssinjs';

import 'dayjs/locale/zh-cn';

const queyClient = new QueryClient();

const menu = [
  {
    title: '待办',
    path: '/task/',
    icon: <FormOutlined />,
  },
  { title: '历史', path: '/history/', icon: <SyncOutlined /> },
];

const { useToken } = theme;

export default () => (
  <React.StrictMode>
    <QueryClientProvider client={queyClient}>
      <ConfigProvider locale={zhCN} theme={defaultTheme}>
        <Main />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

function Main() {
  const { pathname } = useLocation();
  const history = useNavigate();

  function onMenuClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const path: string = e?.currentTarget?.dataset?.path as string;

    history({
      pathname: path,
    });
  }

  // 【自定义】制造样式
  const { theme, token, hashId } = useToken();

  // 全局注册，内部会做缓存优化
  const wrapSSR = useStyleRegister({ theme, token, hashId, path: [prefixCls] }, () => [
    genStyle(token),
  ]);

  return wrapSSR(
    <App>
      <Layout className={clsx(`${prefixCls}-layout`, hashId)}>
        <Content className={clsx(`${prefixCls}-content`, hashId)}>
          <Outlet />
        </Content>
        <Footer className={clsx(`${prefixCls}-footer-menu`, hashId)}>
          {menu.map((i) => (
            <div
              className={clsx(
                clsx(`${prefixCls}-menu-item`, hashId),
                i.path.includes(pathname) && clsx(`${prefixCls}-active`, hashId),
              )}
              key={i.path}
              data-path={i.path}
              onClick={onMenuClick}
            >
              {i.icon}
              {i.title}
            </div>
          ))}
        </Footer>
      </Layout>
    </App>,
  );
}

const genStyle = (token: GlobalToken): CSSInterpolation => ({
  [`.${prefixCls}-layout`]: { height: '100%', minHeight: '100%' },
  [`.${prefixCls}-content`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  [`.${prefixCls}-footer-menu`]: {
    display: 'flex',
    justifyContent: 'space-around',
    height: '60px',
    padding: '0',
    background: 'white',
    borderTop: '1px solid rgba(233, 233, 233, 05)',
    boxShadow: '0px 1px 20px 5px rgba(0, 0, 0, 0.05)',
  },
  [`.${prefixCls}-menu-item`]: {
    '.anticon': { fontSize: '28px' },
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000',
    fontSize: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    opacity: 0.7,
    ':hover': { color: token.colorPrimary, opacity: 1 },
    ':active': { opacity: 0.5 },
  },
  [`.${prefixCls}-active`]: { color: token.colorPrimary, opacity: 1 },
});
