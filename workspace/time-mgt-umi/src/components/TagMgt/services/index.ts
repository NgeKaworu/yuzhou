import { CustomRequestConfig, restful } from '@/js-sdk/utils/http'


export const add = <T, R, D>(...payload: [data?: D, opt?: CustomRequestConfig<D>]) => {
    return restful.post<T, R, D>('time-mgt/v1/tag/create', ...payload);
}

export const remove = <T, R, D>(payload: string, cfg?: CustomRequestConfig<D>) => {
    return restful.delete<T, R, D>(`time-mgt/v1/tag/${payload}`, cfg);
}

export const update = <T, R, D>(...payload: [data?: D, opt?: CustomRequestConfig<D>]) => {
    return restful.put<T, R, D>('time-mgt/v1/tag/update', ...payload);
}

export const page = <T, R, D>(payload?: CustomRequestConfig<D>) => {
    return restful.get<T, R, D>('time-mgt/v1/tag/list', {
        notify: 'fail',
        ...payload,
    })
}