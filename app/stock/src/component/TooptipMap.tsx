import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ReactNode } from 'react';

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
