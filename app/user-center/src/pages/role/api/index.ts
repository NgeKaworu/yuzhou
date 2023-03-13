import { Tail } from '@/js-sdk/decorators/type';
import { restful } from '@/js-sdk/utils/http';
import { Res } from '@/js-sdk/utils/http/type';
import Role from '@/model/Role';

export const create = (...args: Tail<Parameters<typeof restful.post>>) =>
  restful.post('user-center/role/create', ...args);
export const deleteOne = (id: string, ...args: Tail<Parameters<typeof restful.delete>>) =>
  restful.delete(`user-center/role/remove/${id}`, ...args);
export const update = (...args: Tail<Parameters<typeof restful.put>>) =>
  restful.put('user-center/role/update', ...args);
export const list = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get<Res<Role[]>, Res<Role[]>>('user-center/role/list', ...args);

export const validateKey = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get<Res<Role[]>, Res<Role[]>>(`user-center/role/validate`, ...args);
