/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:14:33
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-26 15:19:06
 * @FilePath: /stock/stock-umi/src/pages/position/component/Editor.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Form, Input, InputNumber } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { update } from '@/api/position';

const { Item } = Form;

export default ({
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const inEdit = modalProps?.title === '编辑';

  async function onSubmit() {
    const value = await form?.validateFields();
    try {
      setModalProps((pre) => ({ ...pre, confirmLoading: true }));
      if (inEdit) {
        await update(value.code, value);
      }

      await onSuccess?.();
      setModalProps((pre) => ({ ...pre, visible: false }));
      form.resetFields();
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  return (
    <ModalForm
      formProps={{ onFinish: onSubmit, ...formProps }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name="code" hidden>
        <Input disabled />
      </Item>
      <Item name="stopProfit" label="止盈点" rules={[{ required: true }]}>
        <InputNumber placeholder="请输入" />
      </Item>
      <Item name="stopLoss" label="止损点" rules={[{ required: true }]}>
        <InputNumber placeholder="请输入" />
      </Item>
    </ModalForm>
  );
};
