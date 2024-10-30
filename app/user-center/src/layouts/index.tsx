/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-13 23:05:58
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2024-10-30 10:49:20
 * @FilePath: /yuzhou/app/user-center/src/layouts/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { App, ConfigProvider, GlobalToken, Layout, theme } from 'antd';

import zhCN from 'antd/es/locale/zh_CN';

import styles from './index.less';
import React from 'react';
import { Outlet } from 'react-router-dom';

import defaultTheme, { prefixCls } from '@/theme';
import { useStyleRegister, CSSInterpolation } from '@ant-design/cssinjs';

import 'dayjs/locale/zh-cn';

const { Content } = Layout;

const queyClient = new QueryClient();

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
  // 【自定义】制造样式
  const { theme, token, hashId } = useToken();

  // 全局注册，内部会做缓存优化
  const wrapSSR = useStyleRegister({ theme, token, hashId, path: [prefixCls] }, () => [
    genStyle(token),
  ]);

  return wrapSSR(
    <App>
      <Layout className={styles.layout}>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </App>,
  );
}

const genStyle = (token: GlobalToken): CSSInterpolation => ({});
