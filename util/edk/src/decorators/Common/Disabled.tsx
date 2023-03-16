/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-17 00:21:19
 * @FilePath: /yuzhou/util/edk/src/decorators/Common/Disabled.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import Scope from '../../';
import type { ReactElement } from 'react';
const { cloneElement } = Scope.react;
/**
 * disabled 切片
 */
export default <P extends any = any>(disabled: boolean) =>
  (Element: ReactElement<P & { disabled: boolean }>) => {
    if (disabled) {
      return cloneElement<any>(Element, { disabled, onClick: void 0 });
    }
    return Element;
  };
