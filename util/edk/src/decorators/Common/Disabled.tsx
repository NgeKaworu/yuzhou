/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-11 02:38:06
 * @FilePath: /yuzhou/workspace/edk/src/decorators/Common/Disabled.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import type { ReactElement } from 'react';
import Scope from '../';
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
