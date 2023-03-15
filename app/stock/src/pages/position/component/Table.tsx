/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:34:30
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-26 20:20:16
 * @FilePath: /stock/stock-umi/src/pages/position/component/Table.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import Table, { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import useLightTablePro from '@/js-sdk/components/LightTablePro/hook/useLightTablePro';
import Position from '@/model/position';
import { list } from '@/api/position';
import Editor from './Editor';
import ExchangeEditor from '../../exchange/component/Editor';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import { Space, Typography, Switch, Button, Modal, Tooltip } from 'antd';
import StockLabel from '@/pages/stock/component/StockLabel';

import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { safeMultiply, safeAdd, safeDivision, safeNumber } from '@/utils/number';
const { Link, Text } = Typography;

export default () => {
  const { actionRef, formRef } = useLightTablePro();
  const editor = useModalForm();
  const exchangeEditor = useModalForm();

  const columns: LightTableProColumnProps<Position>[] = [
    {
      dataIndex: 'stock',
      title: '股票',
      hideInSearch: true,
      width: 180,
      render(value) {
        return <StockLabel stock={value} />;
      },
    },
    { dataIndex: ['stock', 'classify'], title: '板块', hideInSearch: true },
    {
      dataIndex: 'omitempty',
      title: '省略空仓',
      hideInTable: true,
      formItemProps: {
        valuePropName: 'checked',
      },
      renderFormItem() {
        return <Switch />;
      },
    },

    {
      dataIndex: 'totalYield',
      title: '总收益',

      hideInSearch: true,
      render(_, positionData) {
        const { stock, totalShare, totalCapital, totalDividend } = positionData ?? {};

        const marketCapitalization = safeMultiply(stock?.currentPrice, totalShare).toFixed(3),
          revenue = safeAdd(marketCapitalization, -totalCapital!, totalDividend).toFixed(3);

        return (
          <Text type={safeNumber(revenue) > 0 ? 'success' : 'danger'}>{`¥${revenue}` ?? '-'}</Text>
        );
      },
    },
    {
      dataIndex: 'yieldRate',
      title: '收益率',
      hideInSearch: true,
      render(_, positionData) {
        const { stock, totalShare, totalCapital, totalDividend, stopProfit, stopLoss } =
          positionData ?? {};

        const marketCapitalization = safeMultiply(stock?.currentPrice, totalShare).toFixed(3),
          revenue = safeAdd(marketCapitalization, -totalCapital!, totalDividend).toFixed(3),
          revenueRate = (safeDivision(revenue, totalCapital) * 100).toFixed(3);
        {
          (safeNumber(revenueRate) >= safeNumber(stopProfit) ||
            safeNumber(revenueRate) <= safeNumber(stopLoss)) && (
            <>
              <Tooltip
                title={`超过${
                  safeNumber(revenueRate) >= safeNumber(stopProfit) ? '止盈' : '止损'
                }点，请及时${safeNumber(revenueRate) >= safeNumber(stopProfit) ? '止盈' : '止损'}`}
              >
                <InfoCircleOutlined />
              </Tooltip>{' '}
            </>
          );
        }
        return (
          <Text type={safeNumber(revenueRate) > 0 ? 'success' : 'danger'}>
            {`${revenueRate}%` ?? '-'}
          </Text>
        );
      },
    },
    { dataIndex: ['stock', 'currentPrice'], title: '现价', hideInSearch: true, prefix: '¥' },
    { dataIndex: 'totalCapital', title: '总投入', hideInSearch: true, prefix: '¥' },
    { dataIndex: 'totalDividend', title: '总派息', hideInSearch: true, prefix: '¥' },
    {
      dataIndex: 'stopProfit',
      title: '止盈点',
      hideInSearch: true,
      render(stopProfit) {
        return stopProfit !== void 0 ? <Text type="success">{stopProfit}% </Text> : '-';
      },
    },
    {
      dataIndex: 'stopLoss',
      title: '止损点',
      hideInSearch: true,
      render(stopLoss) {
        return stopLoss !== void 0 ? <Text type="danger">{stopLoss}% </Text> : '-';
      },
    },
    {
      dataIndex: 'code',
      title: '操作',
      hideInSearch: true,
      width: 200,
      fixed: 'right',
      render: (code, row) => (
        <Space>
          <Link onClick={createExchange(code)}>新增交易</Link>
          <Link onClick={viewCodeHistory(code)}>交易历史</Link>
          <Link onClick={edit(row)}>编辑</Link>
        </Space>
      ),
    },
  ];

  function edit(row: Position) {
    return () => {
      editor.setModalProps((pre) => ({ ...pre, visible: true, title: '编辑' }));
      editor.form.setFieldsValue(row);
    };
  }

  function editSuccess() {
    actionRef.current?.reload?.();
  }

  function viewCodeHistory(code: string) {
    return () => {
      window.open(`/stock/exchange/${code}`);
    };
  }

  function createExchange(code?: string) {
    return () => {
      exchangeEditor.setModalProps((pre) => ({ ...pre, visible: true, title: '新增' }));
      exchangeEditor.form.setFieldsValue({ code });

      exchangeEditor.setData({ code });
    };
  }

  function createExchangeSuccess(code: string) {
    actionRef.current?.reload?.();
    Modal.confirm({
      title: '提示',
      content: '是否跳转详情页',
      onOk: viewCodeHistory(code),
    });
  }

  return (
    <>
      <Editor {...editor} onSuccess={editSuccess} />
      <ExchangeEditor {...exchangeEditor} onSuccess={createExchangeSuccess} />

      <Table
        rowKey={'code'}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        formProps={{
          initialValues: { omitempty: true },
        }}
        headerTitle={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={createExchange()}>
              新增
            </Button>
          </Space>
        }
        scroll={{
          x: 'max-content',
          y: '100%',
        }}
        queryOptions={{ refetchOnWindowFocus: false }}
        request={async (params, pagination) => {
          const res = await list({
            params: {
              ...params,
              skip: (pagination?.current ?? 0) * (pagination?.pageSize ?? 0),
              limit: pagination?.pageSize,
            },
          });

          return {
            data: res?.data || [],
            page: pagination?.current || 1,
            success: true,
            total: res?.total || 0,
          };
        }}
      />
    </>
  );
};
