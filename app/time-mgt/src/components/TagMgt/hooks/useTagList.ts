/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 01:55:13
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-10-30 23:44:11
 * @FilePath: /yuzhou/app/time-mgt/src/components/TagMgt/hooks/useTagList.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { page } from '../services';
import { useQuery } from '@tanstack/react-query';

export default (...args: Parameters<typeof page>) => {
  return useQuery({
    queryKey: ['tag-list'],
    queryFn: () => page(...args),
  });
};
