/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-11 02:19:24
 * @FilePath: /yuzhou/workspace/edk/src/hooks/useExportExcel/util/converter/LightCol2Col.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import type { LightTableProColumnProps } from '../../../../components/LightTablePro';
import type { ExportColumns, ExportColumn } from '..';

export type Exportable<T extends Record<any, any> = any, R = T> = T &
  ExportColumn<R> & {
    forceExport?: boolean;
    noConvent?: boolean;
  };

export default <T extends Record<any, any>>(cols?: Exportable<LightTableProColumnProps<T>, T>[]): ExportColumns<T> =>
  [...(cols ?? [])]
    // 排序
    // order	查询表单中的权重，权重大排序靠前	number
    .sort((a, b) => (b?.order ?? 0) - (a?.order ?? 0))
    .reduce(
      (acc: ExportColumns<T>, cur) =>
        cur?.forceExport || !cur?.hideInTable
          ? {
              ...acc,
              [`${cur.dataIndex}`]: { ...cur, title: `${cur.title}`, replacer: calcColum(cur) },
            }
          : acc,
      {},
    );

function calcColum<T>({
  replacer,
  valueEnum,
  render,
  noConvent,
}: Exportable<LightTableProColumnProps<T>, T>): Exportable<
  LightTableProColumnProps<T>,
  T
>['replacer'] {
  if (noConvent) return;

  if (replacer) return replacer;

  if (render) return (text, index, row) => render(text, row, index) as string;

  if (valueEnum) {
    return (value: any) => {
      if (valueEnum instanceof Map) {
        return valueEnum.get(value) as string;
      }
      return valueEnum[value] as string;
    };
  }
}
