/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:30:39
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-26 13:12:39
 * @FilePath: /stock/stock-umi/src/api/exchange.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Tail } from '@/js-sdk/decorators/type';
import { restful } from '@/js-sdk/utils/http';
import { Res } from '@/js-sdk/utils/http/type';
import Exchange from '@/model/exchange';
import { SERVER } from '.';

export const create = (...args: Tail<Parameters<typeof restful.post>>) =>
  restful.post(`${SERVER}/exchange`, ...args);

export const deleteOne = (id: string, ...args: Tail<Parameters<typeof restful.delete>>) =>
  restful.delete(`${SERVER}/exchange/${id}`, ...args);

export const update = (id: string, ...args: Tail<Parameters<typeof restful.patch>>) =>
  restful.patch<Exchange>(`${SERVER}/exchange/${id}`, ...args);

export const list = (code: string, ...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get<Res<Exchange[]>, Res<Exchange[]>>(`${SERVER}/exchange/${code}`, ...args);
