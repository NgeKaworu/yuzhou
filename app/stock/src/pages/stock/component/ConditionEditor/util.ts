import { ConditionEditorData } from '.';
import { Condition, OperatorSymbolMap } from './model';

export const encodeCondition = ({ left, right, operator }: Condition): string => {
  const l = typeof left === 'object' ? encodeCondition(left) : left,
    r = typeof right === 'object' ? encodeCondition(right) : right;
  return `( ${l ?? ''} ${OperatorSymbolMap.get(operator) ?? ''} ${r ?? ''} )`;
};

export const renderCondition = (condition: ConditionEditorData<any>): string =>
  typeof condition === 'object' ? encodeCondition(condition as Condition) : condition;

export function interpolationCondition<D = any>(
  { left, right, operator }: Condition<D>,
  field: string,
  interpolation: D,
): Condition<D> {
  const l =
      typeof left === 'object'
        ? interpolationCondition(left as Condition, field, interpolation)
        : left,
    r =
      typeof right === 'object'
        ? interpolationCondition(right as Condition, field, interpolation)
        : right;
  return {
    left: typeof l === 'string' && l === field ? interpolation : l,
    operator,
    right: typeof r === 'string' && r === field ? interpolation : r,
  };
}

export function convert2Number({ left, right, operator }: Condition): Condition {
  const l = typeof left === 'object' ? convert2Number(left) : left,
    r = typeof right === 'object' ? convert2Number(right) : right;

  return {
    left: safeNumber(l),
    operator,
    right: safeNumber(r),
  };
}

export function safeNumber(n: string | number) {
  if (typeof n === 'string' || typeof n === 'number') {
    const r = Number(n);
    if (!isNaN(r)) return r;
  }
  return n;
}
