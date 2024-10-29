import { useState } from 'react';

import { Button, DatePicker, Empty, Form, Spin, Input, theme } from 'antd';

import TagMgt from '@/components/TagMgt';

import type { StatisticSchema } from '@/pages/record/models';
import type { TagSchema } from '@/components/TagMgt/models';

import { nsFormat } from '@/utils/goTime';

import dayjs from 'dayjs';
import useTagList from '@/components/TagMgt/hooks/useTagList';
import useStatisticList from './hooks/useStatisticList';

import styles from './index.less';
import clsx from 'clsx';
import { prefixCls } from '@/theme';

const { useToken } = theme;
export default () => {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState();
  const { data: tagsList, isFetching: loading } = useTagList(),
    tags = tagsList?.data ?? [],
    { data: statisticList } = useStatisticList(formValue),
    statistic = statisticList?.data ?? [];

  const total = statistic?.reduce((acc: number, cur: StatisticSchema) => (acc += cur.deration), 0);

  const { hashId } = useToken();

  async function submit(values: any) {
    setFormValue(values);
  }

  function cancel() {
    form.resetFields();
  }

  return (
    <div className={clsx(`${prefixCls}-bottom-fix-panel`, hashId)}>
      <section
        className={[
          styles['fill-scroll-part'],
          clsx(`${prefixCls}-fill-scroll-part`, hashId),
        ].join(' ')}
      >
        <Spin spinning={loading} wrapperClassName={styles['cus-spin']}>
          {statistic.length ? (
            statistic.map((record: StatisticSchema) => {
              const tag = tags.find((t: TagSchema) => t.id === record.id),
                ratio = ((record.deration / total) * 100).toFixed(2),
                color = tag?.color ?? '';

              return (
                <div
                  className={clsx(`${prefixCls}-record-item`, hashId)}
                  key={record.id}
                  style={{
                    background: `linear-gradient(to right, ${color} 0% ${ratio}%, #fff ${ratio}% 100%)`,
                  }}
                >
                  <h3 style={{ color }} className={styles.filter}>
                    {tag?.name}
                  </h3>
                  <div
                    style={{ color }}
                    className={[clsx(`${prefixCls}-content`, hashId), styles.filter].join(
                      ' ',
                    )}
                  >
                    <div className={clsx(`${prefixCls}-main`, hashId)}>{ratio}%</div>
                    <div className={clsx(`${prefixCls}-extra`, hashId)}>
                      {nsFormat(record.deration)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty className={clsx(`${prefixCls}-empty`, hashId)} />
          )}
        </Spin>
      </section>

      <Form
        onFinish={submit}
        form={form}
        initialValues={{
          dateRange: [dayjs().startOf('day'), dayjs().endOf('day')],
        }}
      >
        <div
          className={clsx(`${prefixCls}-bottom-fix-panel`, hashId)}
          style={{
            height: '25vh',
            borderTop: '1px solid rgba(233,233,233, 05)',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)',
          }}
        >
          <section
            className={clsx(`${prefixCls}-fill-scroll-part`, hashId)}
            style={{
              padding: '0 0 6px 6px',
            }}
          >
            <Form.Item style={{ marginBottom: 0 }} name="tids">
              <TagMgt />
            </Form.Item>
          </section>

          <Input.Group compact style={{ display: 'flex' }}>
            <Form.Item
              style={{
                marginBottom: 0,
                flex: 1,
              }}
              name="dateRange"
            >
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                allowClear
                showTime={{ format: 'HH:mm' }}
                presets={[
                  { label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
                  {
                    label: '昨天',
                    value: [
                      dayjs().add(-1, 'day').startOf('day'),
                      dayjs().add(-1, 'day').endOf('day'),
                    ],
                  },
                  { label: '本周', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
                  {
                    label: '上周',
                    value: [
                      dayjs().add(-1, 'week').startOf('week'),
                      dayjs().add(-1, 'week').endOf('week'),
                    ],
                  },
                  { label: '本月', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
                  { label: '今年', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
                ]}
              />
            </Form.Item>
            <Button onClick={cancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
          </Input.Group>
        </div>
      </Form>
    </div>
  );
};
