/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:14:33
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-20 17:58:02
 * @FilePath: /yuzhou/app/stock/src/pages/exchange/component/Editor.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import {
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Space,
  Tooltip,
  Typography,
} from 'antd';

import ModalForm from 'edk/src/components/ModalForm';
import type useModalForm from 'edk/src/components/ModalForm/useModalForm';

import { update, create } from '@/api/exchange';
import moment from 'dayjs';
import Format from 'edk/src/decorators/Format';
import { IOC } from 'edk/src/decorators/hoc';
import { compose } from 'edk/src/decorators/utils';
import { useQuery } from '@tanstack/react-query';
import { detail } from '@/api/position';
import { safeMultiply, safeAdd, safeDivision, safeNumber } from '@/utils/number';

import { InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Subject, throttleTime } from 'rxjs';

const { Item } = Form;

const { Text } = Typography;
const DescriptionsItem = Descriptions.Item;

export default ({
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
  data,
  setData,
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const obs = new Subject();
  obs
    .pipe(throttleTime(10000, void 0, { leading: true, trailing: true }))
    .subscribe((value) => setData((pre: any) => ({ ...pre, code: value })));
  const { code } = data ?? {};
  const positionDetail = useQuery(
    ['position-detail', code],
    () => detail(code, { params: { omitempty: false } }),
    {
      enabled: !!code,
    },
  );

  const inEdit = modalProps?.title === '编辑';

  const [{ transactionPrice, currentShare }, setCalcProp] = useState({
    transactionPrice: 0,
    currentShare: 0,
  });

  async function onSubmit() {
    const value = await form?.validateFields();
    try {
      setModalProps((pre) => ({ ...pre, confirmLoading: true }));
      if (inEdit) {
        await update(value.id, value);
      } else {
        await create(value);
      }

      await onSuccess?.(value?.code);
      setModalProps((pre) => ({ ...pre, open: false }));
      form.resetFields();
      setCalcProp({
        transactionPrice: 0,
        currentShare: 0,
      });
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  const positionData = positionDetail?.data?.data,
    { stock, totalShare, totalCapital, totalDividend, stopProfit, stopLoss } = positionData ?? {};

  const cost = safeAdd(safeMultiply(transactionPrice, currentShare), totalCapital);

  const marketCapitalization = safeMultiply(
      stock?.currentPrice,
      safeAdd(totalShare, currentShare),
    ).toFixed(3),
    revenue = safeAdd(marketCapitalization, -cost!, totalDividend).toFixed(3),
    revenueRate = (safeDivision(revenue, cost) * 100).toFixed(3);

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,
        initialValues: {
          createAt: moment(),
          currentDividend: 0,
        },
        ...formProps,
      }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      {!inEdit && (
        <Descriptions
          bordered
          title={<>现价: {stock?.currentPrice !== void 0 ? `¥${stock?.currentPrice}` : '-'}</>}
          extra={
            <Space>
              止盈点: <Text type="success">{stopProfit ? `${stopProfit}%` : '-'}</Text>
              止损点: <Text type="danger">{stopLoss ? `${stopLoss}%` : '-'}</Text>
            </Space>
          }
        >
          <DescriptionsItem label="交易后总营收">
            <Text type={safeNumber(revenue) > 0 ? 'success' : 'danger'}>
              {`¥${revenue}` ?? '-'}
            </Text>
          </DescriptionsItem>

          <DescriptionsItem label="交易后营收率">
            {(safeNumber(revenueRate) >= safeNumber(stopProfit) ||
              safeNumber(revenueRate) <= safeNumber(stopLoss)) && (
              <>
                <Tooltip
                  title={`超过${
                    safeNumber(revenueRate) >= safeNumber(stopProfit) ? '止盈' : '止损'
                  }点，请及时${
                    safeNumber(revenueRate) >= safeNumber(stopProfit) ? '止盈' : '止损'
                  }`}
                >
                  <InfoCircleOutlined />
                </Tooltip>{' '}
              </>
            )}
            <Text type={safeNumber(revenueRate) > 0 ? 'success' : 'danger'}>
              {`${revenueRate}%` ?? '-'}
            </Text>
          </DescriptionsItem>
        </Descriptions>
      )}

      <Item name="id" hidden>
        <Input disabled />
      </Item>
      <Item name="code" label="股票代码" rules={[{ required: true }]}>
        <Input
          onChange={(e) => {
            obs.next(e.currentTarget.value);
          }}
        />
      </Item>
      <Item name="createAt" label="成交时间" rules={[{ required: true }]}>
        {compose<any>(
          IOC([
            Format<any>({
              input: moment,
            }),
          ]),
        )(<DatePicker placeholder="请选择" showTime />)}
      </Item>
      <Item name="transactionPrice" label="成交价格" rules={[{ required: true }]}>
        <InputNumber<number>
          placeholder="请输入"
          onChange={(transactionPrice) => {
            setCalcProp((pre) => ({ ...pre, transactionPrice: transactionPrice! }));
          }}
        />
      </Item>
      <Item name="currentShare" label="成交数量" rules={[{ required: true }]}>
        <InputNumber<number>
          placeholder="请输入"
          onChange={(currentShare) => {
            setCalcProp((pre) => ({ ...pre, currentShare: currentShare! }));
          }}
        />
      </Item>
      <Item name="currentDividend" label="本次派息" rules={[{ required: true }]}>
        <InputNumber placeholder="请输入" />
      </Item>
      {/* <Item name="stopLoss" label="当前总收益">
        <InputNumber placeholder="请输入" disabled />
      </Item>
      <Item name="stopLoss" label="交易后总收益">
        <InputNumber placeholder="请输入" disabled />
      </Item>
      <Item name="stopLoss" label="当前收益率">
        <InputNumber placeholder="请输入" disabled />
      </Item>
      <Item name="stopLoss" label="交易后收益率">
        <InputNumber placeholder="请输入" disabled />
      </Item> */}
    </ModalForm>
  );
};
