/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-10-30 22:33:45
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-10-30 23:45:04
 * @FilePath: /yuzhou/app/time-mgt/src/pages/statistic/hooks/useStatisticList.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { page } from '../services';
import { useQuery } from '@tanstack/react-query';

export default (...args: Parameters<typeof page>) =>
  useQuery({
    queryKey: ['tag-list', ...args],
    queryFn: () => page(...args),
  });
