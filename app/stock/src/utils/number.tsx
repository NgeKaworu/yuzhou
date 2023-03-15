/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2021-09-16 15:06:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-26 15:31:46
 * @FilePath: /stock/stock-umi/src/utils/number.tsx
 * @Description:
 *
 * Copyright (c) 2023 by fuRan NgeKaworu@gmail.com, All Rights Reserved.
 */
export function safeNumber(i: any): number {
  const tmp = +i;
  return Number.isNaN(tmp) ? 0 : tmp;
}

export function safeAdd(...nums: any[]): number {
  return nums?.reduce((acc, n) => (acc += safeNumber(n)), 0);
}

export function safeDivision(...nums: any[]): number {
  const [numerator, ...denominators] = nums;
  const denominator = denominators?.reduce((acc, n) => (acc *= safeNumber(n)), 1);

  return denominator === 0 ? 0 : numerator / denominator;
}

export function safeMultiply(...nums: any[]): number {
  return nums?.reduce((acc, n) => (acc *= safeNumber(n)), 1);
}
