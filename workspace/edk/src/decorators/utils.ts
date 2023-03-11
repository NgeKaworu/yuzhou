/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-11 22:18:47
 * @FilePath: /yuzhou/workspace/edk/src/decorators/utils.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import type { Curry, CurryV7, Head, Last } from './type';
import { __ } from './type';

export const compose = <F extends ((...args: any) => any)[]>(
  ...fns: F
): ((...p: Parameters<Last<F>>) => ReturnType<Head<F>>) => {
  return <P extends any[]>(...args: P) =>
    fns.slice(0, -1).reduceRight(
      (pre, next) => (value) => next(pre(value)),
      (value) => value,
    )(fns?.[fns.length - 1]?.(...args));
};

export const pipe = <F extends ((...args: any) => any)[]>(
  ...fns: F
): ((...p: Parameters<Head<F>>) => ReturnType<Last<F>>) => {
  return <P extends any[]>(...args: P) =>
    fns?.slice(1).reduce(
      (pre, next) => (value) => next(pre(value)),
      (value) => value,
    )(fns?.[0]?.(...args));
};

export function curry<F extends (...args: any) => any>(func: F): Curry<F> {
  return function curried<T extends any[]>(...args: T) {
    return args.length < func.length
      ? (...args2: T) => curried?.(...args.concat(args2))
      : func?.(...args);
  };
}

export function curry_p<F extends (...args: any) => any>(func: F): CurryV7<F> {
  return function curried<T extends any[]>(...args: T) {
    return args.length >= func.length && !args.slice(0, func.length).includes(__)
      ? func?.(args)
      : // replace placeholders in args with values from newArgs
        // @ts-ignore
        (...newArgs: T) =>
          // @ts-ignore
          curried(
            ...args.map((arg) => (arg === __ && newArgs.length ? newArgs.shift() : arg)),
            ...newArgs,
          );
  };
}

export const maybe = curry((fn?: undefined | ((par: any) => any), arg?: any) => {
  const tmp = fn?.(arg);
  return ![NaN, undefined, null].includes(tmp) ? tmp : arg;
});
