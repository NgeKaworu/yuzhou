import React, { useState } from 'react';

import { Button, DatePicker, Empty, Form, Spin, Input } from 'antd';

import TagMgt from '@/components/TagMgt';

import type { StatisticSchema } from '@/pages/record/models';
import type { TagSchema } from '@/components/TagMgt/models';

import { nsFormat } from '@/utils/goTime';

import moment from 'moment';
import useTagList from '@/components/TagMgt/hooks/useTagList';
import useStatisticList from './hooks/useStatisticList';

import layoutStyles from '@/layouts/index.less';
import baseStyles from '@/index.less';
import styles from './index.less';

export default () => {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState();
  const { data: tagsList, isFetching: loading } = useTagList(),
    tags = tagsList?.data ?? [],
    { data: statisticList } = useStatisticList(formValue),
    statistic = statisticList?.data ?? [];

  const total = statistic?.reduce((acc: number, cur: StatisticSchema) => (acc += cur.deration), 0);

  async function submit(values: any) {
    setFormValue(values);
  }

  function cancel() {
    form.resetFields();
  }

  return (
    <div className={layoutStyles['bottom-fix-panel']}>
      <section className={[styles['fill-scroll-part'], layoutStyles['fill-scroll-part']].join(' ')}>
        <Spin spinning={loading} wrapperClassName={styles['cus-spin']}>
          {statistic.length ? (
            statistic.map((record: StatisticSchema) => {
              const tag = tags.find((t: TagSchema) => t.id === record.id),
                ratio = ((record.deration / total) * 100).toFixed(2),
                color = tag?.color ?? '';

              return (
                <div
                  className={baseStyles['record-item']}
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
                    className={[baseStyles['content'], styles.filter].join(' ')}
                  >
                    <div className={baseStyles['main']}>{ratio}%</div>
                    <div className={baseStyles['extra']}>{nsFormat(record.deration)}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty className={baseStyles.empty} />
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
                ranges={{
                  今天: [moment().startOf('day'), moment().endOf('day')],
                  昨天: [
                    moment().add(-1, 'day').startOf('day'),
                    moment().add(-1, 'day').endOf('day'),
                  ],
                  本周: [moment().startOf('week'), moment().endOf('week')],
                  上周: [
                    moment().add(-1, 'week').startOf('week'),
                    moment().add(-1, 'week').endOf('week'),
                  ],
                  本月: [moment().startOf('month'), moment().endOf('month')],
                  今年: [moment().startOf('year'), moment().endOf('year')],
                }}
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
