/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-14 23:44:26
 * @FilePath: /yuzhou/util/edk/src/components/SearchForm.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import Scope from '../';
import type { FormProps } from 'antd';
const { Form } = Scope.antd;
import type { ReactNode } from 'react';
import useURLSearch from '../hooks/useURLSearch';

export interface SearchFormProps {
  formProps?: FormProps;
  children: ReactNode;
}

/**
 * SearchForm
 * 单一责任, 仅负责Form值和search双向绑定
 */
export default (({ formProps, children }) => {
  const {
    onFinish,
    onReset,
    name = 'search_form',
    form: outerForm,
    ...restFormProps
  } = formProps || {};
  const [form] = outerForm ? [outerForm] : Form.useForm();

  const { setURLSearch } = useURLSearch({
    key: name,
    onURLSearchChange,
  });

  function onURLSearchChange(values: any) {
    if (values) {
      form.setFieldsValue(values);
      onFinish?.(values);
    } else {
      form.resetFields();
      onReset?.(values);
    }
  }

  const _onReset: FormProps['onReset'] = (...e) => {
    onReset?.(...e);
    setURLSearch(restFormProps.initialValues);
  };

  return (
    <Form
      form={form}
      name={name}
      labelCol={{ offset: 1, span: 6 }}
      wrapperCol={{ span: 17 }}
      onFinish={setURLSearch}
      onReset={_onReset}
      {...restFormProps}
    >
      {children}
    </Form>
  );
}) as React.FC<SearchFormProps>;
