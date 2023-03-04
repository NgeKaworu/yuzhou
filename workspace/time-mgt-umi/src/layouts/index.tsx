import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
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
