import { Stock } from '.';

export default interface Position {
  code: string; //ID
  stock: Stock; // stock
  totalShare: number; // 总股份
  totalCapital: number; // 总投入
  totalDividend: number; // 总派息
  stopProfit: number; // 止盈点
  stopLoss: number; // 止损点
  createAt: Date; // 创建时间
  updateAt: Date; // 更新时间
}
