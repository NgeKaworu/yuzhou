export interface Condition<D = any> {
  left: D | Condition<D>;
  operator: Operator;
  right: D | Condition<D>;
}

export enum Operator {
  AND, // 与
  OR, // 或
  NE, // 非
  EQ, // 等于
  LT, // 小于
  GT, // 大于
  GTE, // 大于等于
  LTE, // 小于等于
}

export const OperatorMap = new Map<Operator, string>([
  [Operator.AND, '与'], // 与
  [Operator.OR, '或'], // 或
  [Operator.NE, '不等于'], // 非
  [Operator.EQ, '等于'], // 等于
  [Operator.LT, '小于'], // 小于
  [Operator.GT, '大于'], // 大于
  [Operator.GTE, '大于等于'], // 大于等于
  [Operator.LTE, '小于等于'], // 小于等于
]);

export const OperatorSymbolMap = new Map<Operator, string>([
  [Operator.AND, '&&'], // 与
  [Operator.OR, '||'], // 或
  [Operator.NE, '!=='], // 非
  [Operator.EQ, '==='], // 等于
  [Operator.LT, '<'], // 小于
  [Operator.GT, '>'], // 大于
  [Operator.GTE, '>='], // 大于等于
  [Operator.LTE, '<='], // 小于等于
]);

// 递归解析
export function conditionParse({ left, right, operator }: Condition): boolean {
  const l = typeof left !== 'object' ? left : conditionParse(left),
    r = typeof right !== 'object' ? right : conditionParse(right);

  switch (operator) {
    case Operator.AND:
      return l && r;
    case Operator.OR:
      return l || r;
    case Operator.NE:
      return l !== r;
    case Operator.EQ:
      return l === r;
    case Operator.LT:
      return l < r;
    case Operator.GT:
      return l > r;
    case Operator.GTE:
      return l >= r;
    case Operator.LTE:
      return l <= r;
  }
}
