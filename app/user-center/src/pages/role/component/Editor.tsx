import { Form, TreeSelect, Input, Space, Typography, TreeSelectProps } from 'antd';
import type { LinkProps } from 'antd/lib/typography/Link';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { list } from '../../perm/api';
import { update, create, validateKey } from '../api';
import { useQuery } from 'react-query';
import perm2Tree, { PermOpt } from '@/pages/perm/util/perm2Tree';
import permFilter from '@/pages/perm/util/permFilter';

import { compose } from '@/js-sdk/decorators/utils';
import { IOC } from '@/js-sdk/decorators/hoc';
import Format from '@/js-sdk/decorators/Format';
import styles from './Editor.less';
import ChildrenRender from '@/js-sdk/components/ChildrenRender';
import dfs, { dfsMap } from '@/js-sdk/struct/tree/dfs';

const { Item } = Form;
const { Link } = Typography;

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
  const perms = useQuery(['user-center/perm/list', 'infinity'], () =>
    list({ params: { limit: 0 } }),
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

      await api(value);
      await onSuccess?.();
      setModalProps((pre) => ({ ...pre, visible: false }));
      form.resetFields();
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  function pickHOF(
    type: 'ALL' | 'REVERT',
    props: { value: PermOpt['id'][]; onChange: (...args: any) => void },
    cur: Partial<PermOpt>,
  ): LinkProps['onClick'] {
    return (e) => {
      e.stopPropagation();
      let allKey: string[] = [];
      dfs<Partial<PermOpt>>(cur, 'children', (t) => {
        t.id && allKey.push(t.id);
        return false;
      });

      let value = props.value ?? [];
      if (type === 'ALL') {
        props?.onChange?.(Array.from(new Set([...allKey, ...value])));
      }

      if (type === 'REVERT') {
        let set = new Set([...value]);
        for (const k of allKey) {
          if (set.has(k)) {
            set.delete(k);
          } else {
            set.add(k);
          }
        }
        props?.onChange?.(Array.from(set));
      }
    };
  }

  return (
    <ModalForm
      formProps={{ onFinish: onSubmit, ...formProps }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name="name" label="角色名" rules={[{ required: true }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item
        name="id"
        label="角色标识"
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
      <Item name="perms" label="拥有权限">
        {compose<any>(
          IOC([
            Format({
              f: (v) => v?.map((vv: any) => vv?.value ?? vv),
            }),
          ]),
        )(
          <ChildrenRender<TreeSelectProps<PermOpt['id'][]>>>
            {(props: any) => (
              <TreeSelect
                treeDefaultExpandAll
                placeholder="请选择"
                fieldNames={{ label: 'label' }}
                treeNodeLabelProp="name"
                treeData={
                  dfsMap<Partial<PermOpt>>(
                    { children: perm2Tree(perms?.data?.data) },
                    'children',
                    (t) => {
                      return {
                        ...t,
                        label: (
                          <div className={styles['tree-item']}>
                            <span>{t.name}</span>
                            <span className={styles['tree-item-tool']}>
                              <Space>
                                <Link onClick={pickHOF('ALL', props, t)}>全选</Link>
                                <Link onClick={pickHOF('REVERT', props, t)}>反选</Link>
                              </Space>
                            </span>
                          </div>
                        ),
                      };
                    },
                  ).children
                }
                filterTreeNode={permFilter}
                treeLine={{ showLeafIcon: false }}
                showSearch
                multiple
                treeCheckable
                showCheckedStrategy="SHOW_ALL"
                allowClear
                treeCheckStrictly
                {...props}
              />
            )}
          </ChildrenRender>,
        )}
      </Item>
    </ModalForm>
  );
};
