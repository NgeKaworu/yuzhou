/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2022-02-11 13:51:09
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-26 14:32:08
 * @FilePath: /stock/stock-umi/src/model/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by fuRan NgeKaworu@gmail.com, All Rights Reserved.
 */
import { Condition } from '@/pages/stock/component/ConditionEditor/model';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ReactNode } from 'react';

export interface Stock {
  id: string; //ID
  code: string; //股票代码
  bourse: string; //交易所名字
  bourseCode: string; //交易所代码
  PB: number; //市净率
  PE: number; //市盈率
  PEG: number; //市盈增长比
  ROE: number; //净资产收益率
  DPE: number; //动态利润估值
  DPER: number; //动态利润估值率
  DCE: number; //动态现金估值
  DCER: number; //动态现金估值率
  AAGR: number; //平均年增长率
  classify: string; //板块
  name: string; //股票名字
  createAt: Date; // 创建时间
  grade: number; // 评分
  currentPrice: number; //现价
}

export interface Weight {
  field: keyof Stock;
  isAsc: boolean;
  coefficient: number;
}

export interface Filter {
  field: keyof Stock;
  filter: Condition;
}

export const Sort2Num = new Map([
  [true, 1],
  [false, -1],
]);

export const avgField: Array<keyof Stock> = [
  'PB',
  'PE',
  'PEG',
  'ROE',
  'DPE',
  'DPER',
  'DCE',
  'DCER',
  'AAGR',
];

export const tooltipMap = new Map<string, ReactNode>([
  [
    'PB',
    <Tooltip title="市值 / 净资产 （反映市场预期）">
      <InfoCircleOutlined />
    </Tooltip>,
  ],
  [
    'PE',
    <Tooltip title="市值 / 净利润 （反映回本时间）">
      <InfoCircleOutlined />
    </Tooltip>,
  ],
  [
    'PEG',
    <Tooltip title="PE / 平均年增长率">
      <InfoCircleOutlined />
    </Tooltip>,
  ],
  [
    'ROE',
    <Tooltip title="净利润 / 净资产 (盈利能力)">
      <InfoCircleOutlined />
    </Tooltip>,
  ],
]);

export const fields = new Map<string, ReactNode>([
  ['PB', '市净率'],
  ['PE', '市盈率'],
  ['PEG', '市盈增长比'],
  ['ROE', '净资产收益率'],
  ['DPE', '利润估值'],
  ['DPER', '动态利润估值率'],
  ['DCE', '动态现金估值'],
  ['DCER', '动态现金估值率'],
  ['AAGR', '平均年增长率'],
]);
