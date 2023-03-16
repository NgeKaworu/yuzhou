/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-14 23:42:22
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-17 00:20:42
 * @FilePath: /yuzhou/util/edk/src/decorators/Input/ShowCount.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import Scope from '../../';
import type { ReactElement } from 'react';
const { cloneElement } = Scope.react;
import type { InputProps } from 'antd';
const { Typography } = Scope.antd;

const { Text } = Typography;
/**
 * Input show count 切片
 */

export default (Element: ReactElement<InputProps>) => {
  const { value = '', maxLength } = Element?.props ?? {};
  if (maxLength !== undefined) {
    return cloneElement(Element, {
      suffix: (
        <Text type="secondary">
          {`${value}`?.length}/{maxLength}
        </Text>
      ),
    });
  }

  return Element;
};
