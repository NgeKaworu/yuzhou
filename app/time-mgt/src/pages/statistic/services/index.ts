/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 01:55:13
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-11 22:37:55
 * @FilePath: /yuzhou/workspace/time-mgt-umi/src/pages/statistic/services/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { restful } from 'edk/src/utils/http';

export function page<T, R, D>(data?: D) {
  return restful.post<T, R, D>('time-mgt/v1/record/statistic', data, {
    notify: 'fail',
  });
}
