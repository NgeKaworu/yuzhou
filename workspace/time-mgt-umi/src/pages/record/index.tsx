import React, { useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';

import { Button, Card, Empty, Form, Input, Skeleton, Tag } from 'antd';

import TagMgt from '@/components/TagMgt';

import type { RecordSchema } from '@/pages/record/models';
import type { TagSchema } from '@/components/TagMgt/models';

import { nsFormat } from '@/utils/goTime';

import moment from 'moment';

import useTagList from '@/components/TagMgt/hooks/useTagList';
import { add, update, page } from './services';

import { WindowScroller, List, InfiniteLoader, ListProps } from 'react-virtualized';
import isValidValue from '@/js-sdk/utils/isValidValue';

import layoutStyles from '@/layouts/index.less';
import styles from '@/index.less';

export default () => {
  const [form] = Form.useForm();
  const { data: tagsList, isFetching: loading } = useTagList(),
    tags = tagsList?.data;

  const [curId, setCurId] = useState(''),
    isEdit = isValidValue(curId);

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    'records',
    ({ pageParam = 0 }) => {
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
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage?.data?.length === 10 ? pages?.length : undefined;
      },
    },
  );

  const list = data?.pages,
    pages = list?.reduce((acc: RecordSchema[], cur) => acc.concat(cur?.data), []),
    total = list?.[list?.length - 1]?.total || 0;

  async function submit(values: any) {
    try {
      if (isEdit) {
        await update({ ...values, id: curId });
        setCurId('');
      } else {
        await add(values);
      }

      queryClient.invalidateQueries('records');
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

  // Every row is loaded except for our loading indicator row.
  // const isItemLoaded = index => !hasNextPage || index < pages.length;
  const isItemLoaded = ({ index }: { index: number }) => !hasNextPage || index < pages?.length;

  // Render an item or a loading indicator.
  const renderItem: ListProps['rowRenderer'] = ({ index, style }) => {
    const record: RecordSchema = pages?.[index];

    return (
      <div style={style} key={record?.id}>
        {isItemLoaded({ index }) ? (
          <div
            key={record.id}
            onClick={() => checked(record)}
            className={[styles['record-item'], record.id === curId && styles['active']].join(' ')}
          >
            <h3 style={{ color: '#333' }}>
              {moment(record.createAt).format('YYYY-MM-DD HH:mm:ss')}
            </h3>
            <div className={styles['content']}>
              <div className={styles['main']}>{record.event}</div>
              <div className={styles['extra']}>{nsFormat(record.deration)}</div>
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
        ) : (
          <Card style={{ margin: '12px' }}>
            <Skeleton />
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className={layoutStyles['bottom-fix-panel']}>
      {pages?.length ? (
        <InfiniteLoader isRowLoaded={isItemLoaded} rowCount={total} loadMoreRows={loadMoreItems}>
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ registerChild: winRef, ...winProps }) => (
                <List
                  style={{
                    background: '#f0f2f5',
                    paddingBottom: '128px',
                    height: '100%',
                  }}
                  {...winProps}
                  ref={(ref) => registerChild(winRef(ref))}
                  rowCount={total}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={renderItem}
                  rowHeight={118}
                />
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      ) : (
        <Empty className={styles.empty} />
      )}

      <Form onFinish={submit} form={form}>
        <div
          className={layoutStyles['bottom-fix-panel']}
          style={{
            height: '25vh',
            borderTop: '1px solid rgba(233,233,233, 05)',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)',
          }}
        >
          <section
            className={layoutStyles['fill-scroll-part']}
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
