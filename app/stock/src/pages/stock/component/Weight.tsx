import DrawerForm from 'edk/src/components/DrawerForm';
import useDrawerForm from 'edk/src/components/DrawerForm/useDrawerForm';
import { WithSuccess } from 'edk/src/Interface/Container';

import { Button, Form, InputNumber, Switch, Typography } from 'antd';

import { fields, tooltipMap, Weight } from '../../../model';
import EdiTable, { EdiTableColumnType } from 'edk/src/components/EdiTable';
import shouldUpdateHOF from 'edk/src/decorators/shouldUpdateHOF';
import isValidValue from 'edk/src/utils/isValidValue';
import Options from 'edk/src/utils/Options';
import SearchSelect from 'edk/src/components/SearchSelect';
import { decode, encode } from '@/utils/json';

const { Item, ErrorList } = Form;
const { Link } = Typography;

const columns: EdiTableColumnType<Weight>[] = [
  {
    title: '权重系数',
    width: 120,
    renderFormItem: ({ field }) => (
      <Item {...field} name={[field.name, 'coefficient']}>
        <InputNumber step={0.1} />
      </Item>
    ),
  },
  {
    title: '字段',
    renderFormItem: ({ field }) => (
      <Item noStyle shouldUpdate={shouldUpdateHOF(['weights'])}>
        {({ getFieldValue }) => {
          const weights = getFieldValue('weights'),
            usedInOther = weights?.reduce(
              (acc: any[], weight: any, idx: number) =>
                idx !== field.name ? acc?.concat(weight?.field) : acc,
              [],
            );

          return (
            <Item
              {...field}
              name={[field.name, 'field']}
              rules={[{ required: true, message: '计算字段不能为空' }]}
            >
              <SearchSelect
                allowClear
                options={Options(fields).toOpt?.map((opt: any) => ({
                  ...opt,
                  label: (
                    <>
                      {`${opt.value} - ${opt.label}`} {tooltipMap.get(opt.value)}
                    </>
                  ),
                  disabled: usedInOther?.includes(opt?.value),
                }))}
              />
            </Item>
          );
        }}
      </Item>
    ),
  },
  {
    width: 120,
    title: '是否生序',
    renderFormItem: ({ field }) => {
      return (
        <Item {...field} name={[field.name, 'isAsc']} valuePropName="checked">
          <Switch />
        </Item>
      );
    },
  },
  {
    width: 120,
    title: '操作',
    renderFormItem: ({ field, operation }) => (
      <Item {...field}>
        <Link type="danger" onClick={() => operation.remove(field.name)}>
          删除
        </Link>
      </Item>
    ),
  },
];

export default ({
  onSuccess,
  formProps,
  drawerProps,
  setDrawerProps,
}: WithSuccess<ReturnType<typeof useDrawerForm>>) => {
  async function onFinish() {
    const { weights } = await formProps?.form?.validateFields();
    await onSuccess(weights);
    localStorage.setItem('Weight', encode(weights));
    setDrawerProps((pre) => ({ ...pre, open: false }));
  }
  function onClose() {
    setDrawerProps((pre) => ({ ...pre, open: false }));
  }

  return (
    <DrawerForm
      formProps={{
        ...formProps,
        initialValues: { weights: decode(localStorage.getItem('Weight')) },
        onFinish,
      }}
      drawerProps={{ ...drawerProps, onOk: onFinish, onClose: onClose, title: '计算指标' }}
    >
      <EdiTable
        tableProps={{
          columns,
          rowKey: (r) => {
            return r?.field ?? Math.random();
          },
        }}
        formListProps={{
          name: 'weights',
          rules: [
            {
              validator(_, value) {
                if (isValidValue(value)) return Promise.resolve();
                return Promise.reject(new Error('至少一条'));
              },
            },
          ],
        }}
      >
        {({ body, meta, operation }) => (
          <>
            <ErrorList errors={meta.errors} />
            {body}
            <Button type="link" onClick={() => operation.add({ isAsc: true, coefficient: 1 })}>
              {' '}
              + 添加字段
            </Button>
          </>
        )}
      </EdiTable>
    </DrawerForm>
  );
};
