import { findLastLTE } from './util';

/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-21 13:43:51
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-21 13:46:31
 * @FilePath: /yuzhou/util/edk/src/struct/array/util.test.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
describe('findLastLTE test', () => {
  it(`expect(findLastLTE(0, [1, 2, 3, 4, 5, 10])).toBe(void 0)`, () => {
    return expect(findLastLTE(0, [1, 2, 3, 4, 5, 10])).toBe(void 0);
  });
  it(`expect(findLastLTE(2, [1, 2, 3, 4, 5, 10])).toBe(2)`, () => {
    return expect(findLastLTE(2, [1, 2, 3, 4, 5, 10])).toBe(2);
  });
  it(`expect(findLastLTE(7, [1, 2, 3, 4, 5, 10])).toBe(7)`, () => {
    return expect(findLastLTE(7, [1, 2, 3, 4, 5, 10])).toBe(5);
  });
  it(`expect(findLastLTE(11, [1, 2, 3, 4, 5, 10])).toBe(11)`, () => {
    return expect(findLastLTE(11, [1, 2, 3, 4, 5, 10])).toBe(10);
  });

  it(`expect(findLastLTE(0, new Set([1, 2, 3, 4, 5, 10]))).toBe(void 0);`, () => {
    return expect(findLastLTE(0, new Set([1, 2, 3, 4, 5, 10]))).toBe(void 0);
  });
  it(`expect(findLastLTE(2, new Set([1, 2, 3, 4, 5, 10]))).toBe(2);`, () => {
    return expect(findLastLTE(2, new Set([1, 2, 3, 4, 5, 10]))).toBe(2);
  });
  it(`expect(findLastLTE(7, new Set([1, 2, 3, 4, 5, 10]))).toBe(5);`, () => {
    return expect(findLastLTE(7, new Set([1, 2, 3, 4, 5, 10]))).toBe(5);
  });
  it(`expect(findLastLTE(11, new Set([1, 2, 3, 4, 5, 10]))).toBe(10);`, () => {
    return expect(findLastLTE(11, new Set([1, 2, 3, 4, 5, 10]))).toBe(10);
  });
});
