import { Condition, conditionParse, Operator } from '.';

describe('getIn test', () => {
  it(' 0 !== 1 toBeTruthy', () => {
    const fake: Condition = {
      left: 0,
      operator: Operator.NE,
      right: 1,
    };
    expect(conditionParse(fake)).toBeTruthy();
  });

  it(' 0 === 0 toBeTruthy', () => {
    const fake: Condition = {
      left: 0,
      operator: Operator.EQ,
      right: 0,
    };
    expect(conditionParse(fake)).toBeTruthy();
  });

  it(' 0 === 1 toBeFalsy', () => {
    const fake: Condition = {
      left: 0,
      operator: Operator.EQ,
      right: 1,
    };
    expect(conditionParse(fake)).toBeFalsy();
  });

  it(' 0 > 10 || 0 < 10 toBeTruthy', () => {
    const fake: Condition = {
      left: { left: 0, operator: Operator.GT, right: 10 },
      operator: Operator.OR,
      right: { left: 0, operator: Operator.LT, right: 10 },
    };
    expect(conditionParse(fake)).toBeTruthy();
  });

  it(' 0 > 10 && (0 < 10 || 0 !== 0) toBeFalsy', () => {
    const fake: Condition = {
      left: { left: 0, operator: Operator.GT, right: 10 },
      operator: Operator.AND,
      right: {
        left: { left: 0, operator: Operator.LT, right: 10 },
        operator: Operator.OR,
        right: { left: 0, operator: Operator.NE, right: 0 },
      },
    };
    expect(conditionParse(fake)).toBeFalsy();
  });

  it(' (0 > 10 && 0 < 10) || 0 === 0 toBeTruthy', () => {
    const fake: Condition = {
      left: {
        left: { left: 0, operator: Operator.GT, right: 10 },
        operator: Operator.AND,
        right: { left: 0, operator: Operator.LT, right: 10 },
      },
      operator: Operator.OR,
      right: { left: 0, operator: Operator.EQ, right: 0 },
    };

    expect(conditionParse(fake)).toBeTruthy();
  });
});
