/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 10:04:53
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-11-04 17:50:50
 * @FilePath: /yuzhou/app/flashcard/src/pages/record/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';

import {
  Empty,
  Input,
  Button,
  Menu,
  Form,
  Radio,
  MenuProps,
  List,
  ListProps,
  theme,
  FloatButton,
  Drawer,
  Space,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { restful } from 'edk/src/utils/http';
import { Res } from 'edk/src/utils/http/type';

import RecordItem from './components/RecordItem';

import { RECORD_MODE, Record } from '@/models/record';
import classNames from 'classnames';
import { prefixCls } from '@/theme';

type inputType = '' | '新建' | '编辑';

const limit = 15;

const ua = navigator.userAgent?.toLowerCase();

export default () => {
  const [sortForm] = Form.useForm();
  const [inputForm] = Form.useForm<Record>();
  const history = useNavigate();
  const _location = useLocation();
  const _search = _location.search;
  const params = new URLSearchParams(_search);
  const selectedKeys = [params.get('type') || 'all'];

  const [sortVisible, setSortVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputType, setInputType] = useState<inputType>('新建');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

  const randomReviewer = useMutation({
    mutationFn: (data) =>
      restful.patch(`/flashcard/record/random-review`, data),
    onSuccess() {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['review-list'] });
      history('/review/');
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
    reviewer.mutate(selectedItems);
  }
  function randomReviewHandler() {
    randomReviewer.mutate();
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
  }

  function hideInputModal() {
    setInputVisible(false);
  }

  function onInputSubmit() {
    inputForm.validateFields().then((values) => {
      switch (inputType) {
        case '新建':
          creator.mutate(values);
          break;
        case '编辑':
          updater.mutate(values);
          break;
        default:
          console.error('invalidate type:', inputType);
      }
    });
  }

  function onItemClick(id: string) {
    setSelectedItems((s) => {
      const checked = s.some((i) => i === id);
      return checked ? s.filter((i) => i !== id) : s.concat(id);
    });
  }

  function onItemRemoveClick(id: string) {
    remover.mutate(id);
  }

  function onItemEditClick(record: Record) {
    inputForm.setFieldsValue(record);
    setCurRecord(record);
    setInputType('编辑');
    setInputVisible(true);
  }

  function cancelAllSelect() {
    setSelectedItems([]);
  }
  const loadMoreItems = () =>
    isFetching ? Promise.resolve() : fetchNextPage();

  // Render an item or a loading indicator.
  const renderItem: ListProps<Record>['renderItem'] = (record) => {
    const selected = selectedItems.some((s) => s === record?._id);
    return (
      <List.Item key={record?._id} style={{ padding: `8px 6px` }}>
        <RecordItem
          record={record}
          selected={selected}
          onClick={onItemClick}
          onDoubleClick={(id) => reviewer.mutate([id])}
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
        <div className={classNames(`${prefixCls}-header`, hashId)}>
          <Menu
            className={classNames(`${prefixCls}-menu`, hashId)}
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
      <main className={classNames(`${prefixCls}-content`, hashId)}>
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
          <Empty className={classNames(`${prefixCls}-empty`, hashId)} />
        )}
      </main>

      <FloatButton.BackTop
        style={{ right: 12, bottom: 48 + 8 + 40 + 8 + 40 + 8 + 40 }}
      />

      <FloatButton.Group
        shape="circle"
        trigger="hover"
        style={{ right: 12, bottom: 48 + 8 + 40 + 8 + 40 }}
        icon={null}
        closeIcon={null}
        description={'批量操作'}
        badge={{
          count: `${selectedItems.length}/${total}`,
          size: 'small',
          offset: [20, 0],
        }}
      >
        {/* <FloatButton description="删除所选" /> */}
        <FloatButton description="随机复习" onClick={randomReviewHandler} />
        <FloatButton description="取消选择" onClick={cancelAllSelect} />
        <FloatButton onClick={reviewHandler} description="复习所选" />
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
            <Button onClick={onInputSubmit} type="primary">
              提交
            </Button>
          </Space>
        }
      >
        <Form<Record>
          form={inputForm}
          onFinish={onInputSubmit}
          layout="vertical"
          initialValues={{ mode: RECORD_MODE.KEYWORD }}
        >
          <Form.Item name="tag" label="标签">
            <Input />
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
            <Input.TextArea autoSize allowClear onKeyDown={onHotKey} />
          </Form.Item>

          <Form.Item<Record>
            shouldUpdate={(pre, next) => pre.mode !== next.mode}
          >
            {({ getFieldValue }) => (
              <Form.Item
                name="translation"
                label={
                  getFieldValue('mode') === RECORD_MODE.FULL ? '全文' : '关键字'
                }
                rules={[{ required: true }]}
              >
                <Input.TextArea autoSize allowClear onKeyDown={onHotKey} />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item hidden>
            <Button htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Drawer>
    </section>
  );
};
