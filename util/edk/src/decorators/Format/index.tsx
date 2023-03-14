/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-14 23:42:22
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-14 23:44:53
 * @FilePath: /yuzhou/util/edk/src/decorators/Format/index.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import Scope from '../../';
import type { ReactElement } from 'react';
const { cloneElement } = Scope.react;
import { compose, curry, maybe } from '../utils';

// 正反函数
// f(g(x)) = f(g(x)) = x
export interface FormatParams {
  f?: (value: any) => any;
  g?: (value: any) => any;
  valuePropName?: string;
}
/**
 * 格式化切片
 */

export default curry(({ f, g, valuePropName = 'value' }: FormatParams, Element: ReactElement) => {
  return cloneElement(Element, {
    onChange: compose(maybe(Element?.props?.onChange), maybe(f)),
    [valuePropName]: g?.(Element?.props?.[valuePropName]) ?? Element?.props?.[valuePropName],
  });
});
