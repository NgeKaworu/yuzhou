/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-13 17:00:04
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-13 18:43:04
 * @FilePath: /yuzhou/app/todo-list/src/components/Importer.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React, { cloneElement, ReactElement, useState } from 'react';
import { Modal, Input } from 'antd';

import { ModalProps } from 'antd/es/modal';
import { TextAreaProps } from 'antd/es/input/TextArea';

const TextArea = Input.TextArea;

export interface ImportorProps {
  onOk: (value: string) => unknown;
  tips: string;
  textAearProps?: TextAreaProps;
  modalProps?: ModalProps;

  children?: ReactElement;
}

export default function (props: ImportorProps) {
  const { modalProps, textAearProps, onOk, tips, children } = props;

  const [vis, setVis] = useState(false);
  const [value, setValue] = useState('');

  function modalVis() {
    setVis(true);
  }

  function onCancel() {
    setVis(false);
  }

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e?.currentTarget?.value);
  }

  async function okHandler() {
    try {
      await onOk(value);
      setVis(false);
      setValue('');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      {children && cloneElement(children, { onClick: modalVis })}
      <Modal
        onOk={okHandler}
        open={vis}
        onCancel={onCancel}
        title="批量导入"
        {...modalProps}
      >
        <TextArea
          value={value}
          onChange={onChange}
          autoSize={{ minRows: 20 }}
          {...textAearProps}
        ></TextArea>
        {tips}
      </Modal>
    </>
  );
}
