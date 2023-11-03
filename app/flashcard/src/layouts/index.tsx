/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 10:04:53
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-11-03 10:00:21
 * @FilePath: /yuzhou/app/flashcard/src/layouts/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ConfigProvider, theme } from 'antd';

import defaultTheme, { prefixCls } from '@/theme';

import { FormOutlined, SyncOutlined } from '@ant-design/icons';
import { CSSInterpolation, useStyleRegister } from '@ant-design/cssinjs';
import classNames from 'classnames';

import zhCN from 'antd/es/locale/zh_CN';
import { DerivativeToken } from 'antd/es/theme/internal';

const queyClient = new QueryClient();

const menu = [
  {
    title: '新词本',
    path: '/record/',
    icon: <FormOutlined />,
    query: { type: 'enable', sort: 'createAt', orderby: -1 },
  },
  { title: '复习', path: '/review/', icon: <SyncOutlined /> },
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

  // 【自定义】制造样式
  const { theme, token, hashId } = useToken();

  // 全局注册，内部会做缓存优化
  const wrapSSR = useStyleRegister(
    { theme, token, hashId, path: [prefixCls] },
    () => [genStyle(token)],
  );

  function onMenuClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const path: string = e?.currentTarget?.dataset?.path as string,
      query = menu.find((m) => m?.path === path)?.query;

    history({
      pathname: path,
      search: new URLSearchParams(query)?.toString(),
    });
  }
  return wrapSSR(
    <section
      className={classNames(`${prefixCls}-layout`, hashId)}
      id="scroll-root"
    >
      <main>
        <Outlet />
      </main>
      <footer>
        <div className={classNames(`${prefixCls}-footer`, hashId)}>
          {menu.map((i) => (
            <div
              className={classNames(
                classNames(`${prefixCls}-menu-item`, hashId),
                i.path.includes(pathname) &&
                  classNames(`${prefixCls}-active`, hashId),
              )}
              key={i.path}
              data-path={i.path}
              onClick={onMenuClick}
            >
              {i.icon}
              {i.title}
            </div>
          ))}
        </div>
      </footer>
    </section>,
  );
}

const genStyle = (token: DerivativeToken): CSSInterpolation => ({
  [`.${prefixCls}-layout`]: { background: '#eee' },
  [`.${prefixCls}-footer`]: {
    position: 'fixed',
    right: '0',
    bottom: '0',
    left: '0',
    display: 'flex',
    justifyContent: 'space-around',
    height: '36px',
    padding: '0',
    background: 'white',
    borderTop: '1px solid rgba(233, 233, 233, 05)',
    boxShadow: '0px 1px 20px 5px rgba(0, 0, 0, 0.05)',
  },
  [`.${prefixCls}-menu-item`]: {
    anticon: { fontSize: '16px' },
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

  [`.${prefixCls}-content`]: {
    minHeight: '100vh',
    paddingBottom: '33vh',
    background: 'rgb(240, 242, 245)',
  },
  [`.${prefixCls}-header`]: {
    position: 'fixed',
    top: '0',
    right: '0',
    left: '0',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    overflowX: 'auto',
    background: '#fff',
    borderBottom: '1px solid #eee',
    height: '24px',
  },
  [`.${prefixCls}-menu`]: { margin: '0 auto', lineHeight: '24px' },
  [`.${prefixCls}-content-footer`]: {
    position: 'fixed',
    right: '0',
    bottom: '36px',
    left: '0',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px',
    overflowX: 'auto',
    background: '#fff',
    borderTop: '1px solid #eee',
  },
  [`.${prefixCls}-empty`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh',
  },
});
