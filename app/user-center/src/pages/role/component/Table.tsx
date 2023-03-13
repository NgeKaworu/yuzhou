import Table, { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import useLightTablePro from '@/js-sdk/components/LightTablePro/hook/useLightTablePro';
import Role from '@/model/Role';
import { list as permList } from '../../perm/api';
import { list, deleteOne } from '../api';
import Editor from './Editor';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import { Button, Space, Typography, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { cloneElement } from 'react';
import Perm from '@/model/Perm';
const { Link } = Typography;

export default () => {
  const perms = useQuery(['user-center/perm/list', 'infinity'], () =>
    permList({ params: { limit: 0 } }),
  );
  const { actionRef, formRef } = useLightTablePro();
  const editor = useModalForm();

  const columns: LightTableProColumnProps<Role & { keyword?: string }>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      hideInSearch: true,
      copyable: true,
    },

    { dataIndex: 'keyword', title: '关键字', hideInTable: true },
    { dataIndex: 'name', title: '角色名', hideInSearch: true },
    {
      dataIndex: 'perms',
      title: '拥有权限',
      width: 200,
      ellipsis: { tooltip: true, padding: 17 },
      hideInSearch: true,
      render: (node) =>
        node
          ? cloneElement(node, {
              children: node?.props?.children?.map(
                (pid: Perm['id'], idx: number, arr: any[]) =>
                  `${perms?.data?.data?.find(({ id }) => id === pid)?.name}${
                    idx !== arr?.length - 1 ? '、' : ''
                  }`,
              ),
            })
          : null,
    },
    { dataIndex: 'createAt', title: '创建时间', valueType: 'dateTime', hideInSearch: true },
    { dataIndex: 'updateAt', title: '更新时间', valueType: 'dateTime', hideInSearch: true },
    {
      dataIndex: 'id',
      title: '操作',
      hideInSearch: true,
      render: (id, row) => (
        <Space>
          <Link onClick={edit(row)}>编辑</Link>
          <Popconfirm title="操作不可逆，请二次确认" onConfirm={remove(id)}>
            <Link>删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function create() {
    editor.setModalProps((pre) => ({ ...pre, visible: true, title: '新增' }));
  }

  function edit(row: Role) {
    return () => {
      editor.setModalProps((pre) => ({ ...pre, visible: true, title: '编辑' }));
      editor.form.setFieldsValue(row);
    };
  }

  function remove(id: Role['id']) {
    return async () => {
      try {
        await deleteOne(id, { notify: true });
        actionRef.current?.reload?.();
      } catch {}
    };
  }

  function editSuccess() {
    actionRef.current?.reload?.();
  }

  return (
    <>
      <Editor {...editor} onSuccess={editSuccess} />
      <Table
        rowKey={'id'}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        headerTitle={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={create}>
              新增
            </Button>
          </Space>
        }
        queryOptions={{ refetchOnWindowFocus: false }}
        request={async (params, pagination) => {
          const res = await list({
            params: {
              keyword: params?.keyword,
              skip: (pagination?.current ?? 0) * (pagination?.pageSize ?? 0),
              limit: pagination?.pageSize,
            },
          });

          return {
            data: res?.data || [],
            page: pagination?.current || 1,
            success: true,
            total: res?.total || 0,
          };
        }}
      />
    </>
  );
};
