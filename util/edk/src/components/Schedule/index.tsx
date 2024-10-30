import Scope from '../../';
import type { CSSProperties, ReactNode } from 'react';
import type { MarqueeProps } from '../Marquee';
import Marquee from '../Marquee';
import trimEndWith from '../../struct/string/trimEndWith';
import arr from '../../struct/array/arr';

import { CSSInterpolation, useStyleRegister } from '@ant-design/cssinjs';
import clsx from 'clsx';
import { GlobalToken } from 'antd';

const { useState } = Scope.react;
const { Tooltip, Typography, theme } = Scope.antd;

const { Link, Paragraph, Text } = Typography;

export interface ScheduleProps {
  value?: boolean[][];
  onChange?: (matrix: boolean[][]) => void;
  colWidth?: number;
  colHeight?: number;
  rowHeadWidth?: number;
  colHeadHeight?: number;
  rowHeads?: ReactNode[];
  borderSize?: number;
  prefixCls?: string;
}
const initValue = arr(7, arr(48, false));

const { useToken } = theme;

export default function ({
  value = initValue,
  onChange,
  colWidth = 15,
  colHeight = 25,
  rowHeadWidth = colWidth * 7,
  colHeadHeight = colHeight * 2,
  rowHeads = ['日', '一', '二', '三', '四', '五', '六'],
  borderSize = 1,
  prefixCls = 'schedule',
}: ScheduleProps) {
  const [_value, _setValue] = useState<boolean[][]>(initValue);

  // 【自定义】制造样式
  const { theme, token, hashId } = useToken();

  // 全局注册，内部会做缓存优化
  const wrapSSR = useStyleRegister({ theme, token, hashId, path: [prefixCls] }, () => [
    genStyle(prefixCls, token),
  ]);

  const picked = value ?? _value,
    setPicked = onChange ?? _setValue;

  const offsetX = (x: number) => x - rowHeadWidth,
    offsetY = (y: number) => y - colHeadHeight - colHeight,
    calcX = (x: number) => Math.ceil(offsetX(x) / colWidth),
    calcY = (y: number) => Math.ceil(offsetY(y) / colHeight),
    invalidRow = (row: number) => row < 0 || row >= picked.length,
    invalidCol = (col: number) => col < 0 || col >= picked[0].length;

  const onRange: MarqueeProps['onRange'] = ({ start, end }) => {
    const temp = picked.map((r) => r.map((c) => c));
    let pick = false;
    for (let row = calcY(start.y) - 1; row < calcY(end.y); row++) {
      if (invalidRow(row)) continue;
      for (let col = calcX(start.x) - 1; col < calcX(end.x); col++) {
        if (invalidCol(col)) continue;
        if (temp[row][col] === false) {
          pick = true;
        }
      }
    }
    for (let row = calcY(start.y) - 1; row < calcY(end.y); row++) {
      if (invalidRow(row)) continue;
      for (let col = calcX(start.x) - 1; col < calcX(end.x); col++) {
        if (invalidCol(col)) continue;
        temp[row][col] = pick;
      }
    }
    setPicked(temp);
  };

  const flexStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const colStyle: CSSProperties = {
    ...flexStyle,
    minWidth: colWidth - 3 * borderSize,
    height: colHeight - 3 * borderSize,
  };

  const colHeaderStyle: CSSProperties = {
    ...flexStyle,
    height: colHeadHeight - 3 * borderSize,
  };

  const rowHeaderStyle: CSSProperties = {
    ...flexStyle,
    minWidth: rowHeadWidth - 3 * borderSize,
  };

  const complement = (str: string) => (str.length < 2 ? `0${str}` : str);
  const time = (num: number) =>
    `${complement(`${~~(num / 2)}`)}:${complement(`${(num % 2) * 30}`)}`;

  function clean() {
    setPicked(initValue);
  }

  return wrapSSR(
    <Marquee onRange={onRange} sticky={{ offsetX: colWidth, offsetY: colHeight }}>
      <table className={clsx(`${prefixCls}-table`)}>
        <caption>
          {picked.some((pick) => pick.includes(true)) ? (
            <div>
              <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">己选择时段</Text>
                <Link onClick={clean}>清除所有</Link>
              </Paragraph>
              {picked.reduce((acc: ReactNode[], pick, day) => {
                let str = '',
                  i = -1;
                while (i < pick.length + 1) {
                  i++;
                  if (!pick[i]) continue;

                  let j = i;
                  while (j < pick.length + 1) {
                    j++;
                    if (!pick[j]) {
                      str += `${time(i)}~${time(j)}、`;
                      i = j;
                      break;
                    }
                  }
                }
                return pick.includes(true)
                  ? acc.concat(
                      <Paragraph key={day}>
                        <Text type="secondary" style={{ marginRight: '48px' }}>
                          {rowHeads[day]}
                        </Text>{' '}
                        {trimEndWith(str, '、')}
                      </Paragraph>,
                    )
                  : acc;
              }, [])}
            </div>
          ) : (
            '可拖动鼠标选择时间段'
          )}
        </caption>

        <colgroup>
          <col />
          {initValue[0]?.map((_, hour) => <col key={`hour-${hour}`} />)}
        </colgroup>

        <thead>
          <tr>
            <th rowSpan={2}>周/时间</th>
            <th colSpan={24}>
              <div style={colHeaderStyle}>00:00 - 12:00</div>
            </th>
            <th colSpan={24}>
              <div style={colHeaderStyle}>12:00 - 24:00</div>
            </th>
          </tr>
          <tr>
            {arr(24)?.map((_, hour) => (
              <th key={`hour-${hour}`} colSpan={2}>
                <div style={colStyle}>{hour}</div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {initValue?.map((hours, day) => (
            <tr key={`hours-${day}`}>
              <td>
                <div style={rowHeaderStyle}>{rowHeads[day]}</div>
              </td>
              {hours.map((_, halfHour) => (
                <td
                  key={`day-${day}-${halfHour}`}
                  className={clsx(picked[day][halfHour] === true && `${prefixCls}'-picked'`)}
                >
                  <Tooltip
                    overlay={`${rowHeads[day]} ${time(halfHour)} - ${time(halfHour + 1)}`}
                    mouseEnterDelay={0.5}
                  >
                    <div style={colStyle} />
                  </Tooltip>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Marquee>,
  );
}

const genStyle = (prefixCls: string, token: GlobalToken): CSSInterpolation => ({
  [`.${prefixCls}-table`]: {
    userSelect: 'none',
    'table,\n  td,\n  th,\n  caption': { border: '1px solid #e0e0e0' },
    caption: { padding: '12px', borderTop: 'unset' },
    [`.${prefixCls}-picked`]: {
      backgroundColor: `${token.colorPrimary}`,
      filter: 'brightness(1.3)',
      transition: 'background-color 0.2s ease',
    },
  },
});
