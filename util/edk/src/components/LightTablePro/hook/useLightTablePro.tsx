/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-14 23:42:22
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-14 23:53:03
 * @FilePath: /yuzhou/util/edk/src/components/LightTablePro/hook/useLightTablePro.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import Scope from '../../../';
const { useRef } = Scope.react;
import type { FormInstance } from 'antd';
import type { ActionRef } from '..';

export interface InitValue {
  actionRef?: ActionRef;
  formRef?: FormInstance;
}

export default (initValue?: InitValue) => {
  // ProTable 实例
  const actionRef = useRef<ActionRef | undefined>(initValue?.actionRef);
  // ProTable 搜索栏实例
  const formRef = useRef<FormInstance | undefined>(initValue?.formRef);

  return {
    actionRef,
    formRef,
  };
};
