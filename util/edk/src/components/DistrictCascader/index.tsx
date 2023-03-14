/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-14 23:50:16
 * @FilePath: /yuzhou/util/edk/src/components/DistrictCascader/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import Scope from '../../';
import AMap, { Config } from '../../utils/aMap/singleton/aMap';
import Plugin from '../../utils/aMap/plugin';

const { useQuery } = Scope.reactQuery;
import type { CascaderProps } from 'antd';
const { Cascader } = Scope.antd;

type Status = 'complete';
type Level = 'province' | 'country';
interface District {
  districtList: DistrictItem[];
  info: string;
}
interface DistrictItem {
  adcode: string;
  boundaries: unknown[];
  center: unknown;
  citycode: unknown[];
  districtList?: DistrictItem[];
  level: Level;
  name: string;
}

interface DistrictConfig {
  // 关键字对应的行政区级别，country表示国家
  level: Level;
  // 显示下级行政区级数，1表示返回下一级行政区
  subdistrict: number;
  extensions: string;
}

type Props<T> = CascaderProps<T> & {
  districtConfig?: DistrictConfig;
  mapConfig: Config;
};

export default <T extends any = any>({ mapConfig, districtConfig, ...cascaderProps }: Props<T>) => {
  const aMap = new AMap(mapConfig);
  const districtSearch = new Plugin('DistrictSearch', aMap, {
    // 关键字对应的行政区级别，country表示国家
    level: 'province',
    // 显示下级行政区级数，1表示返回下一级行政区
    subdistrict: 2,
    extensions: 'all',
    ...districtConfig,
  });

  const district = useQuery(
    ['district', districtConfig],
    () =>
      new Promise<District>(async (res, reject) => {
        const client = await districtSearch.Get();
        client?.search('中国', (status: Status, data: District) => {
          if (status === 'complete') return res(data);
          return reject(data);
        });
      }),
  );

  return (
    <Cascader
      {...cascaderProps}
      showSearch
      options={district?.data?.districtList?.[0]?.districtList}
      loading={district.isFetching}
      fieldNames={{ label: 'name', value: 'adcode', children: 'districtList' }}
    />
  );
};
