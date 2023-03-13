import {  restful, axios } from 'edk/src/utils/http'
import { TagSchema } from '../models';


export const add = <T, R, D>(...payload: [data?: D, opt?: axios.AxiosRequestConfig<D>]) => {
    return restful.post<T, R, D>('time-mgt/v1/tag/create', ...payload);
}

export const remove = <T, R, D>(payload: string, cfg?: axios.AxiosRequestConfig<D>) => {
    return restful.delete<T, R, D>(`time-mgt/v1/tag/${payload}`, cfg);
}

export const update = <T, R, D>(...payload: [data?: D, opt?: axios.AxiosRequestConfig<D>]) => {
    return restful.put<T, R, D>('time-mgt/v1/tag/update', ...payload);
}

export const page = (payload?: axios.AxiosRequestConfig)=> restful.get<TagSchema[]>('time-mgt/v1/tag/list', {
  notify: 'fail',
  ...payload,
})
