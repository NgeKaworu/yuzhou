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
}
