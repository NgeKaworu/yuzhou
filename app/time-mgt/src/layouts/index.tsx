/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 01:55:13
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-14 00:01:44
 * @FilePath: /yuzhou/app/time-mgt/src/layouts/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { App, ConfigProvider, GlobalToken, theme } from 'antd';
import clsx from 'clsx';

import { FormOutlined, PieChartOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import zhCN from 'antd/es/locale/zh_CN';
// import styles from './index.less';
import defaultTheme, { prefixCls } from '@/theme';

import { CSSInterpolation, useStyleRegister } from '@ant-design/cssinjs';

import 'dayjs/locale/zh-cn';
import React from 'react';

const queyClient = new QueryClient();

const menu = [
  { title: '记录', path: '/record/', icon: <FormOutlined /> },
  { title: '统计', path: '/statistic/', icon: <PieChartOutlined /> },
];

export default () => (
  <React.StrictMode>
    <QueryClientProvider client={queyClient}>
      <ConfigProvider locale={zhCN} theme={defaultTheme}>
        <Main />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

const { useToken } = theme;

function Main() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // 【自定义】制造样式
  const { theme, token, hashId } = useToken();

  // 全局注册，内部会做缓存优化
  const wrapSSR = useStyleRegister({ theme, token, hashId, path: [prefixCls] }, () => [
    genStyle(token),
  ]);

  return (
    <App>
      {wrapSSR(
        <section className={clsx(`${prefixCls}-bottom-fix-panel`, hashId)}>
          <main className={clsx(`${prefixCls}-fill-scroll-part`, hashId)}>
            <Outlet />
          </main>

          <footer className={clsx(`${prefixCls}-bottom-menu`, hashId)}>
            {menu.map((i) => (
              <div
                className={clsx(
                  clsx(`${prefixCls}-menu-item`, hashId),
                  i.path.includes(pathname) && clsx(`${prefixCls}-active`, hashId),
                )}
                key={i.path}
                onClick={() => navigate(i.path)}
              >
                {i.icon}
                {i.title}
              </div>
            ))}
          </footer>
        </section>,
      )}
    </App>
  );
}

const genStyle = (token: GlobalToken): CSSInterpolation => ({
  [`.${prefixCls}-bottom-fix-panel`]: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  [`.${prefixCls}-fill-scroll-part`]: { flex: 1, height: '100%', overflowY: 'scroll' },
  [`.${prefixCls}-bottom-menu`]: {
    display: 'flex',
    justifyContent: 'space-around',
    height: '60px',
    borderTop: '1px solid rgba(233, 233, 233, 05)',
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
  [`.${prefixCls}.active`]: { color: token.colorPrimary, opacity: 1 },

  [`.${prefixCls}-empty`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  [`.${prefixCls}-record-item`]: {
    height: '110px',
    margin: '8px 12px',
    padding: '10px 16px',
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.85)',
    boxShadow: '1px 1px 20px 1px rgba(233, 233, 233, 0.85)',
    cursor: 'pointer',
    [`&.${prefixCls}-active,\n  &:hover`]: { borderBottom: `3px solid ${token.colorPrimary}` },
    ':active': { background: '#fff', opacity: 0.85 },
  },
  [`.${prefixCls}-content`]: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  [`.${prefixCls}-main`]: { fontWeight: 'bold', fontSize: '20px' },
  [`.${prefixCls}-extra`]: { fontWeight: 100, fontSize: '16px' },
});
