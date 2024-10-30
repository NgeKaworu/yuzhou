import React from 'react';

import {
  Divider,
  Popconfirm,
  Button,
  theme,
  ButtonProps,
  PopconfirmProps,
  GlobalToken,
} from 'antd';
import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';

import type { Record } from '@/models/record';
import { prefixCls as defaultPrefixCls } from '@/theme';
import { CSSInterpolation, useStyleRegister } from '@ant-design/cssinjs';

import clsx from 'clsx';
import dayjs from 'dayjs';

const prefixCls = defaultPrefixCls + '-record-item';
export interface RecordItemProps {
  onClick: () => void;
  onReviewClick?: (id: string) => void;
  onRemoveClick: (id: string) => void;
  onEditClick: (record: Record) => void;
  record: Record;
  selected: boolean;
}

const { useToken } = theme;

export default ({
  onClick,
  onReviewClick,
  onRemoveClick,
  onEditClick,
  selected,
  record,
}: RecordItemProps) => {
  const { _id, source, translation, exp: percent, tag, cooldownAt } = record;

  function reviewClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    onReviewClick?.(_id);
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
      className={clsx(`${prefixCls}-record-card`, hashId)}
      onClick={onClick}
    >
      <div
        className={clsx(`${prefixCls}-progress`, hashId)}
        style={{ width: `${percent}%` }}
      />
      <div
        className={clsx(
          clsx(`${prefixCls}-check`, hashId),
          selected && clsx(`${prefixCls}-selected`, hashId),
        )}
      />
      <div
        style={{
          textIndent: '2em',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
        onClick={onClick}
      >
        {source}
      </div>
      <Divider orientation="right" plain variant="dashed">
        【{tag}】{' '}
        {cooldownAt &&
          `下次复习时间于：${dayjs(cooldownAt).format('YYYY-MM-DD HH:mm:ss')}`}
      </Divider>
      <div
        style={{
          textIndent: '2em',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
        onClick={onClick}
      >
        {translation}
      </div>
      <div className={clsx(`${prefixCls}-tools-bar`, hashId)}>
        <Button
          size="small"
          type="text"
          onClick={reviewClickHandler}
          icon={<CaretRightOutlined />}
        ></Button>
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

const genStyle = (token: GlobalToken): CSSInterpolation => ({
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
