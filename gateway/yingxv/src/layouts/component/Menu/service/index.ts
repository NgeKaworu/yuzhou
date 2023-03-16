/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-16 15:01:23
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-16 21:52:43
 * @FilePath: /yuzhou/gateway/yingxv/src/layouts/component/Menu/service/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Tail } from 'edk/src/decorators/type';
import { restful } from 'edk/src/utils/http';
import Perm from '@/model/Perm';

export const list = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful
    .get<Perm[]>('user-center/menu', ...args)
    .then((res) => ({ data: res.data?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) }));
