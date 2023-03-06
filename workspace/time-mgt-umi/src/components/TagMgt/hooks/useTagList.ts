/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 01:55:13
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-06 10:23:47
 * @FilePath: /monorepo-lab/workspace/time-mgt-umi/src/components/TagMgt/hooks/useTagList.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { page } from '../services';
import { useQuery } from '@tanstack/react-query';


export default (...args: Parameters<typeof page>) => {
    return useQuery<any>(['tag-list'], () => page(...args))
}
