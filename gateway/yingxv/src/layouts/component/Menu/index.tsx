/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-16 15:01:23
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-10-30 23:21:31
 * @FilePath: /yuzhou/gateway/yingxv/src/layouts/component/Menu/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Menu, Drawer, Avatar } from 'antd';
import * as icons from '@ant-design/icons';
import type { DrawerProps, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { list } from './service';
import Perm from '@/model/Perm';
import { useState, createElement } from 'react';
import styles from './index.less';
import prem2Tree from './util/perm2Tree';
import clsx from 'clsx';

export default () => {
  const [drawer, setDrawer] = useState<DrawerProps>({
    closable: true,
    closeIcon: null,
    bodyStyle: { padding: 0 },
    onClose: () => setDrawer((pre) => ({ ...pre, open: false })),
    placement: 'left',
    width: 256,
  });

  const { pathname } = useLocation();

  const menu = useQuery({
    queryKey: ['menu-list'],
    queryFn: () => list(),
    refetchOnWindowFocus: false,
  });

  const trigger = () => {
    setDrawer((pre) => ({ ...pre, open: !pre.open }));
  };

  const renderMenu = (
    subMen = prem2Tree(menu?.data?.data?.filter((m) => !m.isHide && m.isMenu)),
  ): MenuProps['items'] =>
    subMen.map(({ children, url, name, icon }) => ({
      icon: icon ? createElement((icons as any)[icon]) : void 0,
      label: children?.length ? (
        name
      ) : (
        <Link to={url} onClick={trigger}>
          {name}
        </Link>
      ),
      key: url,
      children: children?.length ? renderMenu(children) : void 0,
    }));

  return (
    <>
      <Drawer {...drawer}>
        <div className={styles.logo} />

        <Menu mode="inline" selectedKeys={[pathname]} items={renderMenu()} />
      </Drawer>
      <div
        className={clsx(styles.icon, drawer.open && styles['icon-open'])}
        onClick={trigger}
      >
        <Avatar className={styles.avatar} shape="square" src={require('@/assets/img/ran.png')} />
      </div>
    </>
  );
};
