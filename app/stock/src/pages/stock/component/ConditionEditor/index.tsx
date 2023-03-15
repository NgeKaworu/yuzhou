import { isValidElement, cloneElement, PropsWithChildren, useEffect, useState } from 'react';
import {
  Input,
  Space,
  Modal,
  ModalProps,
  Tabs,
  InputProps,
  Select,
  ButtonProps,
  Typography,
  message,
  Divider,
} from 'antd';
import { Condition, OperatorMap } from '@/pages/stock/component/ConditionEditor/model';
import { compose } from '@/js-sdk/decorators/utils';
import Search from '@/js-sdk/decorators/Select/Search';
import Options from '@/js-sdk/utils/Options';
import isValidValue from '@/js-sdk/utils/isValidValue';
import { renderCondition } from './util';

const { TabPane } = Tabs;
const { Link, Text } = Typography;

export type ConditionEditorData<D> = Partial<D | Condition<D>>;

export interface ConditionEditorProps<D = any> {
  value?: ConditionEditorData<D>;
  onChange?: (v: ConditionEditorData<D>) => void;
  buttonProps?: ButtonProps;
}

type INPUT_TYPE = 'normal' | 'left' | 'right' | 'operator';

export default function ConditionEditor<D = any>({
  value,
  onChange,
  children,
}: PropsWithChildren<ConditionEditorProps<D>>) {
  const [data, setData] = useState<ConditionEditorData<D>>();

  const [modal, setModal] = useState<ModalProps>();

  useEffect(() => {
    setData(value);
  }, [value, modal?.visible]);

  const [activeKey, setActiveKey] = useState<string>();

  function onShow() {
    setModal((pre) => ({ ...pre, visible: true }));
  }

  function onHide() {
    setModal((pre) => ({ ...pre, visible: false }));
  }

  function onOk() {
    if (!data || Object.values(data)?.some((v) => !isValidValue(v)))
      message.error('所有字段均不能为空');
    if (data) {
      onChange?.(data);
      setModal((pre) => ({ ...pre, visible: false }));
    }
  }

  function onChangeHOF(field: INPUT_TYPE) {
    return (e: any) => {
      setData((pre) => (typeof pre !== 'object' ? { [field]: e } : { ...pre, [field]: e }));
    };
  }

  const onInputChange: InputProps['onChange'] = (e) =>
    setData(e.currentTarget.value as ConditionEditorData<D>);

  function pack(d: string) {
    return () => {
      setData((pre) => ({ [d]: pre }));
      setActiveKey('表达式');
    };
  }

  function extract(d: string) {
    return () => {
      setData((pre: any) => pre?.[d]);
    };
  }

  return (
    <>
      {isValidElement(children) && cloneElement(children, { onClick: onShow })}

      <Modal {...modal} width={800} title="编辑条件" onCancel={onHide} onOk={onOk}>
        <Link onClick={pack('left')}>提取到表达式左值</Link>
        <Divider type="vertical" />
        <Link onClick={pack('right')}>提取到表达式右值</Link>

        <Divider type="vertical" />

        <Link onClick={extract('left')}>用左值覆盖当前</Link>
        <Divider type="vertical" />
        <Link onClick={extract('right')}>用右值覆盖当前</Link>

        <Tabs
          defaultActiveKey={typeof data === 'object' ? '表达式' : '一般值'}
          activeKey={activeKey}
          onChange={setActiveKey}
        >
          <TabPane tab="一般值" key="一般值">
            <Input
              placeholder="一般值"
              value={data as string | undefined}
              onChange={onInputChange}
            />
          </TabPane>

          <TabPane tab="表达式" key="表达式">
            <Space>
              <ConditionEditor
                value={(data as Condition<string> | undefined)?.left}
                onChange={onChangeHOF('left')}
              >
                <Text>
                  <Link>左值：</Link>
                  {renderCondition((data as Condition<any>)?.left)}
                </Text>
              </ConditionEditor>

              {compose(Search)(
                <Select
                  placeholder="运算符"
                  value={(data as Condition<string> | undefined)?.operator}
                  options={Options(OperatorMap).toOpt}
                  onChange={onChangeHOF('operator')}
                />,
              )}

              <ConditionEditor
                value={(data as Condition<string> | undefined)?.right}
                onChange={onChangeHOF('right')}
              >
                <Text>
                  <Link>右值：</Link>
                  {renderCondition((data as Condition<any>)?.right)}
                </Text>
              </ConditionEditor>
            </Space>
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
}
