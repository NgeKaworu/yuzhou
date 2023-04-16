/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-15 10:04:53
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-04-16 23:06:54
 * @FilePath: /yuzhou/app/flashcard/src/models/record.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export interface Record {
  _id: string;
  cooldownAt: Date;
  createAt: Date;
  exp: number;
  inReview: boolean;
  reviewAt: Date;
  source: string;
  translation: string;
  uid: string;
  updateAt: Date;
  tag: string;
}
