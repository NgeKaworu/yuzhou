import React, { Fragment, useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import {
  Empty,
  Input,
  Layout,
  Button,
  Space,
  Form,
  Skeleton,
  Divider,
  theme,
} from 'antd';

const ua = navigator.userAgent?.toLowerCase();

import { Record as RecordItem } from '@/models/record';
import moment from 'dayjs';

import reviewStyles from './index.less';
import { restful } from 'edk/src/utils/http';
import { Res } from 'edk/src/utils/http/type';
import classNames from 'classnames';
import { prefixCls } from '@/theme';

type ReviewType = 'normal' | 'success' | 'fail';
export default () => {
  const [form] = Form.useForm();
  const [flag, setFlag] = useState<ReviewType>('normal');
  const [curIdx, setCurIdx] = useState<number>(0);
  const queryClient = useQueryClient();

  const { data } = useQuery(['review-list'], () => {
    return restful.get<Res<RecordItem[]>, Res<RecordItem[]>>(
      `/flashcard/record/list`,
      {
        notify: 'fail',
        params: {
          inReview: true,
          skip: 0,
          limit: 0,
        },
      },
    );
  });

  function findOneNearestNeedReview() {
    return restful
      .get(`/flashcard/record/list?sort=cooldownAt&orderby=-1`, {
        notify: 'fail',
        params: {
          inReview: false,
          skip: 0,
          limit: 1,
        },
      })
      .then((data: any) => data);
  }

  const datas = data?.data,
    curRencord: RecordItem = datas?.[curIdx]!;

  const [source, setSource] = useState<React.ReactNode>('');

  const { hashId } = theme.useToken();

  useEffect(() => {
    setSource(curRencord?.source);
  }, [curRencord?.source]);

  const { isLoading, mutate } = useMutation(
    (data: { [key: string]: any }) => {
      return restful.patch(`/flashcard/record/set-review-result`, data, {
        notify: 'fail',
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['records-list']);
        queryClient.invalidateQueries(['review-list']);
        setFlag('normal');
        setCurIdx(0);
        form.resetFields();
      },
    },
  );

  const total = data?.total || 0;
  const hasNext = curIdx < total - 1;

  function onNext() {
    setCurIdx((i) => (++i === total ? 0 : i));
  }

  function onRemember() {
    const id = curRencord?._id;
    const now = moment();
    const cooldownAt = moment(curRencord?.cooldownAt);
    const exp = curRencord?.exp;

    const data: { [key: string]: any } = {
      id,
      cooldownAt,
      exp,
    };

    // 过了冷却才能涨经验
    if (now.isAfter(cooldownAt)) {
      // 艾宾浩斯遗忘曲线
      switch (exp) {
        case 0:
          data.cooldownAt = now.add(5, 'minutes');
          data.exp = exp + 10;
          break;
        case 10:
          data.cooldownAt = now.add(25, 'minutes');
          data.exp = exp + 10;
          break;
        case 20:
          data.cooldownAt = now.add(11.5, 'hours');
          data.exp = exp + 10;
          break;
        case 30:
          data.cooldownAt = now.add(12, 'hours');
          data.exp = exp + 10;
          break;
        case 40:
          data.cooldownAt = now.add(1, 'day');
          data.exp = exp + 10;
          break;
        case 50:
          data.cooldownAt = now.add(2, 'days');
          data.exp = exp + 10;
          break;
        case 60:
          data.cooldownAt = now.add(3, 'days');
          data.exp = exp + 10;
          break;
        case 70:
          data.cooldownAt = now.add(8, 'days');
          data.exp = exp + 10;
          break;
        case 80:
          data.cooldownAt = now.add(0.5, 'month');
          data.exp = exp + 10;
          break;
        case 90:
          data.cooldownAt = now.add(1, 'hours');
          data.exp = exp + 10;
          break;
        case 100:
          data.cooldownAt = now.add(1, 'hours');
          break;
        default:
          console.error('invalidate exp type: ', exp);
          break;
      }
    }
    data.cooldownAt = data.cooldownAt?.toISOString();
    mutate(data);
    if (!hasNext) {
      notifyMe();
    }
  }

  function onForget() {
    const id = curRencord?._id;
    const now = moment();
    let exp = curRencord?.exp;
    // 经验降一级
    if (exp !== 0) {
      exp -= 10;
    }

    const data: { [key: string]: any } = {
      id,
      //   冷却一小时
      cooldownAt: now.add(1, 'hour'),
      exp,
    };
    data.cooldownAt = data.cooldownAt?.toISOString();
    mutate(data);
    if (!hasNext) {
      notifyMe();
    }
  }

  function notifyMe() {
    Notification.requestPermission(function (result) {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(async function (registration) {
          const nextReviewRecord = await findOneNearestNeedReview(),
            nextReviewTime = nextReviewRecord?.data?.[0]?.reviewAt;

          if (nextReviewTime !== undefined) {
            let nextTime = moment(nextReviewTime).diff(moment());
            // 最短一小时
            if (nextTime < 3600000) {
              nextTime = 3600000;
            }
            setTimeout(() => {
              registration.showNotification('复习提醒', {
                body: '你有单词需要复习～',
                // icon: '../images/touch/chrome-touch-icon-192x192.png', // icon
                vibrate: [200, 100, 200, 100, 200, 100, 200], // 抖动
                tag: 'review-notify', // 唯一ID
              });
            }, nextTime);
          }
        });
      }
    });
  }

  function renderTitle() {
    switch (flag) {
      case 'normal':
        return '复习';
      case 'success':
        return <span style={{ color: 'lightgreen' }}>记忆成功</span>;
      case 'fail':
        return <span style={{ color: 'red' }}>记忆失败</span>;
      default:
        console.error('invalidate type: ', flag);
    }
  }

  function renderNextBtn() {
    switch (flag) {
      case 'normal':
        return (
          <Button size="small" disabled={total <= 1} onClick={onNext}>
            跳过当前
          </Button>
        );
      case 'success':
      case 'fail':
        return (
          <Space>
            <Button
              size="small"
              onClick={onRemember}
              loading={isLoading}
              style={{ background: 'lightgreen' }}
            >
              记忆成功，{hasNext ? '下一项' : '完成复习'}
            </Button>

            {flag === 'fail' && (
              <Button
                size="small"
                type="primary"
                danger
                onClick={onForget}
                loading={isLoading}
              >
                记忆失败,{hasNext ? '下一项' : '完成复习'}
              </Button>
            )}
          </Space>
        );
      default:
        console.error('invalidate type: ', flag);
    }
  }

  function submitHandler() {
    form.validateFields().then((values) => {
      const ignoreStr = `\\d的地得和与及；;：:、?？!！"“'‘·\``;
      const newlineStr = `\\s\\.,，。`;
      const ignore = new RegExp(`[${ignoreStr}${newlineStr}]`);
      const newline = new RegExp(`[${newlineStr}]`);

      function ignoreHOF(s: string) {
        return s
          .split('')
          .filter((i) => !i.match(ignore))
          .join('');
      }

      const answer: string = values.answer,
        actual = curRencord?.source;
      console.log(ignoreHOF(answer));
      console.log(ignoreHOF(actual));
      if (ignoreHOF(answer) === ignoreHOF(actual)) {
        setFlag('success');
        setSource(actual);
      } else {
        const dAnswerDict = answer
          ?.split('')
          ?.map((i) => (i.match(newline) ? '\n' : i))
          .join('')
          ?.split('\n')
          ?.reduce((arr: Record<string, number>[], cur) => {
            return arr.concat(
              cur.split('').reduce((acc: Record<string, number>, cur) => {
                if (cur.match(ignore)) return acc;

                if (acc[cur] === undefined) {
                  acc[cur] = 1;
                } else {
                  acc[cur]++;
                }
                return acc;
              }, {}),
            );
          }, []);
        let dDiff: Array<React.ReactNode> = [];

        for (let i = 0, n = 0; i < actual.length; i++) {
          const c = actual[i];
          let ele: React.ReactNode;
          if (c.match(newline)) n++;
          if (c.match(ignore)) {
            ele = c;
          } else if (dAnswerDict?.[n]?.[c] > 0) {
            dAnswerDict[n][c]--;
            ele = c;
          } else {
            ele = (
              <span key={i} style={{ background: 'lightcoral' }}>
                {c}
              </span>
            );
          }
          dDiff = dDiff.concat(<Fragment key={i}>{ele}</Fragment>);
        }

        const dActualDict = actual
          ?.split('')
          ?.map((i) => (i.match(newline) ? '\n' : i))
          .join('')
          ?.split('\n')
          ?.reduce((arr: Record<string, number>[], cur) => {
            return arr.concat(
              cur.split('').reduce((acc: Record<string, number>, cur) => {
                if (cur.match(ignore)) return acc;

                if (acc[cur] === undefined) {
                  acc[cur] = 1;
                } else {
                  acc[cur]++;
                }
                return acc;
              }, {}),
            );
          }, []);
        let dAnswerDiff: Array<React.ReactNode> = [];

        for (let i = 0, n = 0; i < answer.length; i++) {
          const c = answer[i];
          let ele: React.ReactNode;
          if (c.match(newline)) n++;
          if (c.match(ignore)) {
            ele = c;
          } else if (dActualDict?.[n]?.[c] > 0) {
            dActualDict[n][c]--;
            ele = c;
          } else {
            ele = (
              <span key={i} style={{ background: 'lightcoral' }}>
                {c}
              </span>
            );
          }
          dAnswerDiff = dAnswerDiff.concat(<Fragment key={i}>{ele}</Fragment>);
        }

        setSource(
          <>
            {dDiff}
            <Divider dashed />
            {dAnswerDiff}
          </>,
        );
        setFlag('fail');
      }
    });
  }

  function onHotKey({ key, metaKey, ctrlKey }: React.KeyboardEvent) {
    if (key === 'Enter') {
      if (
        (ua?.includes('windows') && ctrlKey) ||
        (ua?.includes('mac') && metaKey)
      ) {
        submitHandler();
      }
    }
  }

  return (
    <section>
      <header style={{ height: 24 }}>
        <div className={classNames(`${prefixCls}-header`, hashId)}>
          {renderTitle()}
        </div>
      </header>
      <main className={classNames(`${prefixCls}-content`, hashId)}>
        {datas?.length ? (
          <Form className={reviewStyles['form']} form={form}>
            <Form.Item className={reviewStyles['form-item']}>
              <div>译文： </div>
              {curRencord?.translation}
            </Form.Item>
            <Divider />
            <div>默写区： </div>
            <Form.Item
              className={reviewStyles['form-item']}
              name="answer"
              rules={[{ required: true, message: '请把内容默写于此' }]}
            >
              <Input.TextArea
                autoFocus
                onKeyDown={onHotKey}
                autoSize={{ minRows: 8 }}
                placeholder="请把内容默写于此"
                allowClear
              />
            </Form.Item>
            <Divider />
            <Form.Item className={reviewStyles['form-item']}>
              <div>原文： </div>
              {flag !== 'normal' ? source : <Skeleton />}
            </Form.Item>
          </Form>
        ) : (
          <Empty className={classNames(`${prefixCls}-empty`, hashId)} />
        )}
      </main>
      <footer>
        <div className={classNames(`${prefixCls}-content-footer`, hashId)}>
          <Space style={{ marginRight: '12px', whiteSpace: 'pre-wrap' }}>
            余{total}
          </Space>
          <Space>
            {renderNextBtn()}
            <Button
              size="small"
              type="primary"
              disabled={flag !== 'normal'}
              onClick={submitHandler}
            >
              提交
            </Button>
          </Space>
        </div>
      </footer>
    </section>
  );
};
