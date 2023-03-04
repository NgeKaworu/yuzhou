import React, { ReactElement } from 'react';

import { Form, Input } from 'antd';

import { SketchPicker, SketchPickerProps } from 'react-color';

import ModalForm from '@/js-sdk/components/ModalForm';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import { add, update } from '../services';
import { compose } from '@/js-sdk/decorators/utils';
import { IOC } from '@/js-sdk/decorators/hoc';
import Format from '@/js-sdk/decorators/Format';

const { Item } = Form;
export function TagModForm({
  modalProps,
  setModalProps,
  formProps,
  form,
  onSuccess,
}: ReturnType<typeof useModalForm> & { onSuccess?: () => void }) {
  async function onSubmit() {
    try {
      const value = await form.validateFields();
      setModalProps((pre) => ({ ...pre, confirmLoading: true }));
      if (value?.id) {
        await update(value);
      } else {
        await add(value);
      }
      await onSuccess?.();
      setModalProps((pre) => ({ ...pre, visible: false }));
    } catch (e) {
      console.error(e);
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  return (
    <ModalForm
      modalProps={{ onOk: onSubmit, ...modalProps }}
      formProps={{
        onFinish: onSubmit,
        initialValues: {
          color: '#f5222d',
        },
        ...formProps,
      }}
    >
      <Item name="id" hidden>
        <Input />
      </Item>

      <Item name="name" rules={[{ required: true, message: '标签名不能为空' }]} label="标签名">
        <Input placeholder="标签名" allowClear autoComplete="off" />
      </Item>
      <Item
        valuePropName="color"
        name="color"
        rules={[{ required: true, message: '请选个颜色' }]}
        label="颜色"
      >
        {compose<ReactElement<SketchPickerProps>>(
          IOC([
            Format({
              valuePropName: 'color',
              f: (obj: any) => obj?.hex,
            }),
          ]),
        )(
          <SketchPicker
            width="unset"
            disableAlpha
            presetColors={[
              '#f5222d',
              '#fa541c',
              '#fa8c16',
              '#faad14',
              '#fadb14',
              '#a0d911',
              '#52c41a',
              '#13c2c2',
              '#1890ff',
              '#2f54eb',
              '#722ed1',
              '#eb2f96',
            ]}
          />,
        )}
      </Item>
    </ModalForm>
  );
}
