/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 11:56:08
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-15 14:15:02
 * @FilePath: /yuzhou/app/stock/src/layout/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ConfigProvider, Layout, theme } from 'antd';

import zhCN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';

import styles from './index.less';
import React from 'react';

import defaultTheme, { prefixCls } from '@/theme';
import { DerivativeToken } from 'antd/es/theme/internal';

import { useStyleRegister, CSSInterpolation } from '@ant-design/cssinjs';

const { Content } = Layout;

const queyClient = new QueryClient();

export default () => (
  <React.StrictMode>
    <QueryClientProvider client={queyClient}>
      <ConfigProvider locale={zhCN} theme={defaultTheme}>
        <DndProvider backend={HTML5Backend}>
          <Main />
        </DndProvider>
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
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>,
  );
}

const genStyle = (token: DerivativeToken): CSSInterpolation => ({});
