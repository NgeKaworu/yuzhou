/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 10:04:53
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2024-10-31 16:54:08
 * @FilePath: /yuzhou/app/flashcard/src/layouts/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import { ConfigProvider } from 'antd';

import defaultTheme from '@/theme';


import zhCN from 'antd/es/locale/zh_CN';

const queyClient = new QueryClient();

export default () => (
  <React.StrictMode>
    <QueryClientProvider client={queyClient}>
      <ConfigProvider locale={zhCN} theme={defaultTheme}>
        <Outlet />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
