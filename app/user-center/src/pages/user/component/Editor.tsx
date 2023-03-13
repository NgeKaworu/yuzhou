import { Form, Input } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { list } from '../../role/api';
import { update, create } from '../api';
import { useQuery } from 'react-query';

import SearchSelect from '@/js-sdk/components/SearchSelect';
import { compose } from '@/js-sdk/decorators/utils';
import { IOC } from '@/js-sdk/decorators/hoc';
import SelectAll from '@/js-sdk/decorators/Select/SelectAll';

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
  const roles = useQuery(['user-center/role/list', 'infinity'], () =>
      list({ params: { limit: 0 } }),
    ),
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
