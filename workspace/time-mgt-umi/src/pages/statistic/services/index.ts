import { restful, CustomRequestConfig } from "@/js-sdk/utils/http"

export function page<T, R, D>(data?: D, opt?: CustomRequestConfig<D>) {
    return restful.post<T, R, D>('time-mgt/v1/record/statistic', data, {
        notify: 'fail',
        ...opt
    });
}
