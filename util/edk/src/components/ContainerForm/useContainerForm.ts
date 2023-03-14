/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-14 23:25:54
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-14 23:26:33
 * @FilePath: /yuzhou/util/edk/src/components/ContainerForm/useContainerForm.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import Scope from '../';
const { useState } = Scope.react;
import type { FormInstance, FormProps } from 'antd';
import Scope from '../../';
const { Form } = Scope.antd;

export type ContainerProps<T> = T & {
  onClose?: (...args: any) => void;
  confirmLoading?: boolean;
  visible?: boolean;
};

export interface InitValue<T> {
  containerProps?: ContainerProps<T>;
  formProps?: FormProps;
  data?: any;
  form?: FormInstance;
}

export default <T>(initValue?: InitValue<T>) => {
  const [form] = Form.useForm(initValue?.form);

  const [containerProps, setContainerProps] = useState<ContainerProps<T>>({
    onClose: close,
    ...initValue?.containerProps,
  } as ContainerProps<T>);

  const [formProps, setFormProps] = useState<FormProps>({
    form,
    layout: 'vertical',
    ...initValue?.formProps,
    validateMessages: { required: '${label} 是必选字段' },
  });

  const [data, setData] = useState<any>(initValue?.data);

  function close() {
    setContainerProps((pre) => ({ ...pre, open: false }));
    form.resetFields();
    setData(undefined);
  }

  return {
    form,
    containerProps,
    setContainerProps,
    formProps,
    setFormProps,
    data,
    setData,
    close,
  };
};
