/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-09 19:28:58
 * @FilePath: /yuzhou/workspace/edk/src/utils/json/safeParse.test.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import 'jest';

import safeJSONParse from './safeParse';

describe('safeJSONParse test', () => {
  it('[] parse to []', () => {
    expect(safeJSONParse('[]')).toEqual([]);
  });
  it('{} parse to {}', () => {
    expect(safeJSONParse('{}')).toEqual({});
  });

  it('"" parse to void 0', () => {
    expect(safeJSONParse('')).toBe(void 0);
  });
});
