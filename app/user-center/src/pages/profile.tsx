/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-10-30 22:34:17
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-10-30 23:49:20
 * @FilePath: /yuzhou/app/user-center/src/pages/profile.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { restful } from 'edk/src/utils/http';
import User from '@/model/User';
import { Spin, Card, Typography, Descriptions } from 'antd';
import { useQuery } from '@tanstack/react-query';
import styles from './profile.less';

const { Link } = Typography;
const { Item } = Descriptions;

export default () => {
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => restful.get<User>('user-center/profile'),
  });
  const logout = () => {
    localStorage.clear();
    location.replace('/user-center/login/');
  };

  return (
    <div className={styles.content}>
      <Card title="个人档案" extra={<Link onClick={logout}>登出</Link>}>
        <Spin spinning={profile.isFetching}>
          <div className={[styles.card]?.join(' ')}>
            <Descriptions column={1}>
              <Item label="昵称">{profile.data?.data?.name}</Item>
              <Item label="Email">{profile.data?.data?.email}</Item>
            </Descriptions>
          </div>
        </Spin>
      </Card>
    </div>
  );
};
