/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-14 23:42:22
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-17 00:20:34
 * @FilePath: /yuzhou/util/edk/src/decorators/Select/SearchAsync.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import Scope from '../../';
const { cloneElement, useReducer } = Scope.react;
import useDebounce from '../../hooks/useDebounce';
import useThrottle from '../../hooks/useThrottle';
import type { Select } from 'antd';
const { Empty, Spin } = Scope.antd;

import type { useQuery } from '@tanstack/react-query';

import { curry } from '../utils';

export type LIMIT_TYPE = 'debounce' | 'throttle';

export interface SearchAsyncParam {
  delay?: number;
  limitType?: LIMIT_TYPE;
  query: (value: any) => ReturnType<typeof useQuery>;
  reducer?: () => ReturnType<typeof useReducer>;
  trigger?: string[];
}

export const DefaultReducer = () =>
  useReducer((state: any, action: any) => {
    switch (action.type) {
      case 'onSearch':
        return action.payload[0];
      case 'onDeselect':
        return ' ';
      default:
        return state;
    }
  }, '');
/**
 * api搜索切片
 */

export default curry(
  (
    {
      delay = 800,
      limitType = 'throttle',
      query,
      reducer = DefaultReducer,
      trigger = ['onSearch', 'onDeselect'],
    }: SearchAsyncParam,
    Element: ReturnType<typeof Select>,
  ) => {
    const [state, dispatch] = reducer();
    const { data: options, isLoading: loading } = query(state);

    function useDispatch(event: any) {
      const fn = (...args: any) => {
        dispatch?.({ type: event, payload: args });
        Element?.props?.[event]?.(...args);
      };
      return {
        debounce: useDebounce(fn, delay),
        throttle: useThrottle(fn, delay),
      }[limitType];
    }

    return cloneElement(Element, {
      showSearch: true,
      filterOption: false,
      notFoundContent: loading ? <Spin style={{ width: '100%' }} tip="loading..." /> : <Empty />,
      options,
      loading,
      ...trigger?.reduce(
        (acc, event) => ({
          ...acc,
          [event]: useDispatch(event),
        }),
        {},
      ),
    });
  },
);
