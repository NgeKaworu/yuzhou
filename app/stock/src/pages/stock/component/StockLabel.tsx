import { Stock } from '@/model';

/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-26 13:37:16
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-26 14:01:03
 * @FilePath: /stock/stock-umi/src/pages/stock/component/StockLabel.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

export default ({ stock: { bourse, code, name } }: { stock: Stock }) => (
  <>
    <a href={`https://quote.eastmoney.com/${bourse}${code}.html#fullScreenChart`} target="_blank">
      {bourse}
      {code}
    </a>{' '}
    <a href={`https://www.google.com/search?q=${name}&oq=${name}`} target="_blank">
      {name}
    </a>
  </>
);
