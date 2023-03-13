import { Tail } from 'edk/src/decorators/type';
import { restful } from 'edk/src/utils/http';
import { Res } from 'edk/src/utils/http/type';
import User from '@/model/User';

export const create = (...args: Tail<Parameters<typeof restful.post>>) =>
  restful.post('user-center/user/create', ...args);
export const deleteOne = (id: string, ...args: Tail<Parameters<typeof restful.delete>>) =>
  restful.delete(`user-center/user/remove/${id}`, ...args);
export const update = (...args: Tail<Parameters<typeof restful.put>>) =>
  restful.put('user-center/user/update', ...args);
export const list = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get<Res<User[]>, Res<User[]>>('user-center/user/list', ...args);

export const validateKey = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get<Res<User[]>, Res<User[]>>(`user-center/user/validate`, ...args);
