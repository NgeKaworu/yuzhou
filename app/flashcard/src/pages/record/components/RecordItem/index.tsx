import React from 'react';

import {
  Divider,
  Popconfirm,
  Button,
  theme,
  ButtonProps,
  PopconfirmProps,
} from 'antd';
import { DeleteOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';

import type { Record } from '@/models/record';
import { prefixCls as defaultPrefixCls } from '@/theme';
import { CSSInterpolation, useStyleRegister } from '@ant-design/cssinjs';
import { DerivativeToken } from 'antd/es/theme/internal';
import classNames from 'classnames';

const prefixCls = defaultPrefixCls + '-record-item';
export interface RecordItemProps {
  onClick: (id: string) => void;
  onRemoveClick: (id: string) => void;
  onEditClick: (record: Record) => void;
  record: Record;
  selected: boolean;
}

const { useToken } = theme;

export default ({
  onClick,
  onRemoveClick,
  onEditClick,
  selected,
  record,
}: RecordItemProps) => {
  const { _id, source, translation, exp: percent, tag } = record;
  function clickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    onClick(_id);
  }
  const editClickHandler: ButtonProps['onClick'] = (e) => {
    e.stopPropagation();
    onEditClick(record);
  };
  const removeClickHandler: PopconfirmProps['onConfirm'] = (e) => {
    e?.stopPropagation();
    onRemoveClick(_id);
  };

  function stopPropagation(e?: React.MouseEvent<HTMLElement, MouseEvent>) {
    e?.stopPropagation();
  }

  // 【自定义】制造样式
  const { theme, token, hashId } = useToken();

  // 全局注册，内部会做缓存优化
  const wrapSSR = useStyleRegister(
    { theme, token, hashId, path: [prefixCls] },
    () => [genStyle(token)],
  );

  return wrapSSR(
    <div
      className={classNames(`${prefixCls}-record-card`, hashId)}
      onClick={clickHandler}
    >
      <div
        className={classNames(`${prefixCls}-progress`, hashId)}
        style={{ width: `${percent}%` }}
      />
      <div
        className={classNames(
          classNames(`${prefixCls}-check`, hashId),
          selected && classNames(`${prefixCls}-selected`, hashId),
        )}
      />
      <div
        style={{
          textIndent: '2em',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
        onClick={clickHandler}
      >
        {source}
      </div>
      <Divider orientation="right" plain>
        {tag}
      </Divider>
      <div
        style={{
          textIndent: '2em',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
        onClick={clickHandler}
      >
        {translation}
      </div>
      <div className={classNames(`${prefixCls}-tools-bar`, hashId)}>
        <Button
          size="small"
          type="text"
          onClick={editClickHandler}
          icon={<EditOutlined />}
        ></Button>
        <Popconfirm
          title={'操作不可逆，请确认'}
          onConfirm={removeClickHandler}
          onCancel={stopPropagation}
        >
          <Button
            size="small"
            type="text"
            danger
            onClick={stopPropagation}
            icon={<DeleteOutlined />}
          ></Button>
        </Popconfirm>
      </div>
    </div>,
  );
};

const genStyle = (token: DerivativeToken): CSSInterpolation => ({
  [`.${prefixCls}-record-card`]: {
    position: 'relative',
    height: '100%',
    width: '100%',
    padding: '12px',
    overflow: 'hidden',
    overflowWrap: 'break-word',
    backgroundColor: '#fff',
    '&:hover .check': { visibility: 'visible' },
  },
  [`.${prefixCls}-tools-bar`]: {
    position: 'absolute',
    top: '0',
    right: '12px',
  },
  [`.${prefixCls}-progress`]: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    height: '2px',
    backgroundImage: 'linear-gradient(to right, red, lightgreen)',
  },
  [`.${prefixCls}-check`]: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '4px',
    height: '100%',
    backgroundColor: token.colorPrimary,
    visibility: 'hidden',
  },
  [`.${prefixCls}-selected`]: { visibility: 'visible' },
});
