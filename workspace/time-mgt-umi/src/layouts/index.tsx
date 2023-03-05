/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 01:55:13
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-05 19:40:07
 * @FilePath: /monorepo-lab/workspace/time-mgt-umi/src/layouts/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { ConfigProvider } from 'antd';

import { FormOutlined, PieChartOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router';

import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.less';

const queyClient = new QueryClient();

const menu = [
  { title: '记录', path: '/record/', icon: <FormOutlined /> },
  { title: '统计', path: '/statistic/', icon: <PieChartOutlined /> },
];

export default (props: PropsWithChildren<any>) => {
  const { pathname } = useLocation();
  const history = useHistory();
  return (
    <QueryClientProvider client={queyClient}>
      <ConfigProvider locale={zhCN}>
        <div className={styles['bottom-fix-panel']}>
          <section className={styles['fill-scroll-part']}>{props.children}</section>
          <footer className={styles['bottom-menu']}>
            {menu.map((i) => (
              <div
                className={[
                  styles?.['menu-item'],
                  i.path.includes(pathname) && styles?.['active'],
                ]?.join(' ')}
                key={i.path}
                onClick={() => history.push(i.path)}
              >
                {i.icon}
                {i.title}
              </div>
            ))}
          </footer>
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
