/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-06 14:55:59
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-16 11:24:00
 * @FilePath: /yuzhou/util/edk/src/struct/tree/dfs/index.test.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { deepMap } from '.';

describe('dfs test', () => {
  it('deep map test', () => {
    const obj = {
      string: 'string',
      number: 0,
      array: [0, 1, 2, { value: 3 }],
      obj2: {
        string: 'string2',
        number: 1,
        array: [{ value: 4 }, [5]],
      },
    };
    return expect(deepMap(obj, (i: any) => i)).toEqual(obj);
  });
});
