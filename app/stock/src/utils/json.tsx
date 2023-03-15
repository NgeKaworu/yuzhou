/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-01-25 15:58:42
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-01-25 16:02:56
 * @FilePath: /stock/stock-umi/src/utils/json.tsx
 * @Description:
 *
 * Copyright (c) 2023 by fuRan NgeKaworu@gmail.com, All Rights Reserved.
 */
export const encode = <T extends any = any>(s: T[]) => JSON.stringify(s);

export const decode = <T extends any = any>(j: string | null, _default: T = [] as T): T => {
  try {
    return JSON.parse(j ?? '');
  } catch {
    return _default;
  }
};
