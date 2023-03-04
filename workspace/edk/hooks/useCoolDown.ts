import { useState, useRef, useEffect } from 'react';
export interface CoolDownParams {
  interval?: number;
  count: number;
  step?: number;
  persistenceKey?: string;
  onCoolDown?: () => void;
  depend?: {
    localStorage?: any;
  };
}

const coolDownSuffix = ':cd:suffix';
let lock = 0;

export enum STATUS {
  'STOP',
  'RUN',
}

export function encodeCoolDown(count: number, endAt: number, status: STATUS) {
  return [count, endAt, status]?.join();
}

export default ({
  count,
  interval = 1000,
  step = 1,
  persistenceKey,
  onCoolDown,
  depend = window,
}: CoolDownParams) => {

  const onCoolDownRef = useRef(onCoolDown);
  useEffect(() => {
    onCoolDownRef.current = onCoolDown;
  }, [onCoolDown])

  let localStorage = depend.localStorage,
    decodeCoolDown: any = null,
    setCoolDown: any = null,
    getCoolDown: any = null,
    clearOvertime: any = null;

  if (localStorage) {
    decodeCoolDown = (item: ReturnType<typeof localStorage.getItem>) => {
      return (item ?? ',,')?.split(',')?.map((v: any) => (v === '' ? NaN : +v)) as [
        count: number,
        endAt: number,
        status: STATUS,
      ];
    };

    setCoolDown = (key: string, value: number, endAt: number, status: STATUS = STATUS.RUN) => {
      return localStorage.setItem(`${key}${coolDownSuffix}`, encodeCoolDown(value, endAt, status));
    };

    getCoolDown = (key: string) => {
      return decodeCoolDown(localStorage.getItem(`${key}${coolDownSuffix}`));
    };

    clearOvertime = () => {
      Object.keys(localStorage)?.forEach((k) => {
        if (k.endsWith(coolDownSuffix)) {
          const [, endAt] = decodeCoolDown(localStorage.getItem(k));
          if (endAt + 24 * 60 * 60 * 1000 < Date.now()) {
            localStorage.removeItem(k);
          }
        }
      });
    };
  }

  const isPersistence = !!persistenceKey && localStorage;
  let init = count;
  if (isPersistence) {
    const [pre, endAt, status] = getCoolDown(persistenceKey);
    switch (status) {
      case STATUS.STOP:
        init = pre;
        break;
      case STATUS.RUN: {
        init = ~~((endAt - Date.now()) / (interval * step));
        init = init <= 0 ? count : init;
        break;
      }
    }
  }

  const [remaining, setRemaining] = useState(init),
    timer = useRef<NodeJS.Timeout>(),
    cooling = remaining !== count;

  useEffect(() => {
    if (isPersistence && cooling) {
      if (cooling) {
        const [, , status] = getCoolDown(persistenceKey);
        if (status === STATUS.RUN) start();
      }

      if (lock === 0) clearOvertime();
    }

    return () => {
      lock--;
    };
  }, []);

  function loop(pre: number) {
    const n = pre - step;
    if (n <= 0) {
      stop();
      onCoolDownRef?.current?.();
    } else {
      setRemaining(n);
      timer.current = setTimeout(() => loop(n), interval);
    }
  }
  const tools = { start, stop, reset, pause, restart };

  function start(c = count) {
    if (timer.current === void 0) {
      if (isPersistence) {
        setCoolDown(persistenceKey, remaining, Date.now() + (remaining / step) * interval);
      }
      loop(c);
    }
    return tools;
  }

  function pause() {
    clearTimeout(timer.current);
    timer.current = void 0;
    if (isPersistence && cooling) {
      const [, endAt] = getCoolDown(persistenceKey);
      setCoolDown(persistenceKey, remaining, endAt, STATUS.STOP);
    }
    return tools;
  }

  function renew() {
    if (timer.current === void 0) {
      if (isPersistence) {
        setCoolDown(persistenceKey, remaining, Date.now() + (remaining / step) * interval);
      }
      loop(remaining);
    }
    return tools;
  }

  function stop() {
    return pause().reset();
  }

  function reset(c = count) {
    if (timer.current !== void 0) console.warn('you need stop first')
    const safeCount = Number.isNaN(Number(c)) ? count : c;
    setRemaining(() => safeCount);
    if (isPersistence && cooling) {
      const [, , status] = getCoolDown(persistenceKey);
      setCoolDown(persistenceKey, safeCount, Date.now() + (safeCount / step) * interval, status);
    }
    return tools;
  }

  function restart(c = count) {
    return stop().start(c);
  }

  return { remaining, start, reset, stop, pause, renew, restart, cooling };
};
