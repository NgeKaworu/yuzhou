import { Form, Input, Tooltip, TreeSelect, Radio, InputNumber } from 'antd';
import * as icons from '@ant-design/icons';

import { createElement, isValidElement, ReactNode } from 'react';
import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { update, create, list, validateKey } from '../api';
import { useQuery } from 'react-query';
import { dfsMap } from '@/js-sdk/struct/tree/dfs';
import perm2Tree, { PermOpt } from '../util/perm2Tree';
import permFilter from '../util/permFilter';
import { MENU_TYPE_MAP } from '../model/constant';
import Options from '@/js-sdk/utils/Options';
import SearchSelect from '@/js-sdk/components/SearchSelect';

const { Item } = Form;
const { Group: RGroup } = Radio;
const firstLetter = (s: string) => s[0];
const isUpperCase = (s: string) => s === s.toUpperCase();

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
  const perms = useQuery(['user-center/perm/list', 'menu', 'infinity'], () =>
    list({ params: { limit: 0, isMenu: true } }),
  );
  const iconOpt = Object.keys(icons).reduce(
    (acc: { value: string; label: ReactNode }[], k) =>
      isUpperCase(firstLetter(k)) && k !== 'IconProvider'
        ? acc.concat({
            value: k,
            label: createElement((icons as any)?.[k]),
          })
        : acc,
    [],
  );

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

      await onSuccess?.(await api(value));
      setModalProps((pre) => ({ ...pre, visible: false }));
      perms.refetch();
      form.resetFields();
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,
        initialValues: { isMenu: true, isHide: false, isMicroApp: false },
        ...formProps,
      }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name="name" label="权限名" rules={[{ required: true }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item
        name="id"
        label="权限标识"
        rules={[
          { required: true },
          {
            validator: (_, id) =>
              inEdit || !id ? Promise.resolve() : validateKey({ params: { id }, notify: false }),
          },
          {
            pattern: /^[\w-]*$/,
            message: '仅允许英文、数字和“-”',
          },
        ]}
      >
        <Input placeholder="请输入" disabled={inEdit} />
      </Item>

      <Item name="order" label="序号">
        <InputNumber placeholder="请输入" precision={0} />
      </Item>

      <Item
        name="isMenu"
        label="是否当作菜单使用？"
        tooltip="菜单模式可以配置层级关系"
        rules={[{ required: true }]}
      >
        <RGroup optionType="button" options={Options(MENU_TYPE_MAP).toOpt} disabled={inEdit} />
      </Item>

      <Item dependencies={[['isMenu'], ['isMicroApp']]} noStyle>
        {({ getFieldValue, setFieldsValue }) =>
          getFieldValue(['isMenu']) && (
            <>
              <Item
                name="isMicroApp"
                label="是否当作微应用入口？"
                tooltip="微应用的路由必须是个有效Url"
                rules={[{ required: true }]}
              >
                <RGroup optionType="button" options={Options(MENU_TYPE_MAP).toOpt} />
              </Item>
              <Item name="icon" label="icon">
                <SearchSelect options={iconOpt} allowClear />
              </Item>
              <Item dependencies={['id']} noStyle>
                {() => {
                  const id = getFieldValue(['id']),
                    validOpt = dfsMap<Partial<PermOpt>>(
                      { children: perm2Tree(perms?.data?.data) },
                      'children',
                      (t) => {
                        const ouroboros = t?.genealogy?.includes(id);
                        return {
                          ...t,
                          disabled: ouroboros,
                          name: (
                            <Tooltip title={ouroboros ? '不能选子孙节点' : t.url}>{t.name}</Tooltip>
                          ),
                        };
                      },
                    ).children;

                  return (
                    <Item name="pID" label="上级菜单">
                      <TreeSelect
                        fieldNames={{ label: 'name' }}
                        treeDefaultExpandAll
                        placeholder="请选择"
                        treeNodeLabelProp="name"
                        treeLine={{ showLeafIcon: false }}
                        treeData={validOpt}
                        showSearch
                        filterTreeNode={permFilter}
                        allowClear
                        onChange={(_, label) =>
                          setFieldsValue({
                            url: isValidElement(label?.[0]) ? label?.[0]?.props?.title : void 0,
                          })
                        }
                      />
                    </Item>
                  );
                }}
              </Item>

              <Item name="url" label="路由" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Item>

              <Item
                name="isHide"
                label="是否在菜单中隐藏"
                tooltip="开起隐藏后将不在菜单中渲染，但依旧可以通过url访问"
              >
                <RGroup optionType="button" options={Options(MENU_TYPE_MAP).toOpt} />
              </Item>
            </>
          )
        }
      </Item>
    </ModalForm>
  );
};
