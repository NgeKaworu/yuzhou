/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-16 15:01:23
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-18 20:12:44
 * @FilePath: /yuzhou/gateway/yingxv/src/layouts/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ConfigProvider, theme } from 'antd';

import zhCN from 'antd/es/locale/zh_CN';
import Menu from './component/Menu';
import { Outlet } from 'react-router-dom';

import defaultTheme, { prefixCls } from '@/theme';

import { useStyleRegister, CSSInterpolation } from '@ant-design/cssinjs';
import { DerivativeToken } from 'antd/es/theme/internal';
import 'dayjs/locale/zh-cn';
import React from 'react';

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
    <>
      <Menu />
      <Outlet />
    </>,
  );
}

const genStyle = (token: DerivativeToken): CSSInterpolation => ({});
