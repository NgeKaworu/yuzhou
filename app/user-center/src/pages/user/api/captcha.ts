import { Tail } from 'edk/src/decorators/type';
import { restful } from 'edk/src/utils/http';

export const fetchCaptcha = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get(`user-center/captcha/fetch`, ...args);

export const checkCaptcha = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get(`user-center/captcha/check`, ...args);
