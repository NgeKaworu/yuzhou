/*
 * @Date: 2024-10-31 16:46:23
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2024-11-06 15:48:42
 * @FilePath: /yuzhou/app/flashcard/src/pages/mgt/index.tsx
 */
import { RECORD_MODE, Record } from '@/models/record';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  ColProps,
  DatePicker,
  Drawer,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Popconfirm,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Spin,
  Switch,
  Table,
  TablePaginationConfig,
  TableProps,
  Typography,
} from 'antd';
import style from './index.module.less';
import { RangePickerProps } from 'antd/es/date-picker';
import clsx from 'clsx';

import dayjs, { Dayjs } from 'dayjs';
import { restful } from 'edk/src/utils/http';
import { Res } from 'edk/src/utils/http/type';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*
 * @Date: 2024-10-31 16:46:23
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2024-10-31 17:36:53
 * @FilePath: /yuzhou/app/flashcard/src/pages/mgt/index.tsx
 */

const baseColProps: ColProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 6,
};

type Sorter = {
  field: string;
  order: 'ascend' | 'descend';
};

const presets: RangePickerProps['presets'] = [
  {
    label: '本周',
    value: [
      dayjs().startOf('week').add(1, 'day'),
      dayjs().endOf('week').add(1, 'day'),
    ],
  },
  {
    label: '下周',
    value: [
      dayjs().add(1, 'week').startOf('week').add(1, 'day'),
      dayjs().add(1, 'week').endOf('week').add(1, 'day'),
    ],
  },
  {
    label: '今日',
    value: [dayjs().startOf('day'), dayjs().endOf('day')],
  },
  {
    label: '明日',
    value: [
      dayjs().add(1, 'day').startOf('day'),
      dayjs().add(1, 'day').endOf('day'),
    ],
  },
];

type inputType = '' | '新建' | '编辑';

const ua = navigator.userAgent?.toLowerCase();

export interface SearchRecord {
  cooldownAt?: [Dayjs, Dayjs];
  createAt?: [Dayjs, Dayjs];
  reviewAt?: [Dayjs, Dayjs];
  updateAt?: [Dayjs, Dayjs];
  exp?: number;
  inReview?: boolean;
  source?: string;
  translation?: string;
  tag?: string;
  mode?: RECORD_MODE;
  finished: boolean;
  planing: boolean;
}

export default () => {
  const [inputForm] = Form.useForm<Record>();
  const [multiEditForm] = Form.useForm();
  const history = useNavigate();

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [sorter, setSorter] = useState<Sorter>();

  const [search, setSearch] = useState<SearchRecord>();

  const [inputVisible, setInputVisible] = useState(false);
  const [inputType, setInputType] = useState<inputType>('新建');
  const [selectedItems, setSelectedItems] = useState<Map<string, Record>>(
      new Map(),
    ),
    selectedRowKeys = Array.from(selectedItems.keys());

  const queryClient = useQueryClient();

  const [multiEditorVisible, setMultiEditorVisible] = useState(false);

  // 编辑modal使用
  const [curRecord, setCurRecord] = useState<Record>();

  const querier = useQuery({
      queryKey: ['records-list', pagination, sorter, search],
      queryFn: () => {
        return restful.get<Res<Record[]>, Res<Record[]>>(
          `/flashcard/record/mgt/list`,
          {
            notify: 'fail',
            params: {
              skip: (pagination.current! - 1) * pagination.pageSize!,
              limit: pagination.pageSize,
              sort: sorter?.field ?? 'createAt',
              orderby: sorter?.order === 'ascend' ? 1 : -1,
              ...search,
            },
          },
        );
      },
    }),
    refetch = querier.refetch;

  const columns: TableProps<Record>['columns'] = [
    {
      dataIndex: 'exp',
      title: '熟练度',
      align: 'center',
      width: 75,
      fixed: 'left',
      sorter: true,
    },
    {
      dataIndex: 'inReview',
      title: '正在复习',
      render: (value) => (value ? '是' : '否'),
      align: 'center',
      width: 75,
      fixed: 'left',
    },
    {
      dataIndex: 'mode',
      title: '记忆模式',
      render: (value) => ['全文', '关键字'][value],
      align: 'center',
      width: 75,
      fixed: 'left',
    },
    {
      dataIndex: 'tag',
      title: '标签',
      ellipsis: { showTitle: true },
      width: 100,
      fixed: 'left',
    },
    {
      dataIndex: 'cooldownAt',
      title: '下次复习时间',
      render: (value) =>
        value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-',
      width: 112,
      sorter: true,
    },
    {
      dataIndex: 'reviewAt',
      title: '最后复习时间',
      render: (value) =>
        value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-',
      width: 112,
      sorter: true,
    },

    {
      dataIndex: 'translation',
      title: '译文',
      ellipsis: { showTitle: true },
      width: 300,
    },
    {
      dataIndex: 'source',
      title: '原文',
      ellipsis: { showTitle: true },
      width: 300,
    },
    {
      dataIndex: 'createAt',
      title: '创建时间',
      render: (value) =>
        value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-',
      width: 100,
      sorter: true,
    },
    {
      dataIndex: 'updateAt',
      title: '修改时间',
      render: (value) =>
        value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-',
      width: 100,
      sorter: true,
    },
    {
      dataIndex: '_id',
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (id, record) => (
        <Space>
          {record.inReview ? (
            <Button
              size="small"
              type="link"
              onClick={() => stopper.mutate([id])}
              loading={stopper.isPending}
            >
              停止复习
            </Button>
          ) : (
            <Button
              size="small"
              type="link"
              onClick={() => reviewer.mutate([id])}
              loading={reviewer.isPending}
            >
              加入复习
            </Button>
          )}
          <Button
            size="small"
            type="link"
            onClick={() => onItemEditClick(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="操作不可逆"
            onConfirm={() => onItemRemoveClick(id)}
          >
            <Button size="small" type="link" danger loading={remover.isPending}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const items: MenuProps['items'] = [
    '取消选择',
    '批量修改',
    '复习所选',
    '停止所选',
    '清空复习时间',
  ].map((i) => ({ label: i, key: i }));

  const creator = useMutation({
    mutationFn: (data: Record) =>
      restful.post(`/flashcard/record/create`, data),
    onSuccess() {
      refetch();
      inputForm.resetFields(['source', 'translation']);
    },
  });

  const updater = useMutation({
    mutationFn: (data?: { [key: string]: any }) =>
      restful.patch(`/flashcard/record/update`, {
        id: curRecord?._id,
        ...data,
      }),
    onSuccess() {
      refetch();
      inputForm.resetFields();
      setInputVisible(false);
    },
  });

  const multiUpdater = useMutation({
    mutationFn: (data?: { [key: string]: any }) =>
      restful.patch(`/flashcard/record/multi-update`, {
        ids: Array.from(selectedItems.keys()),
        ...data,
      }),
    onSuccess() {
      refetch();
      multiEditForm.resetFields();
      setMultiEditorVisible(false);
    },
  });

  const remover = useMutation({
    mutationFn: (data?: string) =>
      restful.delete(`/flashcard/record/remove/${data}`),
    onSuccess() {
      refetch();
    },
  });

  const reviewer = useMutation({
    mutationFn: (ids: string[]) =>
      restful.patch(`/flashcard/record/review`, { ids }),
    onSuccess() {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['review-list'] });
      history('/review/');
    },
  });

  const stopper = useMutation({
    mutationFn: (ids: string[]) =>
      restful.patch(`/flashcard/record/review/stop`, { ids }),
    onSuccess() {
      refetch();
    },
  });

  const cleaner = useMutation({
    mutationFn: (ids: string[]) =>
      restful.patch(`/flashcard/record/cooldownAt/clear`, { ids }),
    onSuccess() {
      refetch();
    },
  });

  function reviewHandler() {
    reviewer.mutate([...selectedItems.keys()]);
  }

  function stopHandler() {
    stopper.mutate([...selectedItems.keys()]);
  }

  function clearHandler() {
    cleaner.mutate([...selectedItems.keys()]);
  }

  function showInputModal(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    setInputType(e.currentTarget.dataset.inputType as inputType);
    setInputVisible(true);
    inputForm.resetFields();
    inputForm.setFieldValue('tag', querier?.data?.data?.[0]?.tag);
    const pre = localStorage.getItem('flashcard:record:input:form');
    if (pre) {
      inputForm.setFieldsValue(JSON.parse(pre));
    }
  }

  function showMultiEditor() {
    setMultiEditorVisible(true);
    multiEditForm.resetFields();
  }

  function hideInputModal() {
    setInputVisible(false);
  }

  function hideTimerContainer() {
    setMultiEditorVisible(false);
  }

  async function onInputSubmit() {
    const values = await inputForm.validateFields();
    switch (inputType) {
      case '新建':
        await creator.mutateAsync(values);
        break;
      case '编辑':
        await updater.mutateAsync(values);
        break;
      default:
        console.error('invalidate type:', inputType);
    }
    localStorage.removeItem('flashcard:record:input:form');
  }

  async function onMultiEditorSubmit() {
    const values = await multiEditForm.validateFields();
    await multiUpdater.mutateAsync(values);
  }

  function onItemClick(record: Record) {
    setSelectedItems((s) => {
      const tmp = new Map(s);
      const id = record._id;
      const checked = s.has(id);
      if (checked) {
        tmp.delete(id);
      } else {
        tmp.set(id, record);
      }
      return tmp;
    });
  }

  function onItemRemoveClick(id: string) {
    remover.mutate(id);
  }

  function onItemEditClick(record: Record) {
    inputForm.setFieldsValue({
      ...record,
      cooldownAt: record.cooldownAt && dayjs(record.cooldownAt),
    });
    setCurRecord(record);
    setInputType('编辑');
    setInputVisible(true);
  }

  function cancelAllSelect() {
    setSelectedItems(new Map());
  }

  function onHotKey({ key, metaKey, ctrlKey, altKey }: React.KeyboardEvent) {
    if (key === 'Enter') {
      if (
        (ua?.includes('windows') && ctrlKey) ||
        (ua?.includes('mac') && metaKey)
      ) {
        onInputSubmit();
      }
    }

    if (key === 'r') {
      if (
        (ua?.includes('windows') && altKey) ||
        (ua?.includes('mac') && ctrlKey)
      ) {
        inputForm.resetFields(['source', 'translation']);
      }
    }
  }

  return (
    <>
      <Card>
        <Space direction="vertical" style={{ display: 'flex' }} size="large">
          <Card>
            <Form<SearchRecord>
              onFinish={setSearch}
              layout="inline"
              initialValues={{ planing: false, finished: false }}
              labelCol={{ span: 6 }}
              wrapperCol={{
                span: 18,
              }}
            >
              <Row wrap gutter={[16, 16]}>
                <Col {...baseColProps}>
                  <Form.Item
                    name="planing"
                    label="有计划"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="有计划"
                      unCheckedChildren="无计划"
                    />
                  </Form.Item>
                </Col>

                <Form.Item noStyle dependencies={['planing']}>
                  {({ getFieldValue }) =>
                    getFieldValue(['planing']) && (
                      <Col {...baseColProps}>
                        <Form.Item name="cooldownAt" label="下次复习时间">
                          <DatePicker.RangePicker
                            presets={presets}
                            showTime
                            style={{ display: 'flex' }}
                          />
                        </Form.Item>
                      </Col>
                    )
                  }
                </Form.Item>
                <Col {...baseColProps}>
                  <Form.Item name="reviewAt" label="最后复习时间">
                    <DatePicker.RangePicker
                      presets={presets}
                      showTime
                      style={{ display: 'flex' }}
                    />
                  </Form.Item>
                </Col>
                <Col {...baseColProps}>
                  <Form.Item name="createAt" label="创建时间">
                    <DatePicker.RangePicker
                      presets={presets}
                      showTime
                      style={{ display: 'flex' }}
                    />
                  </Form.Item>
                </Col>
                <Col {...baseColProps}>
                  <Form.Item name="updateAt" label="修改时间">
                    <DatePicker.RangePicker
                      presets={presets}
                      showTime
                      style={{ display: 'flex' }}
                    />
                  </Form.Item>
                </Col>
                <Col {...baseColProps}>
                  <Form.Item
                    name="finished"
                    label="已完成"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="已完成"
                      unCheckedChildren="未完成"
                    />
                  </Form.Item>
                </Col>

                <Form.Item noStyle dependencies={['finished']}>
                  {({ getFieldValue }) =>
                    !getFieldValue(['finished']) && (
                      <Col {...baseColProps}>
                        <Form.Item name="exp" label="熟练度">
                          <Select
                            placeholder="请选择熟练度"
                            allowClear
                            options={Array(11)
                              .fill(Object.create(null))
                              .map((_, i) => ({
                                label: `${i * 10}%`,
                                value: i * 10,
                              }))}
                          />
                        </Form.Item>
                      </Col>
                    )
                  }
                </Form.Item>
                <Col {...baseColProps}>
                  <Form.Item name="tag" label="标签关键字">
                    <Input allowClear placeholder="请输入标签关键字" />
                  </Form.Item>
                </Col>
                <Col {...baseColProps}>
                  <Form.Item name="translation" label="译文关键字">
                    <Input allowClear placeholder="请输入译文关键字" />
                  </Form.Item>
                </Col>

                <Col {...baseColProps}>
                  <Form.Item name="source" label="原文关键字">
                    <Input allowClear placeholder="请输入原文关键字" />
                  </Form.Item>
                </Col>

                <Col {...baseColProps}>
                  <Form.Item name="inReview" label="正在复习">
                    <Radio.Group
                      optionType="button"
                      options={[
                        { value: true, label: '是' },
                        { value: false, label: '否' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col {...baseColProps}>
                  <Form.Item
                    name="mode"
                    label="记忆模式"
                    tooltip={
                      <>
                        全文背诵或
                        <br />
                        关键字填空
                      </>
                    }
                  >
                    <Radio.Group
                      optionType="button"
                      options={[
                        { value: RECORD_MODE.KEYWORD, label: '关键字' },
                        { value: RECORD_MODE.FULL, label: '全文' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col {...baseColProps} flex={1} style={{ maxWidth: 'unset' }}>
                  <Form.Item wrapperCol={{ offset: 6 }}>
                    <Space style={{ display: 'flex', justifyContent: 'end' }}>
                      <Button htmlType="submit">查询</Button>
                      <Button type="link" onClick={() => querier.refetch()}>
                        刷新
                      </Button>

                      <Button htmlType="reset" type="link" danger>
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card
            title={`共选中${selectedItems.size}条记录`}
            extra={
              <Space size="large">
                <Button
                  type="primary"
                  onClick={showInputModal}
                  data-input-type="新建"
                >
                  新增
                </Button>
                <Dropdown
                  disabled={!selectedItems.size}
                  menu={{
                    items,
                    onClick: ({ key }) => {
                      switch (key) {
                        case '取消选择':
                          cancelAllSelect();
                          break;
                        case '批量修改':
                          showMultiEditor();
                          break;
                        case '复习所选':
                          reviewHandler();
                          break;
                        case '停止所选':
                          stopHandler();
                          break;
                        case '清空复习时间':
                          clearHandler();
                          break;
                      }
                    },
                  }}
                >
                  <Typography.Link>
                    <Space>
                      批量操作
                      <DownOutlined />
                    </Space>
                  </Typography.Link>
                </Dropdown>
              </Space>
            }
          >
            <Table<Record>
              rowSelection={{
                selections: true,
                selectedRowKeys,
                onChange: (_, _selectRows) =>
                  setSelectedItems(
                    new Map(_selectRows?.map((r) => [r._id, r])),
                  ),
              }}
              rowKey="_id"
              columns={columns}
              dataSource={querier?.data?.data}
              scroll={{ x: 1920 }}
              onChange={(_pagination, _, _sorter) => {
                setSorter(_sorter as Sorter);
                setPagination(_pagination);
                cancelAllSelect();
              }}
              loading={querier.isLoading || querier.isFetching}
              pagination={{
                ...pagination,
                total: querier?.data?.total,
                showTotal: (total) => `共 ${total} 条`,
                showSizeChanger: true,
              }}
            />
          </Card>
        </Space>
      </Card>
      <Drawer
        title={inputType}
        open={inputVisible}
        onClose={hideInputModal}
        placement="bottom"
        height={'80vh'}
        extra={
          <Space>
            <Button onClick={hideInputModal}>取消</Button>
            <Button
              onClick={onInputSubmit}
              type="primary"
              loading={creator?.isPending || updater?.isPending}
            >
              提交
            </Button>
          </Space>
        }
      >
        <Spin spinning={creator?.isPending || updater?.isPending}>
          <Form<Record>
            form={inputForm}
            onFinish={onInputSubmit}
            layout="vertical"
            initialValues={{ mode: RECORD_MODE.KEYWORD }}
            onValuesChange={(_, data) =>
              localStorage?.setItem(
                'flashcard:record:input:form',
                JSON.stringify(data),
              )
            }
          >
            <Form.Item name="tag" label="标签">
              <Input />
            </Form.Item>

            <Form.Item name="cooldownAt" label="下次复习时间">
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>

            <Form.Item
              name="mode"
              label="模式"
              rules={[{ required: true }]}
              tooltip={
                <>
                  全文背诵或
                  <br />
                  关键字填空
                </>
              }
            >
              <Radio.Group
                optionType="button"
                options={[
                  { value: RECORD_MODE.KEYWORD, label: '关键字' },
                  { value: RECORD_MODE.FULL, label: '全文' },
                ]}
              />
            </Form.Item>

            <Form.Item name="source" label="原文" rules={[{ required: true }]}>
              <Input.TextArea
                autoSize
                autoFocus
                allowClear
                onKeyDown={onHotKey}
              />
            </Form.Item>

            <Form.Item<Record>
              shouldUpdate={(pre, next) => pre.mode !== next.mode}
            >
              {({ getFieldValue }) => (
                <Form.Item
                  name="translation"
                  label={
                    getFieldValue('mode') === RECORD_MODE.FULL
                      ? '全文'
                      : '关键字'
                  }
                  rules={[{ required: true }]}
                >
                  <Input.TextArea autoSize allowClear onKeyDown={onHotKey} />
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item<Record> name="exp" label="熟练度">
              <Slider step={10} dots marks={{ 0: '陌生', 100: '记得' }} />
            </Form.Item>

            <Form.Item hidden>
              <Button
                htmlType="submit"
                loading={creator?.isPending || updater?.isPending}
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Drawer>

      <Drawer
        title="批量编辑"
        open={multiEditorVisible}
        onClose={hideTimerContainer}
        placement="bottom"
        height={'80vh'}
        extra={
          <Space>
            <Button onClick={hideTimerContainer}>取消</Button>
            <Button
              onClick={onMultiEditorSubmit}
              type="primary"
              loading={multiUpdater?.isPending}
            >
              提交
            </Button>
          </Space>
        }
      >
        <Spin spinning={multiUpdater?.isPending}>
          <Form<Record>
            form={multiEditForm}
            onFinish={onMultiEditorSubmit}
            layout="vertical"
          >
            <Form.Item name="tag" label="标签">
              <Input />
            </Form.Item>

            <Form.Item name="cooldownAt" label="下次复习时间">
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>

            <Form.Item
              name="mode"
              label="模式"
              tooltip={
                <>
                  全文背诵或
                  <br />
                  关键字填空
                </>
              }
            >
              <Radio.Group
                optionType="button"
                options={[
                  { value: RECORD_MODE.KEYWORD, label: '关键字' },
                  { value: RECORD_MODE.FULL, label: '全文' },
                ]}
              />
            </Form.Item>

            <Form.Item name="inReview" label="正在复习">
              <Radio.Group
                optionType="button"
                options={[
                  { value: true, label: '是' },
                  { value: false, label: '否' },
                ]}
              />
            </Form.Item>

            <Form.Item<Record> name="exp" label="熟练度">
              <Slider step={10} dots marks={{ 0: '陌生', 100: '记得' }} />
            </Form.Item>

            <Form.Item hidden>
              <Button htmlType="submit" loading={multiUpdater?.isPending}>
                提交
              </Button>
            </Form.Item>
          </Form>
          影响记录数：{selectedItems.size}
          {Array.from(selectedItems.values())?.map((record) => (
            <div key={record._id} className={clsx(style.flex)}>
              {record.source}{' '}
              {selectedItems.size > 1 && (
                <CloseOutlined onClick={() => onItemClick(record)} />
              )}
            </div>
          ))}
        </Spin>
      </Drawer>
    </>
  );
};
