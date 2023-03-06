/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-05 20:12:55
 * @FilePath: /monorepo-lab/workspace/edk/hooks/useURLSearch.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import moment from 'dayjs';
import { useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Param<T extends any = any> {
  key: string;
  onURLSearchChange: (v?: T) => void;
  reviver?: (this: any, key: string, value: any) => any;
  replacer?: (this: any, key: string, value: any) => any;
}

const _reviver: Param['reviver'] = (_, v) => {
  //  moment 处理 ISO 8601 -> moment
  if (/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(v)) {
    return moment(v);
  }
  return v;
};

const _replacer: Param['replacer'] = (_, v) => {
  if (moment.isDayjs(v)) {
    return v?.toISOString();
  }
  return v;
};

export default <T extends any = any>({
  key,
  reviver = _reviver,
  replacer = _replacer,
  onURLSearchChange,
}: Param<T>) => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const _key = `_${key}`;
  const pParams = new URLSearchParams(search);
  const params = pParams.get(_key);

  useLayoutEffect(() => {
    let v;
    if (params) {
      try {
        v = JSON.parse(params, reviver);
      } catch (e) {
        console.error('search form json 格式错误');
      }
    }

    onURLSearchChange?.(v);
  }, [params, _key]);

  function setURLSearch(values?: T) {
    if (values) {
      const json = JSON.stringify(values, replacer);
      if (pParams.get(_key) !== json) {
        pParams.set(_key, json);
        navigate({
          pathname,
          search: `?${pParams}`,
        });
      }
    }

    if (!values && pParams.get(_key)) {
      pParams.delete(_key);
      navigate({
        pathname,
        search: `?${pParams}`,
      });
    }
  }

  return { setURLSearch };
};
