/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-11 02:09:11
 * @FilePath: /yuzhou/workspace/edk/src/struct/chain/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export interface Node {
  next?: Node;
}

export default class Chain<N extends { next?: N }> {
  protected head: N | undefined;
  protected last: N | undefined;

  public length = 0;

  constructor(...n: (N | undefined)[]) {
    const l = n.length;
    if (l <= 0) return this;

    this.length = l;
    for (let i = 1; i < l; i++) {
      const ptr = n[i - 1];
      if (ptr !== undefined) {
        ptr.next = n[i];
      }
    }

    this.head = n?.[0];
    this.last = n?.[l - 1];
  }

  [Symbol.iterator] = () => {
    let ptr = this.head;
    return {
      next: () => {
        if (ptr) {
          const value = ptr;
          ptr = ptr.next;
          return {
            value,
            done: false,
          };
        } else {
          return { done: true };
        }
      },
    };
  };

  public Find = <F extends (head: Chain<N>['head']) => boolean>(picker: F): N | null => {
    for (const i of this) {
      if (i && picker(i) === true) return i;
    }
    return null;
  };

  public Append = (t: N, ...n: N[]) => {
    if (this.Find((i) => i === t) == null) throw new Error('target node not in this chain');

    const c = new Chain(...n);
    this.AppendChain(t, c);

    return this;
  };

  public AppendChain = (t: N, c: Chain<N>) => {
    if (this.Find((i) => i === t) == null) throw new Error('target node not in this chain');
    const l = c.length;
    if (l === 0) return this;

    this.length += l;

    c.last!.next = t.next;
    t.next = c.head;

    return this;
  };

  public Prepend = (t: N, ...n: N[]) => {
    if (this.Find((i) => i === t) == null) throw new Error('target node not in this chain');

    const c = new Chain(...n);
    this.PrependChain(t, c);

    return this;
  };

  public PrependChain = (t: N, c: Chain<N>) => {
    if (this.Find((i) => i === t) == null) throw new Error('target node not in this chain');
    const l = c.length;
    if (l === 0) return this;

    this.length += l;

    if (t === this.head) {
      c.last!.next = t;
      this.head = c.head;
    } else {
      const pre = this.Find((i) => i?.next === t);
      c.last!.next = t;
      pre!.next = c.head;
    }

    return this;
  };

  public Remove = (t: N) => {
    if (this.Find((i) => i === t) == null) throw new Error('target node not in this chain');

    if (t === this.head) {
      this.head = this?.head?.next;
    } else {
      const pre = this.Find((i) => i?.next === t);
      pre!.next = pre?.next?.next;
    }

    return this;
  };

  public Reverse() {
    if (null == this.head || null == this.head.next) return this;

    let p = this.head.next;
    this.head.next = void 0;
    let tmp;

    while (p) {
      tmp = p.next;
      p.next = this.head;
      this.head = p;
      p = tmp!;
    }

    return this;
  }
}
