/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-11 21:43:37
 * @FilePath: /yuzhou/workspace/edk/src/components/LightTable/valueTypeRegister.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import reverseSplitJoin from '../../struct/string/reverseSplitJoin';
import type { TableColumnProps } from 'antd';
import dayjs from 'dayjs';
import type { ValueType } from '../type';

const dataFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';

export function _valueTypeRegister<RecordType>(
  valueType: ValueType,
): TableColumnProps<RecordType>['render'] {
  const register: Partial<Record<ValueType, TableColumnProps<RecordType>['render']>> = {
    date: (v) => dayjs(v)?.format(dataFormat),
    dateTime: (v) => dayjs(v)?.format(`${dataFormat} ${timeFormat}`),
    time: (v) => dayjs(v)?.format(`${timeFormat}`),
    dateRange: (vv: string) =>
      vv
        ?.split?.(',')
        ?.map((v) => dayjs(v)?.format(`${timeFormat}`))
        ?.join(','),
    dateTimeRange: (vv: string) =>
      vv
        ?.split?.(',')
        ?.map((v) => dayjs(v)?.format(`${dataFormat} ${timeFormat}`))
        ?.join(','),
    digit: (v) => reverseSplitJoin({ num: v, split: ',', limit: 3 }),
  };

  return register[valueType];
}
