import { useState } from 'react';

import { Button, DatePicker, Empty, Form, Spin, Input, theme } from 'antd';

import TagMgt from '@/components/TagMgt';

import type { StatisticSchema } from '@/pages/record/models';
import type { TagSchema } from '@/components/TagMgt/models';

import { nsFormat } from '@/utils/goTime';

import moment from 'dayjs';
import useTagList from '@/components/TagMgt/hooks/useTagList';
import useStatisticList from './hooks/useStatisticList';

import styles from './index.less';
import classNames from 'classnames';
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
    <div className={classNames(`${prefixCls}-bottom-fix-panel`, hashId)}>
      <section
        className={[
          styles['fill-scroll-part'],
          classNames(`${prefixCls}-fill-scroll-part`, hashId),
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
                  className={classNames(`${prefixCls}-record-item`, hashId)}
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
                    className={[classNames(`${prefixCls}-content`, hashId), styles.filter].join(
                      ' ',
                    )}
                  >
                    <div className={classNames(`${prefixCls}-main`, hashId)}>{ratio}%</div>
                    <div className={classNames(`${prefixCls}-extra`, hashId)}>
                      {nsFormat(record.deration)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty className={classNames(`${prefixCls}-empty`, hashId)} />
          )}
        </Spin>
      </section>

      <Form
        onFinish={submit}
        form={form}
        initialValues={{
          dateRange: [moment().startOf('day'), moment().endOf('day')],
        }}
      >
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
                  { label: '今天', value: [moment().startOf('day'), moment().endOf('day')] },
                  {
                    label: '昨天',
                    value: [
                      moment().add(-1, 'day').startOf('day'),
                      moment().add(-1, 'day').endOf('day'),
                    ],
                  },
                  { label: '本周', value: [moment().startOf('week'), moment().endOf('week')] },
                  {
                    label: '上周',
                    value: [
                      moment().add(-1, 'week').startOf('week'),
                      moment().add(-1, 'week').endOf('week'),
                    ],
                  },
                  { label: '本月', value: [moment().startOf('month'), moment().endOf('month')] },
                  { label: '今年', value: [moment().startOf('year'), moment().endOf('year')] },
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
