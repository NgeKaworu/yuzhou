import { QueryClient, QueryClientProvider } from 'react-query';
import type { PropsWithChildren } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ConfigProvider, Layout } from 'antd';

import zhCN from 'antd/es/locale/zh_CN';

import styles from './index.less';
import React from 'react';
const { Content } = Layout;

const queyClient = new QueryClient();

export default (props: PropsWithChildren<any>) => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queyClient}>
        <ConfigProvider locale={zhCN}>
          <DndProvider backend={HTML5Backend}>
            <Layout className={styles.layout}>
              <Content className={styles.content}>{props.children}</Content>
            </Layout>
          </DndProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
