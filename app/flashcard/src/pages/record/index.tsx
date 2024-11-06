/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 10:04:53
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2024-11-06 15:43:01
 * @FilePath: /yuzhou/app/flashcard/src/pages/record/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Button,
  DatePicker,
  Drawer,
  Empty,
  FloatButton,
  Form,
  Input,
  List,
  ListProps,
  Menu,
  MenuProps,
  Radio,
  Slider,
  Space,
  Spin,
  theme,
} from 'antd';

import {
  CloseOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { restful } from 'edk/src/utils/http';
import { Res } from 'edk/src/utils/http/type';

import RecordItem from './components/RecordItem';

import { RECORD_MODE, Record } from '@/models/record';
import { prefixCls } from '@/theme';
import clsx from 'clsx';
import dayjs from 'dayjs';
import style from './index.module.less';

type inputType = '' | '新建' | '编辑';

const limit = 15;

const ua = navigator.userAgent?.toLowerCase();

export default () => {
  const [sortForm] = Form.useForm();
  const [inputForm] = Form.useForm<Record>();
  const [multiEditForm] = Form.useForm();
  const history = useNavigate();
  const _location = useLocation();
  const _search = _location.search;
  const params = new URLSearchParams(_search);
  const selectedKeys = [params.get('type') || 'all'];

  const [sortVisible, setSortVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputType, setInputType] = useState<inputType>('新建');
  const [selectedItems, setSelectedItems] = useState<Map<string, Record>>(
    new Map(),
  );

  const [multiEditorVisible, setMultiEditorVisible] = useState(false);

  // 编辑modal使用
  const [curRecord, setCurRecord] = useState<Record>();

  // 【自定义】制造样式
  const { hashId } = theme.useToken();

  useEffect(() => {
    const params = new URLSearchParams(_search);
    sortForm.setFieldsValue(Object.fromEntries(params.entries()));
  }, [_search]);

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching, refetch } =
    useInfiniteQuery({
      queryKey: ['records-list', _search],
      queryFn: ({ pageParam = 0 }) => {
        const params: { [key: string]: string | number } = Object.fromEntries(
          new URLSearchParams(_search),
        );
        return restful.get<Res<Record[]>, Res<Record[]>>(
          `/flashcard/record/list`,
          {
            notify: 'fail',
            params: {
              ...params,
              skip: pageParam * limit,
              limit,
            },
          },
        );
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
        return lastPage?.data?.length === limit ? pages?.length : undefined;
      },
    });

  const dataSource = data?.pages,
    pages = dataSource?.reduce(
      (acc: any, cur: any) => acc.concat(cur?.data),
      [],
    ) as Record[],
    total = dataSource?.[dataSource?.length - 1]?.total || 0;

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

  const allReviewer = useMutation({
    mutationFn: (data) => restful.get(`/flashcard/record/review-all`),
    onSuccess() {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['review-list'] });
      history('/review/');
    },
  });

  function reviewHandler() {
    reviewer.mutate([...selectedItems.keys()]);
  }

  function stopHandler() {
    stopper.mutate([...selectedItems.keys()]);
  }

  function reviewAllHandler() {
    allReviewer.mutate();
  }

  const onMenuSelect: MenuProps['onSelect'] = ({ key }) => {
    if (key !== 'all') {
      params.set('type', `${key}`);
    } else {
      params.delete('type');
    }
    history({
      pathname: _location.pathname,
      search: params.toString(),
    });
    cancelAllSelect();
  };

  function showSortModal() {
    setSortVisible(true);
  }

  function hideSortModal() {
    setSortVisible(false);
  }

  function onSortSubmit() {
    sortForm.validateFields().then(({ sort, orderby }) => {
      params.set('sort', sort);
      params.set('orderby', orderby);
      history({
        pathname: _location.pathname,
        search: params.toString(),
      });
      setSortVisible(false);
    });
  }

  function onSortCancel() {
    params.delete('sort');
    params.delete('orderby');
    history({
      pathname: _location.pathname,
      search: params.toString(),
    });
    sortForm.resetFields();
    setSortVisible(false);
  }

  function showInputModal(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    setInputType(e.currentTarget.dataset.inputType as inputType);
    setInputVisible(true);
    inputForm.resetFields();
    inputForm.setFieldValue('tag', pages?.[0]?.tag);
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
  const loadMoreItems = () =>
    isFetching ? Promise.resolve() : fetchNextPage();

  // Render an item or a loading indicator.
  const renderItem: ListProps<Record>['renderItem'] = (record) => {
    const selected = selectedItems.has(record?._id);
    return (
      <List.Item key={record?._id} style={{ padding: `8px 6px` }}>
        <RecordItem
          record={record}
          selected={selected}
          onClick={() => onItemClick(record)}
          onReviewClick={(id) => reviewer.mutate([id])}
          onStopClick={(id) => stopper.mutate([id])}
          onEditClick={onItemEditClick}
          onRemoveClick={onItemRemoveClick}
        />
      </List.Item>
    );
  };

  const loadMore = !isFetching ? (
    <div
      style={{
        textAlign: 'center',
        margin: '12px auto',
        height: 32,
        lineHeight: '32px',
      }}
    >
      {hasNextPage ? (
        <Button onClick={loadMoreItems}>加载更多...</Button>
      ) : (
        '没有更多了'
      )}
    </div>
  ) : null;

  const items: MenuProps['items'] = [
    { key: 'store', label: '单词库' },
    { key: 'enable', label: '可复习' },
    { key: 'cooling', label: '冷却中' },
    { key: 'done', label: '己完成' },
    { key: 'all', label: '全部' },
  ];

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
    <section>
      <header style={{ height: 24 }}>
        <div className={clsx(`${prefixCls}-header`, hashId)}>
          <Menu
            className={clsx(`${prefixCls}-menu`, hashId)}
            mode="horizontal"
            onSelect={onMenuSelect}
            selectedKeys={selectedKeys}
            items={items}
          />
          <Button type="link" size="small" onClick={showSortModal}>
            排序
          </Button>
          <Drawer
            open={sortVisible}
            title="排序"
            onClose={hideSortModal}
            width={'80vw'}
            extra={
              <Space>
                <Button onClick={hideSortModal}>取消</Button>
                <Button onClick={onSortSubmit} type="primary">
                  确定
                </Button>
              </Space>
            }
          >
            <Form onFinish={onSortSubmit} form={sortForm}>
              <Form.Item
                name="sort"
                label="排序关键字"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio.Button value="reviewAt">复习时间</Radio.Button>
                  <Radio.Button value="createAt">添加时间</Radio.Button>
                  <Radio.Button value="exp">熟练度</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="orderby"
                label="排序方向"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio.Button value="1">升序</Radio.Button>
                  <Radio.Button value="-1">降序</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item hidden>
                <Button htmlType="submit">提交</Button>
              </Form.Item>
              <Form.Item>
                <Button type="dashed" danger onClick={onSortCancel}>
                  取消排序
                </Button>
              </Form.Item>
            </Form>
          </Drawer>
        </div>
      </header>
      <main className={clsx(`${prefixCls}-content`, hashId)}>
        {pages?.length ? (
          <List
            size="small"
            dataSource={pages}
            style={{ background: '#f0f2f5', minHeight: '100vh' }}
            renderItem={renderItem}
            loading={isFetching}
            loadMore={loadMore}
          />
        ) : (
          <Empty className={clsx(`${prefixCls}-empty`, hashId)} />
        )}
      </main>

      <FloatButton.BackTop
        style={{ right: 12, bottom: 48 + 8 + 40 + 8 + 40 + 8 + 40 }}
      />

      <FloatButton.Group
        shape="circle"
        trigger="hover"
        style={{ right: 12, bottom: 48 + 8 + 40 + 8 + 40 }}
        icon={<EllipsisOutlined />}
        // closeIcon={null}
        // description={'批量操作'}
        badge={{
          count: `${selectedItems.size}/${total}`,
          size: 'small',
          offset: [20, 0],
        }}
      >
        {selectedItems.size ? (
          <>
            {/* <FloatButton description="删除所选" /> */}
            <FloatButton description="取消选择" onClick={cancelAllSelect} />
            <FloatButton onClick={reviewHandler} description="复习所选" />
            <FloatButton onClick={stopHandler} description="停止所选" />
            <FloatButton onClick={showMultiEditor} description="批量修改" />
          </>
        ) : (
          <></>
        )}
      </FloatButton.Group>

      <FloatButton
        style={{ right: 12, bottom: 48 + 8 + 40 }}
        description="复习全部"
        type="primary"
        onClick={reviewAllHandler}
      />

      <FloatButton
        style={{ right: 12, bottom: 48 }}
        icon={<PlusOutlined />}
        type="primary"
        onClick={showInputModal}
        data-input-type="新建"
      />

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
    </section>
  );
};
