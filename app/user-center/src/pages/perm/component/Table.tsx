import { useState, Key, createElement } from 'react';
import { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import Perm from '@/model/Perm';
import { list, deleteOne, update } from '../api';
import Editor from './Editor';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import { Button, Space, Typography, Popconfirm, Form, Card, FormProps, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MENU_TYPE_MAP } from '../model/constant';
import { useQuery } from 'react-query';
import LightTable from '@/js-sdk/components/LightTable';
import style from '@/js-sdk/components/LightTablePro/index.less';
import Search from '@/js-sdk/components/Search';
import perm2Tree, { PermOpt } from '../util/perm2Tree';
import dfs from '@/js-sdk/struct/tree/dfs';
import { ignoreCaseIncludes } from '@/js-sdk/struct/string/util';
import * as icons from '@ant-design/icons';

const { Link } = Typography;

export default () => {
  const [keyword, setKeyword] = useState<Perm>();
  const [expandedRowKeys, onExpandedRowsChange] = useState<readonly Key[]>([]);

  const perms = useQuery(
      ['perm-list'],
      () =>
        list({
          params: {
            skip: 0,
            limit: 0,
          },
        }),
      {
        refetchOnWindowFocus: false,
      },
    ),
    dataSource = perm2Tree(
      perms.data?.data?.filter((p) => keyword?.isMenu === void 0 || p.isMenu === keyword?.isMenu),
    );

  const editor = useModalForm();
  const [form] = Form.useForm();
  function switchHandler(p: Perm) {
    return async () => {
      try {
        await update({ ...p, isHide: !p.isHide });
        perms.refetch();
      } catch (e) {
        console.warn(e);
      }
    };
  }

  const columns: LightTableProColumnProps<Perm & { keyword?: string }>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      hideInSearch: true,
      copyable: true,
      width: 200,
      fixed: 'left',
      ellipsis: { padding: 17 },
    },
    {
      dataIndex: 'keyword',
      title: '关键字',
      hideInTable: true,
      fieldProps: { placeholder: '支持ID、名字、路由模糊搜索' },
      tooltip: '支持ID、名字、路由模糊搜索',
    },
    { dataIndex: 'isMenu', title: '是否菜单', valueEnum: MENU_TYPE_MAP, width: 75, fixed: 'left' },
    {
      dataIndex: 'isHide',
      title: '是否隐藏',
      hideInSearch: true,
      width: 75,
      fixed: 'left',
      render: (v, record) => (
        <Popconfirm
          title={!v ? '隐藏后将在菜单中不可见，路由依旧生效' : '开启后将在菜单中可见'}
          onConfirm={switchHandler(record)}
        >
          <Switch checked={v} />
        </Popconfirm>
      ),
    },
    {
      dataIndex: 'icon',
      title: 'icon',
      hideInSearch: true,
      width: 50,
      align: 'center',
      render: (text) => (text ? createElement((icons as any)[text]) : void 0),
    },
    { dataIndex: 'name', title: '权限名', hideInSearch: true, width: 150 },
    {
      dataIndex: 'pID',
      title: '父级菜单',
      hideInSearch: true,
      copyable: true,
      width: 200,
      ellipsis: { padding: 17, tooltip: true },
    },
    {
      dataIndex: 'url',
      title: 'url',
      hideInSearch: true,
      copyable: true,
      width: 200,
      ellipsis: { padding: 17, tooltip: true },
    },
    {
      dataIndex: 'createAt',
      title: '创建时间',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'updateAt',
      title: '更新时间',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'id',
      title: '操作',
      hideInSearch: true,
      width: 180,
      fixed: 'right',
      render: (id, row) => (
        <Space>
          {row.isMenu && <Link onClick={addSubMenu(row)}>添加子菜单</Link>}
          <Link onClick={edit(row)}>编辑</Link>
          <Popconfirm title="操作不可逆，请二次确认" onConfirm={remove(row)}>
            <Link>删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function create() {
    editor.setModalProps((pre) => ({ ...pre, visible: true, title: '新增' }));
  }

  function edit(row: Perm) {
    return () => {
      editor.setModalProps((pre) => ({ ...pre, visible: true, title: '编辑' }));
      editor.form.setFieldsValue(row);
    };
  }

  function addSubMenu(row: Perm) {
    return () => {
      editor.setModalProps((pre) => ({ ...pre, visible: true, title: '新增' }));
      editor.form.setFieldsValue({ pID: row.id, url: row.url });
      onExpandedRowsChange((pre) => pre.concat(row.id));
    };
  }

  function remove(row: Perm) {
    return async () => {
      try {
        await deleteOne(row.id, { notify: true });
        perms.refetch();
      } catch (e) {
        console.warn(e);
      }
    };
  }

  function editSuccess(res: { data: Key }) {
    perms.refetch();
  }

  function resetAndReload() {
    setKeyword(void 0);
  }

  const onFinish: FormProps<Perm & { keyword?: string }>['onFinish'] = (value) => {
    setKeyword(value);
    const { keyword } = value;
    if (keyword != void 0) {
      let matched: Key[] = [];
      dfs<Partial<PermOpt> & { children: PermOpt[] }>({ children: dataSource }, 'children', (t) => {
        if (
          (t?.url && ignoreCaseIncludes(t.url, keyword)) ||
          (t?.name && ignoreCaseIncludes(t.name?.toString(), keyword)) ||
          (t?.id && ignoreCaseIncludes(t.id, keyword))
        ) {
          matched = matched.concat(t?.genealogy as Key[]);
        }
        return false;
      });
      onExpandedRowsChange(matched);
    }
  };

  return (
    <>
      <Editor {...editor} onSuccess={editSuccess} />

      <div className={`${style.flex} ${style.column}`}>
        <Card>
          <Search
            columns={columns}
            formProps={{ form, onFinish: onFinish, onReset: resetAndReload }}
          />
        </Card>

        <Card>
          <div className={`${style.flex} ${style.column}`}>
            <div className={`${style.flex} ${style?.['space-between']}`}>
              <div>
                <Space>
                  <Button icon={<PlusOutlined />} type="primary" ghost onClick={create}>
                    新增
                  </Button>
                </Space>
              </div>
            </div>

            <LightTable<Perm>
              size="small"
              rowKey={'id'}
              columns={columns}
              scroll={{ x: 'max-content' }}
              sticky
              columnEmptyText="-"
              bordered
              loading={perms.isFetching}
              expandable={{ onExpandedRowsChange, expandedRowKeys }}
              dataSource={dataSource}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};
