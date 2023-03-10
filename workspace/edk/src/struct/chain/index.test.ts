/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-06 14:55:59
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-11 02:10:12
 * @FilePath: /yuzhou/workspace/edk/src/struct/chain/index.test.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import Chain from '.';

interface Node {
  next?: Node;
  value?: number;
}

describe('chian test', () => {
  class TestChain extends Chain<Node> {
    toString() {
      let s = '';
      for (const c of this) {
        s += c?.value;
      }
      return s;
    }
  }

  it('constructor test', () => {
    const n1: Node = {};
    const n2: Node = {};
    const n3: Node = {};

    const c = new TestChain(n1, n2, n3);
    return expect(c.Find((i) => i === n1)?.next).toBe(n2);
  });

  it('constructor empty test', () => {
    const n1: Node = {};
    const n2: Node = {};
    const n3: Node = {};

    const c = new TestChain();
    return expect(c.length).toBe(0);
  });

  it('find test', () => {
    const n1: Node = {};
    const n2: Node = {};
    const n3: Node = {};

    const c = new TestChain(n1);
    expect(c.Find((i) => i === n1)).toBe(n1);
  });

  it('append test', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };

    const c = new TestChain(n1);
    c.Append(n1, n2);
    expect(c.Find((i) => i === n1)?.next).toBe(n2);
  });

  it('append multi test', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };

    const c = new TestChain(n1);
    c.Append(n1, n2, n3);
    expect(c.Find((i) => i === n2)?.next).toBe(n3);
  });

  it('append multi without head test', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };
    const n4: Node = { value: 4 };

    const c = new TestChain(n1, n2);
    c.Append(n2, n3, n4);

    expect(c.Find((i) => i === n3)?.next).toBe(n4);
  });

  it('prepend test', () => {
    const n1: Node = {};
    const n2: Node = {};
    const n3: Node = {};

    const c = new TestChain(n1);
    c.Prepend(n1, n3);
    expect(c.Find((i) => i === n3)?.next).toBe(n1);
  });

  it('prepend multi test', () => {
    const n1: Node = {};
    const n2: Node = {};
    const n3: Node = {};

    const c = new TestChain(n1);
    c.Prepend(n1, n2, n3);
    expect(c.Find((i) => i === n2)?.next).toBe(n3);
  });

  it('prepend without head test', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };
    const n4: Node = { value: 4 };
    const n5: Node = { value: 5 };

    const c = new TestChain(n1, n2, n3);
    c.Prepend(n2, n4, n5);
    expect(c.Find((i) => i === n5)?.next).toBe(n2);
    expect(c.Find((i) => i === n1)?.next).toBe(n4);
  });

  it('remove test', () => {
    const n1: Node = {};
    const n2: Node = {};
    const n3: Node = {};

    const c = new TestChain(n1);
    c.Remove(n1);
    expect(c.Find((i) => i === n1)).toBe(null);
  });

  it('remove without head test', () => {
    const n1: Node = {};
    const n2: Node = {};
    const n3: Node = {};

    const c = new TestChain(n1, n2, n3);
    c.Remove(n2);
    expect(c.Find((i) => i === n2)).toBe(null);
  });

  it('reverse test', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };

    const c = new TestChain(n1, n2, n3);

    expect(c.Reverse().toString()).toBe('321');
  });
  it('not find', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };

    const c = new TestChain(n2);

    expect(() => {
      c.Append(n1, n3);
    }).toThrowError(new Error('target node not in this chain'));
  });
  it('AppendChain not find', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };

    const c = new TestChain(n2);

    expect(() => {
      c.AppendChain(n1, new TestChain(n3));
    }).toThrowError(new Error('target node not in this chain'));
  });
  it('Append not find', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };

    const c = new TestChain(n2);

    expect(() => {
      c.Append(n1, n3);
    }).toThrowError(new Error('target node not in this chain'));
  });
  it('Prepend not find', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };

    const c = new TestChain(n2);

    expect(() => {
      c.Prepend(n1, n3);
    }).toThrowError(new Error('target node not in this chain'));
  });
  it('PrependChain not find', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };

    const c = new TestChain(n2);

    expect(() => {
      c.PrependChain(n1, new TestChain(n3));
    }).toThrowError(new Error('target node not in this chain'));
  });

  it('remove not find', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };

    const c = new TestChain(n2, n3);

    expect(() => {
      c.Remove(n1);
    }).toThrowError(new Error('target node not in this chain'));
  });

  it('prepend empty chian test', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };
    const n4: Node = { value: 4 };
    const n5: Node = { value: 5 };

    const c = new TestChain(n1, n2, n3);
    c.PrependChain(n1, new TestChain());
    expect(c.length).toBe(3);
  });
  
  it('append empty chian test', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };
    const n4: Node = { value: 4 };
    const n5: Node = { value: 5 };

    const c = new TestChain(n1, n2, n3);
    c.AppendChain(n1, new TestChain());
    expect(c.length).toBe(3);
  });

  it('Reverse Empty', () => {
    const c = new TestChain();

    expect(c.Reverse()).toEqual(c.Reverse());
  });

  it('append chian without head test', () => {
    const n1: Node = { value: 1 };
    const n2: Node = { value: 2 };
    const n3: Node = { value: 3 };
    const n4: Node = { value: 4 };
    const n5: Node = { value: 5 };

    const c = new TestChain(n1, n2, n3);
    c.AppendChain(n2, new TestChain(n4, n5));
    expect(c.toString()).toBe('12453');
  });
});
