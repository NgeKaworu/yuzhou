/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 18:12:36
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-26 19:06:31
 * @FilePath: /stock/stock-umi/src/pages/exchange/component/Table.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import Position from '@/model/position';
import { detail } from '@/api/position';
import { list, deleteOne } from '@/api/exchange';
import Editor from './Editor';
import PositionEditor from '../../position/component/Editor';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import {
  Button,
  Space,
  Typography,
  Popconfirm,
  Card,
  Descriptions,
  TablePaginationConfig,
  Tooltip,
} from 'antd';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import LightTable from '@/js-sdk/components/LightTable';
import { useParams } from 'react-router';
import Exchange from '@/model/exchange';
import StockLabel from '@/pages/stock/component/StockLabel';
import { safeAdd, safeDivision, safeMultiply, safeNumber } from '@/utils/number';

const { Text, Link } = Typography;
const DescriptionsItem = Descriptions.Item;

export default () => {
  const editor = useModalForm();
  const positionEditor = useModalForm();
  const { code }: any = useParams();
  const [[pages, pageSize], setPagePair] = useState<
    Parameters<NonNullable<TablePaginationConfig['onChange']>>
  >([1, 10]);

  useEffect(() => {
    if (code) {
      document.title = code;
    }
  }, [code]);

  const positionDetail = useQuery(
    ['position-detail', code],
    () => detail(code, { params: { omitempty: false } }),
    {
      enabled: !!code,
      onSuccess(res) {
        if (res.data?.stock?.name) {
          document.title = `${res.data?.stock.code} - ${res.data?.stock.name}`;
        }
      },
    },
  );

  const exchangeList = useQuery(
    ['exchange-list', code, pages, pageSize],
    () =>
      list(code, {
        params: {
          limit: pageSize,
          skip: (pages - 1) * (pageSize ?? 10),
        },
      }),
    {
      enabled: !!code,
    },
  );

  const reload = () => {
    positionDetail.refetch();
    exchangeList.refetch();
  };

  const tablePaginationConfig: TablePaginationConfig = {
    showSizeChanger: true,
    current: pages,
    pageSize,
    total: exchangeList?.data?.total,
    onChange: (...args) => setPagePair(args),
  };

  const columns: LightTableProColumnProps<Exchange>[] = [
    { dataIndex: 'createAt', title: '交易时间', valueType: 'dateTime' },
    {
      dataIndex: 'currentCapital',
      title: '成交金额',
      render(_, { currentShare, transactionPrice }) {
        return `¥${safeMultiply(currentShare, transactionPrice)}`;
      },
    },
    { dataIndex: 'transactionPrice', title: '成交价格', prefix: '¥' },
    { dataIndex: 'currentShare', title: '成交数量' },
    { dataIndex: 'currentDividend', title: '本次派息', prefix: '¥' },
    {
      dataIndex: 'id',
      title: '操作',
      render: (id, row) => (
        <Space>
          <Link onClick={edit(row)}>编辑</Link>
          <Popconfirm title="操作不可逆，请二次确认" onConfirm={remove(id)}>
            <Link>删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function create() {
    editor.setModalProps((pre) => ({ ...pre, visible: true, title: '新增' }));
    editor.form.setFieldsValue({ code });

    editor.setData({ code });
  }

  function edit(row: Exchange) {
    return () => {
      editor.setModalProps((pre) => ({ ...pre, visible: true, title: '编辑' }));
      editor.form.setFieldsValue(row);

      editor.setData({ code });
    };
  }

  function remove(id: Exchange['id']) {
    return async () => {
      try {
        await deleteOne(id, { notify: true });
        reload();
      } catch {}
    };
  }

  function editSuccess() {
    reload();
  }

  function positionEditSuccess() {
    reload();
  }

  function editPosition(row: Position) {
    return () => {
      positionEditor.setModalProps((pre) => ({ ...pre, visible: true, title: '编辑' }));
      positionEditor.form.setFieldsValue(row);
    };
  }

  const positionData = positionDetail?.data?.data,
    { stock, totalShare, totalCapital, totalDividend, stopProfit, stopLoss } = positionData ?? {};

  const marketCapitalization = safeMultiply(stock?.currentPrice, totalShare).toFixed(3),
    revenue = safeAdd(marketCapitalization, -totalCapital!, totalDividend).toFixed(3),
    revenueRate = (safeDivision(revenue, totalCapital) * 100).toFixed(3);

  return (
    <>
      <Editor {...editor} onSuccess={editSuccess} />
      <PositionEditor {...positionEditor} onSuccess={positionEditSuccess} />

      <Card size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Descriptions
            title={
              <>
                <b>股票名称: </b> {stock && <StockLabel stock={stock} />}
              </>
            }
            bordered
            extra={<Link onClick={editPosition(positionData!)}>编辑</Link>}
          >
            <DescriptionsItem label="现价">
              {stock?.currentPrice !== void 0 ? `¥${stock?.currentPrice}` : '-'}
            </DescriptionsItem>
            <DescriptionsItem label="市值">
              {marketCapitalization !== void 0 ? `¥${marketCapitalization}` : '-'}
            </DescriptionsItem>
            <DescriptionsItem label="总投入">
              {totalCapital !== void 0 ? `¥${totalCapital}` : '-'}
            </DescriptionsItem>
            <DescriptionsItem label="总营收">
              <Text type={safeNumber(revenue) > 0 ? 'success' : 'danger'}>
                {`¥${revenue}` ?? '-'}
              </Text>
            </DescriptionsItem>
            <DescriptionsItem label="总股份">{totalShare ?? '-'}</DescriptionsItem>
            <DescriptionsItem label="总派息">
              {totalDividend !== void 0 ? `¥${totalDividend}` : '-'}
            </DescriptionsItem>
            <DescriptionsItem label="营收率">
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
            <DescriptionsItem label="止盈点">
              <Text type="success">{stopProfit ? `${stopProfit}%` : '-'}</Text>
            </DescriptionsItem>
            <DescriptionsItem label="止损点">
              <Text type="danger">{stopLoss ? `${stopLoss}%` : '-'}</Text>
            </DescriptionsItem>
          </Descriptions>
          <Space>
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={create}>
              新增
            </Button>
          </Space>
          <LightTable
            columnEmptyText="-"
            columns={columns}
            scroll={{ x: 'max-content' }}
            rowKey={(r) => r.id}
            dataSource={exchangeList?.data?.data}
            pagination={tablePaginationConfig}
          />
        </Space>
      </Card>
    </>
  );
};
