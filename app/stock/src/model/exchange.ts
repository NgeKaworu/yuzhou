/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:31:37
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-25 21:42:52
 * @FilePath: /stock/stock-umi/src/model/exchange.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export default interface Exchange {
  id: string;
  code: string; // 交易所代码
  createAt: Date; // 创建时间
  updateAt: Date; // 创建时间
  transactionPrice: number; // 成交价格
  currentShare: number; // 成交数量
  currentDividend: number; // 本次派息
}
