/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-16 11:20:27
 * @FilePath: /yuzhou/util/edk/src/struct/tree/dfs/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export default function dfs<T extends { [key: string]: T[] | any }>(
  tree: T,
  child: keyof T,
  finder: (tree: T, pTree?: T) => boolean,
  pTree?: T,
): T | undefined {
  if (finder(tree, pTree)) {
    return tree;
  }

  let res;
  const children: T[] = tree?.[child] ?? [];

  for (const node of children) {
    res = dfs(node, child, finder, tree);
    if (res) break;
  }

  return res;
}

export function dfsMap<T extends { [key: string]: T[] | any }, P extends T = T>(
  tree: T,
  child: keyof T,
  mapper: (tree: T, pTree?: T) => P,
  pTree?: T,
): P {
  const newTree: P = mapper(tree, pTree),
    children: T[] = newTree?.[child] ?? [];

  for (let i = 0; i < children?.length; i++) {
    const node = children?.[i];
    children[i] = dfsMap(node, child, mapper, newTree);
  }

  return newTree;
}

export function deepMap(node: any, mapper: any) {
  if (typeof node !== 'object') return node;
  const newNode: any = Array.isArray(node) ? [] : {};

  for (const [k, v] of Object.entries(node)) {
    newNode[k] = deepMap(mapper(v), mapper);
  }

  return newNode;
}
