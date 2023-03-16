import Perm from '@/model/Perm';
import { ReactNode } from 'react';

export interface PermOpt extends Perm {
  label: ReactNode;
  value: Perm['id'];
  children?: PermOpt[];
  genealogy?: Perm['id'][];
}

export function _perm2Tree(
  origin: Perm[],
  pNode?: PermOpt,
): { matched: PermOpt[]; mismatched: PermOpt[] } {
  let _matched: PermOpt[] = [],
    _mismatched: PermOpt[] = [];

  for (const p of origin) {
    let opt: PermOpt = {
      ...p,
      label: p.name,
      value: p.id,
      genealogy: (pNode?.genealogy ?? []).concat(p.id),
    };
    if (p.pID === pNode?.id) {
      _matched.push(opt);
    } else {
      _mismatched.push(opt);
    }
  }

  let solution: PermOpt[] = [];

  for (const match of _matched) {
    let { matched, mismatched } = _perm2Tree(_mismatched, match);
    solution.push({ ...match, children: matched });
    _mismatched = mismatched;
  }

  return {
    matched: solution,
    mismatched: _mismatched,
  };
}

export default (origin?: Perm[]) => _perm2Tree(origin ?? []).matched;
