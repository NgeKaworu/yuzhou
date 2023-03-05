/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 01:55:13
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-06 00:07:07
 * @FilePath: /monorepo-lab/workspace/time-mgt-umi/src/layouts/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { App, ConfigProvider, theme } from 'antd';
import classNames from 'classnames';

import { FormOutlined, PieChartOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import zhCN from 'antd/es/locale/zh_CN';
// import styles from './index.less';
import defaultTheme from '@/theme';

import { CSSInterpolation, useStyleRegister } from '@ant-design/cssinjs';
import { DerivativeToken } from 'antd/es/theme/internal';

const queyClient = new QueryClient();

const menu = [
  { title: '记录', path: '/record/', icon: <FormOutlined /> },
  { title: '统计', path: '/statistic/', icon: <PieChartOutlined /> },
];

export default () => {
  return (
    <QueryClientProvider client={queyClient}>
      <ConfigProvider locale={zhCN} theme={defaultTheme}>
        <Main />
      </ConfigProvider>
    </QueryClientProvider>
  );
};

const { useToken } = theme;

function Main() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const prefixCls = 'time-mgt';

  // 【自定义】制造样式
  const { theme, token, hashId } = useToken();

  // 全局注册，内部会做缓存优化
  const wrapSSR = useStyleRegister({ theme, token, hashId, path: [prefixCls] }, () => [
    genStyle(prefixCls, token),
  ]);

  return (
    <App>
      {wrapSSR(
        <section className={classNames(`${prefixCls}-bottom-fix-panel`, hashId)}>
          <main className={classNames(`${prefixCls}-fill-scroll-part`, hashId)}>
            <Outlet />
          </main>

          <footer className={classNames(`${prefixCls}-bottom-menu`, hashId)}>
            {menu.map((i) => (
              <div
                className={classNames(
                  classNames(`${prefixCls}-menu-item`, hashId),
                  i.path.includes(pathname) && classNames(`${prefixCls}-active`, hashId),
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

const genStyle = (prefixCls: string, token: DerivativeToken): CSSInterpolation => ({
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
});
