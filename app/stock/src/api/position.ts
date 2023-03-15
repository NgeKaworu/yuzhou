/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:30:39
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-26 16:42:04
 * @FilePath: /stock/stock-umi/src/api/position.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Tail } from 'edk/src/decorators/type';
import { restful } from 'edk/src/utils/http';
import { Res } from 'edk/src/utils/http/type';
import Position from '@/model/position';
import { SERVER } from '.';

export const detail = (code: string, ...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get<Res<Position>, Res<Position>>(`${SERVER}/position/${code}`, ...args);

export const update = (code: string, ...args: Tail<Parameters<typeof restful.patch>>) =>
  restful.patch(`${SERVER}/position/${code}`, ...args);

export const list = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get<Res<Position[]>, Res<Position[]>>(`${SERVER}/position`, ...args);
