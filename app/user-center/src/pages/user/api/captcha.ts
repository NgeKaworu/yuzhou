import { Tail } from '@/js-sdk/decorators/type';
import { restful } from '@/js-sdk/utils/http';

export const fetchCaptcha = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get(`user-center/captcha/fetch`, ...args);

export const checkCaptcha = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get(`user-center/captcha/check`, ...args);
