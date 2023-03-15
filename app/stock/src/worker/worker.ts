/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 23:36:40
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-15 23:54:44
 * @FilePath: /yuzhou/app/stock/src/worker/worker.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { safeAdd, safeDivision } from '@/utils/number';
import { Weight, Stock, Sort2Num, avgField } from '../model';

self.onmessage = ({ data: { question } }) => {
  const a = avgField['values'];
  console.log(a)
  self.postMessage({
    answer: safeAdd(42, 20),
  });
};
