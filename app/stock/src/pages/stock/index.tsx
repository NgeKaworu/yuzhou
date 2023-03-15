import { useEffect, useState } from 'react';
import { Button, Steps, Tag, Switch, Modal, Space, Typography } from 'antd';

import { Stock, Weight as IWeight, Filter as IFilter, fields, tooltipMap } from '../../model';
import isValidValue from '@/js-sdk/utils/isValidValue';
import Weight from './component/Weight';
import useDrawerForm from '@/js-sdk/components/DrawerForm/useDrawerForm';
import DataSource from './component/DataSource';
import LightTable, { LightColumnProps } from '@/js-sdk/components/LightTable';
import Filter from './component/Filter';
import { decode } from '@/utils/json';
import {
  convert2Number,
  interpolationCondition,
  renderCondition,
} from './component/ConditionEditor/util';
import { conditionParse } from './component/ConditionEditor/model';
import StockLabel from './component/StockLabel';
import Editor from '../exchange/component/Editor';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
const { Link } = Typography;

const worker = new Worker(new URL('../../worker/stock.ts', import.meta.url));

const { Step } = Steps;

export default () => {
  const [dataSource, setDataSource] = useState<Stock[]>(),
    [data, setData] = useState<Stock[]>(),
    [weights, setWeights] = useState<IWeight[]>(decode(localStorage.getItem('Weight'))),
    [filters, setFilters] = useState<IFilter[]>(decode(localStorage.getItem('Filter'))),
    [filterSwitch, setFilterSwitch] = useState(true),
    [calculating, setCalculating] = useState<boolean>(),
    workerHandler: Worker['onmessage'] = (e) => {
      setData(e?.data?.payload);
      setCalculating(false);
    },
    weight = useDrawerForm(),
    filter = useDrawerForm();

  const exchangeEditor = useModalForm();

  useEffect(() => {
    worker.onmessage = workerHandler;
    return () => worker.terminate();
  }, [worker]);

  async function calc() {
    setCalculating(true);
    worker.postMessage({ type: 'calc', payload: { dataSource: data, weights } });
  }

  function cleanFilters() {
    setFilters([]);
    localStorage.removeItem('Filter');
    filter.form.setFieldsValue({ filters: [] });
  }

  function fetchDateAndAvg(stocks: Stock[]) {
    setDataSource(stocks);
    setCalculating(true);
    worker.postMessage({ type: 'avg', payload: stocks });
  }

  const sorterHOF: (field: keyof Stock) => LightColumnProps<Stock>['sorter'] = (field) => (a, b) =>
    Number(a[field]) - Number(b[field]);

  const columns: LightColumnProps<Stock>[] = [
    {
      title: '股票',
      dataIndex: 'mixed',
      render: (_, r) => <StockLabel stock={r} />,
      width: 180,
      fixed: 'left',
    },
    {
      title: '板块',
      dataIndex: 'classify',
      width: 180,
      ellipsis: { tooltip: true, rows: 1, padding: 17 },
    },
    {
      title: '评分',
      dataIndex: 'grade',
      sorter: sorterHOF('grade'),
      defaultSortOrder: 'descend',
    },
    { title: '市净率', dataIndex: 'PB', decimal: 2, sorter: sorterHOF('PB') },
    { title: '市盈率', dataIndex: 'PE', decimal: 2, sorter: sorterHOF('PE') },
    { title: '市盈增长比', dataIndex: 'PEG', decimal: 2, sorter: sorterHOF('PEG') },
    { title: '净资产收益率', dataIndex: 'ROE', decimal: 2, sorter: sorterHOF('ROE') },
    { title: '动态利润估值', dataIndex: 'DPE', decimal: 2, sorter: sorterHOF('DPE') },
    { title: '动态利润估值率', dataIndex: 'DPER', decimal: 2, sorter: sorterHOF('DPER') },
    { title: '动态现金估值', dataIndex: 'DCE', decimal: 2, sorter: sorterHOF('DCE') },
    { title: '动态现金估值率', dataIndex: 'DCER', decimal: 2, sorter: sorterHOF('DCER') },
    { title: '平均年增长率', dataIndex: 'AAGR', decimal: 2, sorter: sorterHOF('AAGR') },
    {
      dataIndex: 'code',
      title: '操作',
      width: 200,
      render: (code) => (
        <Space>
          <Link onClick={createExchange(code)}>新增交易</Link>
          <Link onClick={viewCodeHistory(code)}>交易历史</Link>
        </Space>
      ),
      fixed: 'right',
    },
  ];

  function filteredData() {
    return data?.filter((s) => {
      return filters?.every((f) =>
        conditionParse(convert2Number(interpolationCondition(f.filter, '$this', s?.[f.field]))),
      );
    });
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
    Modal.confirm({
      title: '提示',
      content: '是否跳转详情页',
      onOk: viewCodeHistory(code),
    });
  }

  return (
    <>
      <Weight {...weight} onSuccess={setWeights} />
      <Filter {...filter} onSuccess={setFilters} />

      <Editor {...exchangeEditor} onSuccess={createExchangeSuccess} />

      <Steps direction="vertical">
        <Step
          status={isValidValue(dataSource) ? 'finish' : 'wait'}
          title="先选个时间范围"
          description={<DataSource onSuccess={fetchDateAndAvg} />}
        />
        <Step
          status={isValidValue(weights) ? 'finish' : 'wait'}
          title="权重"
          description={
            <>
              {weights?.map?.((w) => (
                <Tag color={w.isAsc ? 'lawngreen' : 'orangered'} key={w.field}>
                  {tooltipMap.get(w.field)} {w.field} {fields.get(w.field)} ({w.coefficient})
                </Tag>
              ))}
              <Button
                onClick={() => weight.setDrawerProps((pre) => ({ ...pre, visible: true }))}
                type="primary"
                ghost
              >
                配置权重
              </Button>{' '}
              <Button
                onClick={calc}
                type="primary"
                disabled={!isValidValue(dataSource) || !isValidValue(weights)}
                loading={calculating}
              >
                计算
              </Button>
            </>
          }
        />

        <Step
          status={isValidValue(filters) ? 'finish' : 'wait'}
          title="过滤"
          description={
            <>
              {filters?.map?.((f) => (
                <Tag key={f.field}>
                  {tooltipMap.get(f.field)} {f.field} {fields.get(f.field)}{' '}
                  {renderCondition(f.filter)}
                </Tag>
              ))}
              <Button
                onClick={() => filter.setDrawerProps((pre) => ({ ...pre, visible: true }))}
                type="primary"
                ghost
              >
                配置过滤条件
              </Button>{' '}
              <Button onClick={cleanFilters} type="link">
                清空过滤条件
              </Button>{' '}
              <Switch
                checkedChildren="过滤"
                unCheckedChildren="不过滤"
                onChange={setFilterSwitch}
                checked={filterSwitch}
              />
            </>
          }
        />
      </Steps>

      <LightTable
        columnEmptyText="-"
        columns={columns}
        scroll={{ x: 'max-content' }}
        rowKey={(r) => `${r.bourse}${r.code}`}
        dataSource={filterSwitch ? filteredData() : data}
      />
    </>
  );
};
