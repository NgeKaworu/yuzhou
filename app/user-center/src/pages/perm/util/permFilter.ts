import { filter } from 'edk/src/decorators/Select/Search';
import dfs from 'edk/src/struct/tree/dfs';
import Perm from '@/model/Perm';
import { TreeSelectProps } from 'antd';

const permFilter: TreeSelectProps<Perm>['filterTreeNode'] = (input, treeNode) =>
  !!(treeNode && dfs(treeNode, 'children', (cur) => filter(input, cur)));

export default permFilter;
