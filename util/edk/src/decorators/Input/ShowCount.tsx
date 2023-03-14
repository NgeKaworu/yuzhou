import type { ReactElement } from 'react';
import Scope from '../';
const { cloneElement } = Scope.react;
import type { InputProps } from 'antd';
import Scope from '../../';
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
