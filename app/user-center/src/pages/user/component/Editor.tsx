import { Form, Input } from 'antd';

import ModalForm from 'edk/src/components/ModalForm';
import type useModalForm from 'edk/src/components/ModalForm/useModalForm';

import { list } from '../../role/api';
import { update, create } from '../api';
import { useQuery } from '@tanstack/react-query';

import SearchSelect from 'edk/src/components/SearchSelect';
import { compose } from 'edk/src/decorators/utils';
import { IOC } from 'edk/src/decorators/hoc';
import SelectAll from 'edk/src/decorators/Select/SelectAll';

import { Email, Name, Pwd } from './Field';

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
  const roles = useQuery({
      queryKey: ['user-center/role/list', 'infinity'],

      queryFn: () => list({ params: { limit: 0 } }),
    }),
    rolesOpt = roles.data?.data?.map((r) => ({ label: r.name, value: r.id }));

  async function onSubmit() {
    const value = await form?.validateFields();
    try {
      setModalProps((pre) => ({ ...pre, confirmLoading: true }));
      let api;
      if (inEdit) {
        api = update;
      } else {
        api = create;
      }

      await api(value);
      await onSuccess?.();
      setModalProps((pre) => ({ ...pre, open: false }));
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
      <Item name="id" hidden>
        <input disabled />
      </Item>

      <Name />
      <Email disabled={inEdit} checkout={!inEdit} />
      <Pwd disabled={inEdit} />

      <Item name="roles" label="拥有权限">
        {compose<any>(IOC([SelectAll]))(<SearchSelect allowClear options={rolesOpt} />)}
      </Item>
    </ModalForm>
  );
};
