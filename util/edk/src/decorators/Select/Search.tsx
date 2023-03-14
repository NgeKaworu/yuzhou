/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-14 23:42:22
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-14 23:45:17
 * @FilePath: /yuzhou/util/edk/src/decorators/Select/Search.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import Scope from '../../';
import { ignoreCaseIncludes } from '../../struct/string/util';
import type React from 'react';
const { cloneElement } = Scope.react;
/**
 * 本场搜索切片
 */
export default (Select: React.ReactElement) => {
  return cloneElement(Select, {
    showSearch: true,
    filterOption: filter,
  });
};

export const filter = <Opt extends { label?: any; value?: any }>(input: string, option: Opt) =>
  ignoreCaseIncludes(option?.value, input) || ignoreCaseIncludes(option?.label, input);
