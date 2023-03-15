import { useState } from 'react';
import { Button, Input } from 'antd';
import ConditionEditor, { ConditionEditorData } from './stock/component/ConditionEditor';
import {
  convert2Number,
  interpolationCondition,
  renderCondition,
} from './stock/component/ConditionEditor/util';
import { Condition, conditionParse, Operator } from './stock/component/ConditionEditor/model';

export default () => {
  const [value, setValue] = useState<ConditionEditorData<any>>({
    left: {
      left: '$this',
      operator: Operator.GT,
      right: 0,
    },
    operator: Operator.OR,
    right: {
      left: '$this',
      operator: Operator.EQ,
      right: -10,
    },
  });

  const [current, setCurrent] = useState<number>();

  return (
    <>
      条件编辑器
      <br />
      {renderCondition(value)}{' '}
      <ConditionEditor value={value} onChange={setValue}>
        <Button>编辑条件</Button>
      </ConditionEditor>
      <Input value={current} onChange={(e) => setCurrent(+e.currentTarget.value)} />
      current is match rules?{' '}
      {String(
        conditionParse(
          convert2Number(interpolationCondition(value as Condition, '$this', current)),
        ),
      )}
    </>
  );
};
