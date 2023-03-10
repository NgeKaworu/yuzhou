/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-09 18:32:44
 * @FilePath: /yuzhou/workspace/edk/src/utils/isValidValue/index.test.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import 'jest';

import isValidValue from '.';

describe('isValidValue test', () => {
  it('[] is not valid', () => {
    expect(isValidValue([])).toBe(false);
  });
  it('{} is not valid', () => {
    expect(isValidValue({})).toBe(false);
  });
  it('null is not valid', () => {
    expect(isValidValue(null)).toBe(false);
  });
  it('undefined is not valid', () => {
    expect(isValidValue(undefined)).toBe(false);
  });

  it('"" is not valid', () => {
    expect(isValidValue('')).toBe(false);
  });
  it('false is valid', () => {
    expect(isValidValue(false)).toBe(true);
  });

  it('0 is valid', () => {
    expect(isValidValue(0)).toBe(true);
  });
});
