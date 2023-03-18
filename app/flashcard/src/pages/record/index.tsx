/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 10:04:53
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-19 01:00:11
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
  Space,
  Modal,
  Form,
  Radio,
  MenuProps,
  List,
  ListProps,
  theme,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { restful } from 'edk/src/utils/http';
import { Res } from 'edk/src/utils/http/type';

import RecordItem from './components/RecordItem';

import { Record } from '@/models/record';
import classNames from 'classnames';
import { prefixCls } from '@/theme';

type inputType = '' | '新建' | '编辑';

const limit = 15;

export default () => {
  const [sortForm] = Form.useForm();
  const [inputForm] = Form.useForm();
  const history = useNavigate();
  const _location = useLocation();
  const _search = _location.search;
  const params = new URLSearchParams(_search);
  const selectedKeys = [params.get('type') || 'all'];

  const [sortVisable, setSortVisable] = useState(false);
  const [inputVisable, setInputVisable] = useState(false);
  const [inputType, setInputType] = useState<inputType>('新建');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // 编辑modal使用
  const [curRecrod, setCurRecord] = useState<Record>();

  // 【自定义】制造样式
  const { hashId } = theme.useToken();

  useEffect(() => {
    const params = new URLSearchParams(_search);
    sortForm.setFieldsValue(Object.fromEntries(params.entries()));
  }, [_search]);

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['records-list', _search],
    ({ pageParam = 0 }) => {
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
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage?.data?.length === limit ? pages?.length : undefined;
      },
    },
  );

  const dataSource = data?.pages,
    pages = dataSource?.reduce(
      (acc: any, cur: any) => acc.concat(cur?.data),
      [],
    ) as any[],
    total = dataSource?.[dataSource?.length - 1]?.total || 0;

  const creator = useMutation(
    (data) => restful.post(`/flashcard/record/create`, data),
    {
      onSuccess() {
        queryClient.invalidateQueries(['records-list']);
        inputForm.resetFields();
        setInputVisable(false);
      },
    },
  );

  const updater = useMutation(
    (data?: { [key: string]: any }) =>
      restful.patch(`/flashcard/record/update`, {
        id: curRecrod?._id,
        ...data,
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries(['records-list']);
        inputForm.resetFields();
        setInputVisable(false);
      },
    },
  );

  const deleter = useMutation(
    (data?: string) => restful.delete(`/flashcard/record/remove/${data}`),
    {
      onSuccess() {
        queryClient.invalidateQueries(['records-list']);
      },
    },
  );

  const reviewer = useMutation(
    (ids: string[]) => restful.patch(`/flashcard/record/review`, { ids }),
    {
      onSuccess() {
        queryClient.invalidateQueries(['records-list']);
        queryClient.invalidateQueries(['review-list']);
        history('/review/');
      },
    },
  );

  const randomReviewer = useMutation(
    (data) => restful.patch(`/flashcard/record/random-review`, data),
    {
      onSuccess() {
        queryClient.invalidateQueries(['records-list']);
        queryClient.invalidateQueries(['review-list']);
        history('/review/');
      },
    },
  );

  const allReviewer = useMutation(
    (data) => restful.get(`/flashcard/record/review-all`),
    {
      onSuccess() {
        queryClient.invalidateQueries(['records-list']);
        queryClient.invalidateQueries(['review-list']);
        history('/review/');
      },
    },
  );

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
    setSortVisable(true);
  }

  function hideSortModal() {
    setSortVisable(false);
  }

  function onSortSubmit() {
    sortForm.validateFields().then(({ sort, orderby }) => {
      params.set('sort', sort);
      params.set('orderby', orderby);
      history({
        pathname: _location.pathname,
        search: params.toString(),
      });
      setSortVisable(false);
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
    setSortVisable(false);
  }

  function showInpurModal(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    setInputType(e.currentTarget.dataset.inputType as inputType);
    setInputVisable(true);
  }

  function hideInputModal() {
    setInputVisable(false);
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
    deleter.mutate(id);
  }

  function onItemEditClick(record: Record) {
    inputForm.setFieldsValue(record);
    setCurRecord(record);
    setInputType('编辑');
    setInputVisable(true);
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
      <List.Item key={record?._id} style={{ padding: `2px 4px` }}>
        <RecordItem
          record={record}
          selected={selected}
          onClick={onItemClick}
          onEditClick={onItemEditClick}
          onSyncClick={(e) => {
            e.stopPropagation();
          }}
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
          <Modal
            open={sortVisable}
            title="排序"
            onCancel={hideSortModal}
            onOk={onSortSubmit}
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
              <Form.Item>
                <Button style={{ opacity: 0 }} htmlType="submit">
                  提交
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="dashed" danger onClick={onSortCancel}>
                  取消排序
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </header>
      <main className={classNames(`${prefixCls}-content`, hashId)}>
        {pages?.length ? (
          <List
            size="small"
            dataSource={pages}
            style={{ background: '#f0f2f5' }}
            renderItem={renderItem}
            loading={isFetching}
            loadMore={loadMore}
          />
        ) : (
          <Empty className={classNames(`${prefixCls}-empty`, hashId)} />
        )}
      </main>
      <footer>
        <div className={classNames(`${prefixCls}-content-footer`, hashId)}>
          <Space style={{ marginRight: '12px' }}>
            {selectedItems.length}/{total}
            <Button size="small" type="dashed" onClick={cancelAllSelect}>
              取消选择
            </Button>
            {/* <Button
          size='small' danger>删除所选</Button> */}
          </Space>
          <Space>
            <Button
              size="small"
              type="primary"
              disabled={!selectedItems.length}
              onClick={reviewHandler}
            >
              复习所选
            </Button>
            <Button size="small" type="primary" onClick={randomReviewHandler}>
              随机复习
            </Button>
            <Button size="small" type="primary" onClick={reviewAllHandler}>
              复习全部
            </Button>
            <Button
              size="small"
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={showInpurModal}
              data-input-type="新建"
            />
          </Space>
        </div>
      </footer>
      <Modal
        title={inputType}
        open={inputVisable}
        onCancel={hideInputModal}
        onOk={onInputSubmit}
      >
        <Form form={inputForm} onFinish={onInputSubmit}>
          <Form.Item name="source" label="原文" rules={[{ required: true }]}>
            <Input.TextArea autoSize allowClear />
          </Form.Item>
          <Form.Item
            name="translation"
            label="译文"
            rules={[{ required: true }]}
          >
            <Input.TextArea autoSize allowClear />
          </Form.Item>
          <Form.Item>
            <Button style={{ opacity: 0 }} htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};
