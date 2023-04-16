/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-04-10 14:44:24
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-04-10 14:44:27
 * @FilePath: /yuzhou/util/edk/src/hooks/useCoolDownSimple.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { useState, useRef, useEffect } from 'react'
export interface CoolDownParams {
  interval?: number
  count: number
  step?: number
  onCoolDown?: () => void
}

export enum STATUS {
  'STOP',
  'RUN',
}

export function encodeCoolDown(count: number, endAt: number, status: STATUS) {
  return [count, endAt, status]?.join()
}

export default ({
  count,
  interval = 1000,
  step = 1,
  onCoolDown,
}: CoolDownParams) => {
  const onCoolDownRef = useRef(onCoolDown)
  useEffect(() => {
    onCoolDownRef.current = onCoolDown
  }, [onCoolDown])
  const [remaining, setRemaining] = useState(count),
    timer = useRef<ReturnType<typeof setTimeout>>(),
    cooling = remaining !== count

  function loop(pre: number) {
    const n = pre - step
    if (n <= 0) {
      stop()
      onCoolDownRef?.current?.()
    } else {
      setRemaining(n)
      timer.current = setTimeout(() => loop(n), interval)
    }
  }
  const tools = { start, stop }

  function start(c = count) {
    if (timer.current === void 0) {
      loop(c)
    }
    return tools
  }

  function stop() {
    timer.current && clearTimeout(timer.current)
    timer.current = void 0
    setRemaining(count)
    return tools
  }

  return { remaining, start, stop, cooling }
}
