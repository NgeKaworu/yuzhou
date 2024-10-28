import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { Button, Empty, Form, Input, Tag, theme, List, ListProps } from 'antd';

import TagMgt from '@/components/TagMgt';

import type { RecordSchema } from '@/pages/record/models';
import type { TagSchema } from '@/components/TagMgt/models';

import { nsFormat } from '@/utils/goTime';

import dayjs from 'dayjs';

import useTagList from '@/components/TagMgt/hooks/useTagList';
import { add, update, page } from './services';

import isValidValue from 'edk/src/utils/isValidValue';

import classNames from 'classnames';
import { prefixCls } from '@/theme';

const { useToken } = theme;

export default () => {
  const [form] = Form.useForm();
  const { data: tagsList, isFetching: loading } = useTagList(),
    tags = tagsList?.data;

  const [curId, setCurId] = useState(''),
    isEdit = isValidValue(curId);

  const queryClient = useQueryClient();

  const { hashId } = useToken();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['records'],
    queryFn: ({ pageParam = 0 }) => {
      return page<
        { data: RecordSchema[]; total: number },
        { data: RecordSchema[]; total: number },
        any
      >({
        params: {
          skip: pageParam * 10,
          limit: 10,
        },
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.data?.length === 10 ? pages?.length : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const list = data?.pages,
    pages = list?.reduce((acc: RecordSchema[], cur) => acc.concat(cur?.data), []);

  async function submit(values: any) {
    try {
      if (isEdit) {
        await update({ ...values, id: curId });
        setCurId('');
      } else {
        await add(values);
      }

      queryClient.invalidateQueries({ queryKey: ['records'] });
      form.resetFields();
    } catch (e) {
      console.error('create err: ', e);
    }
  }

  async function checked(record: RecordSchema) {
    form.setFieldsValue(record);
    setCurId(record.id);
  }

  function cancel() {
    form.resetFields();
    setCurId('');
  }

  // react-window-infinite
  // const length = pages?.length || 0;
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  // const itemCount = hasNextPage ? length + 1 : length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = () => (isFetching ? Promise.resolve() : fetchNextPage());

  // Render an item or a loading indicator.
  const renderItem: ListProps<RecordSchema>['renderItem'] = (record) => {
    return (
      <div
        key={record.id}
        onClick={() => checked(record)}
        className={classNames(
          classNames(`${prefixCls}-record-item`, hashId),
          record.id === curId && classNames(`${prefixCls}-active`, hashId),
        )}
      >
        <h3 style={{ color: '#333' }}>{dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</h3>
        <div className={classNames(`${prefixCls}-content`, hashId)}>
          <div className={classNames(`${prefixCls}-main`, hashId)}>{record.event}</div>
          <div className={classNames(`${prefixCls}-extra`, hashId)}>
            {nsFormat(record.deration)}
          </div>
        </div>
        <div>
          {record?.tid?.map((oid: string) => {
            const findTag = tags?.find((t: TagSchema) => t.id === oid);

            return (
              <Tag key={oid} color={findTag?.color}>
                {findTag?.name}
              </Tag>
            );
          })}
        </div>
      </div>
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
      {hasNextPage ? <Button onClick={loadMoreItems}>加载更多...</Button> : '没有更多了'}
    </div>
  ) : null;

  return (
    <div className={classNames(`${prefixCls}-bottom-fix-panel`, hashId)}>
      <div style={{ flex: 1, overflowY: 'scroll' }}>
        {pages?.length ? (
          <List
            dataSource={pages}
            itemLayout="vertical"
            renderItem={renderItem}
            loading={isFetching}
            loadMore={loadMore}
          />
        ) : (
          <Empty className={classNames(`${prefixCls}-empty`, hashId)} />
        )}
      </div>

      <Form onFinish={submit} form={form}>
        <div
          className={classNames(`${prefixCls}-bottom-fix-panel`, hashId)}
          style={{
            height: '25vh',
            borderTop: '1px solid rgba(233,233,233, 05)',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)',
          }}
        >
          <section
            className={classNames(`${prefixCls}-fill-scroll-part`, hashId)}
            style={{
              padding: '0 0 6px 6px',
            }}
          >
            <Form.Item
              style={{ marginBottom: 0 }}
              name="tid"
              rules={[
                { required: true, message: '请选一个标签' },
                { type: 'array', min: 0, message: '请选一个标签' },
              ]}
            >
              <TagMgt />
            </Form.Item>
          </section>

          <Input.Group compact style={{ display: 'flex' }}>
            <Form.Item
              style={{
                marginBottom: 0,
                flex: 1,
              }}
              name="event"
            >
              <Input placeholder="请记录做了什么" allowClear autoComplete="off"></Input>
            </Form.Item>
            <Button onClick={cancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {curId ? '修改' : '记录'}
            </Button>
          </Input.Group>
        </div>
      </Form>
    </div>
  );
};
