/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-14 23:42:22
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-15 14:00:42
 * @FilePath: /yuzhou/util/edk/src/components/DrawerForm/useDrawerForm.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import Scope from '../../';

const { useState } = Scope.react;
import type { FormInstance, FormProps } from 'antd';
const { Form } = Scope.antd;

import type { CustomDrawerProps } from '.';

export interface InitValue {
  drawerProps?: CustomDrawerProps;
  formProps?: FormProps;
  data?: any;
  form?: FormInstance;
}

export default (initValue?: InitValue) => {
  const [form] = Form.useForm(initValue?.form);

  const [drawerProps, setDrawerProps] = useState<CustomDrawerProps>({
    width: 800,
    onClose: close,
    placement: 'right',
    ...initValue?.drawerProps,
  });

  const [formProps, setFormProps] = useState<FormProps>({
    form,
    layout: 'vertical',
    ...initValue?.formProps,
    validateMessages: { required: '${label} 是必选字段' },
  });

  const [data, setData] = useState<any>(initValue?.data);

  function close() {
    setDrawerProps((pre) => ({ ...pre, open: false }));
    form.resetFields();
    setData(undefined);
  }

  return {
    form,
    drawerProps,
    setDrawerProps,
    formProps,
    setFormProps,
    data,
    setData,
    close,
  };
};
