/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2022-01-27 14:50:20
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-15 14:14:21
 * @FilePath: /yuzhou/app/stock/src/pages/stock/component/DataSource.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { useState } from 'react';
import { Button, DatePicker, Divider, Form, Space, TimeRangePickerProps } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import SearchForm from 'edk/src/components/SearchForm';
import { restful } from 'edk/src/utils/http';
import { WithSuccess } from 'edk/src/Interface/Container';
import dayjs from 'dayjs';

const { Item } = Form;
const { RangePicker } = DatePicker;

export default ({ onSuccess }: WithSuccess<{}>) => {
  const [loading, setLoading] = useState(false);

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: '上季度', value: [dayjs().add(-3, 'month'), dayjs()] },
    { label: '上半年', value: [dayjs().add(-6, 'month'), dayjs()] },
    { label: '上一年', value: [dayjs().add(-12, 'month'), dayjs()] },
  ];

  async function onFinish(value: any) {
    setLoading(true);
    try {
      const { dataTime } = value,
        res = await restful.get(`stock/stock-list?dataTime=${JSON.stringify(dataTime)}`, {
          timeout: 0,
        });
      onSuccess(res?.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function crawl() {
    setLoading(true);
    try {
      await restful.get(`stock/stockCrawlMany`, {
        timeout: 0,
      });
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <SearchForm formProps={{ onFinish, wrapperCol: void 0, labelCol: void 0 }}>
      <Space>
        <Item name="dataTime" rules={[{ required: true, message: '时间区间不能为空' }]}>
          <RangePicker presets={rangePresets} />
        </Item>
        <Item>
          <Button htmlType="submit" type="primary" ghost loading={loading}>
            选择时间区间
          </Button>
        </Item>
        <Divider />
        <Item>
          <Button
            danger
            onClick={crawl}
            shape="round"
            ghost
            loading={loading}
            icon={<SyncOutlined />}
          >
            重爬今日
          </Button>
        </Item>
      </Space>
    </SearchForm>
  );
};
