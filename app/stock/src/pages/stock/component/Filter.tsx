import DrawerForm from 'edk/src/components/DrawerForm';
import useDrawerForm from 'edk/src/components/DrawerForm/useDrawerForm';
import { WithSuccess } from 'edk/src/Interface/Container';

import { Button, Form, Typography } from 'antd';

import { fields, Filter, tooltipMap } from '../../../model';
import EdiTable, { EdiTableColumnType } from 'edk/src/components/EdiTable';
import shouldUpdateHOF from 'edk/src/decorators/shouldUpdateHOF';
import isValidValue from 'edk/src/utils/isValidValue';
import Options from 'edk/src/utils/Options';
import SearchSelect from 'edk/src/components/SearchSelect';
import ConditionEditor from './ConditionEditor';
import { renderCondition } from './ConditionEditor/util';
import { decode, encode } from '@/utils/json';

const { Item, ErrorList } = Form;
const { Link } = Typography;

const columns: EdiTableColumnType<Filter>[] = [
  {
    title: '字段',
    renderFormItem: ({ field }) => (
      <Item noStyle shouldUpdate={shouldUpdateHOF(['filters'])}>
        {({ getFieldValue }) => {
          const filters = getFieldValue('filters'),
            usedInOther = filters?.reduce(
              (acc: any[], filter: any, idx: number) =>
                idx !== field.name ? acc?.concat(filter?.field) : acc,
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
    width: 200,
    title: '过滤条件',
    renderFormItem: ({ field }) => (
      <Item dependencies={[['filters', field.name, 'filter']]} noStyle key={field.key}>
        {({ getFieldValue }) => (
          <Item {...field} name={[field.name, 'filter']}>
            <ConditionEditor>
              <div>
                {renderCondition(getFieldValue(['filters', field.name, 'filter']))}{' '}
                <Link>编辑条件</Link>
              </div>
            </ConditionEditor>
          </Item>
        )}
      </Item>
    ),
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
    const { filters } = await formProps?.form?.validateFields();
    await onSuccess(filters);
    localStorage.setItem('Filter', encode(filters));
    setDrawerProps((pre) => ({ ...pre, open: false }));
  }
  function onClose() {
    setDrawerProps((pre) => ({ ...pre, open: false }));
  }

  return (
    <DrawerForm
      formProps={{
        ...formProps,
        initialValues: { filters: decode(localStorage.getItem('Filter')) },
        onFinish,
      }}
      drawerProps={{ ...drawerProps, onOk: onFinish, onClose: onClose, title: '计算指标' }}
    >
      <EdiTable
        tableProps={{ columns }}
        formListProps={{
          name: 'filters',
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
            <Button type="link" onClick={() => operation.add()}>
              {' '}
              + 添加字段
            </Button>
          </>
        )}
      </EdiTable>
    </DrawerForm>
  );
};
