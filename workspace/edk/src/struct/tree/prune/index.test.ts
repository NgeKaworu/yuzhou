/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-11 20:44:41
 * @FilePath: /yuzhou/workspace/edk/src/struct/tree/prune/index.test.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import isValidValue from '../../../utils/isValidValue';
import prune from '.';

describe('prune test', () => {
  it('[] === undefined', () => {
    expect(prune([], isValidValue)).toEqual(undefined);
  });

  it('[{}] === undefined', () => {
    expect(prune([{}], isValidValue)).toEqual(undefined);
  });

  it('[{}, {}, {}, false] === [false]', () => {
    expect(prune([{}, {}, {}, false], isValidValue)).toEqual([false]);
  });

  it('[{}, {}, [], [[[[[[[[[[[]]]]]]]]]]]] === undefine', () => {
    expect(prune([{}, {}, [], [[[[[[[[[[[]]]]]]]]]]]], isValidValue)).toEqual(undefined);
  });

  it("[{}, {}, [], [[[[[[[[[[[{ a: 'a' }]]]]]]]]]]]] === [[[[[[[[[[[[{ a: 'a' }]]]]]]]]]]]]", () => {
    expect(prune([{}, {}, [], [[[[[[[[[[[{ a: 'a' }]]]]]]]]]]]], isValidValue)).toEqual([
      [[[[[[[[[[[{ a: 'a' }]]]]]]]]]]],
    ]);
  });

  it('[{}, {}, [], [[[[[[[[[[[{ a: undefined }]]]]]]]]]]]] === undefine', () => {
    expect(prune([{}, {}, [], [[[[[[[[[[[{ a: undefined }]]]]]]]]]]]], isValidValue)).toEqual(
      undefined,
    );
  });

  it("[{ a: 'a' }, { b: [] }, [{}, [1]], [[[[[[[[[[[{ a: undefined }]]]]]]]]]]]] === [{ a: 'a' }, [[1]]]", () => {
    expect(
      prune(
        [{ a: 'a' }, { b: [] }, [{}, [1]], [[[[[[[[[[[{ a: undefined }]]]]]]]]]]]],
        isValidValue,
      ),
    ).toEqual([{ a: 'a' }, [[1]]]);
  });
});
