/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2022-02-11 13:51:09
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-01-25 18:43:05
 * @FilePath: /stock/stock-umi/src/worker/stock.ts
 * @Description:
 *
 * Copyright (c) 2023 by fuRan NgeKaworu@gmail.com, All Rights Reserved.
 */
import isValidValue from '@/js-sdk/utils/isValidValue';
import { safeAdd, safeDivision } from '@/utils/number';
import { Weight, Stock, Sort2Num, avgField } from '../model';

let lock = 0;

self.onmessage = (e) => {
  if (lock > 0) {
    return self.postMessage({ type: 'locked' });
  }
  lock++;

  const { type, payload } = e?.data ?? {};
  switch (type) {
    case 'calc':
      return self.postMessage({ type: 'calc', status: 'done', payload: calc(payload) });
    case 'avg':
      return self.postMessage({ type: 'avg', status: 'done', payload: avg(payload) });
    default:
      return self.postMessage({ type: 'unknown', payload: e?.data });
  }
};

self.onerror = (e) => {
  console.error(e);
};

function calc({ weights, dataSource }: { weights: Weight[]; dataSource: Stock[] }) {
  const temp = dataSource?.map((s) => ({ ...s, grade: 0 }));
  weights?.forEach(sortWeight(temp));
  lock--;
  return temp;
}

function avg(dataSource: Stock[]): Stock[] {
  const g = group(dataSource);
  let ret: Stock[] = [];
  for (const [_, value] of g) {
    let sum: Stock = value?.[0];
    for (let i = 1; i < value?.length; i++) {
      const cur = value[i];
      avgField?.forEach((key) => {
        (sum[key] as number) = safeAdd(cur?.[key], sum?.[key]);
      });
    }

    avgField?.forEach((key) => {
      (sum[key] as number) = safeDivision(sum[key], value?.length);
    });

    ret.push(sum);
  }
  lock--;
  return ret;
}

function group(dataSource: Stock[]): Map<string, Stock[]> {
  let m = new Map<string, Stock[]>();
  for (const stock of dataSource) {
    const { code, bourse, bourseCode } = stock,
      key = `${bourse}${bourseCode}-${code}`;
    if (!m.has(key)) {
      m.set(key, []);
    }
    m.get(key)!.push(stock);
  }
  return m;
}

function sortWeight(dataSource: Stock[]) {
  return (w: Weight) => {
    const { isAsc, coefficient, field } = w;

    dataSource.sort((a, b) => (+a?.[field] - +b?.[field]) * (Sort2Num?.get(isAsc) ?? 1));

    dataSource.forEach((k, idx) => (k.grade = (k.grade ?? 0) + idx * coefficient));
  };
}
