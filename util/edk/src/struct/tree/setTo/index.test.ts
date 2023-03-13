/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-10 15:10:00
 * @FilePath: /yuzhou/workspace/edk/src/struct/tree/setTo/index.test.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import setTo from '.';

describe('setTo test', () => {
  it("setTo(undefined, ['a', 1, '3'], '123') => { a: [, [, , , '123']] }", () => {
    expect(setTo(undefined, ['a', 1, '3'], '123')).toEqual({ a: [, [, , , '123']] });
  });

  it("setTo(undefined, ['a', 1, '3', symbol], '123') => { a: [, [, , , { symbol: '123'}]] }", () => {
    const s = Symbol('symbol');
    expect(setTo(undefined, ['a', 1, '3', s], '123')).toEqual({ a: [, [, , , { [s]: '123' }]] });
  });

  it("setTo({}, ['a', 1, '3'], '123') => { a: [, [, , , '123']] }", () => {
    expect(setTo({}, ['a', 1, '3'], '123')).toEqual({ a: [, [, , , '123']] });
  });

  it('invalid pointer type', () => {
    // @ts-expect-error
    expect(() => setTo(1, ['a', 1, '3'], '123')).toThrowError(
      new Error(`invalid pointer type: number, except array | object | undefined | null`),
    );
  });

  it('invalid key type', () => {
    // @ts-expect-error
    expect(() => setTo([], [[], 'a', 1, '3'], '123')).toThrowError(
      new Error(`invalid key type: object, except string | number | symbol`),
    );
  });

  it('throw error', () => {
    expect(() => setTo([], ['a', 1, '3'], '123')).toThrowError(
      new Error('cannot use a type other than a number as an array key'),
    );
  });
});
