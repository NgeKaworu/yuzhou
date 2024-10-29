import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import {
  Empty,
  Input,
  Button,
  Space,
  Form,
  Skeleton,
  Divider,
  theme,
  Switch,
} from 'antd';

const ua = navigator.userAgent?.toLowerCase();

import { RECORD_MODE, Record as RecordItem } from '@/models/record';
import dayjs from 'dayjs';

import reviewStyles from './index.less';
import { restful } from 'edk/src/utils/http';
import { Res } from 'edk/src/utils/http/type';
import clsx from 'clsx';
import { prefixCls } from '@/theme';

type ReviewType = 'normal' | 'success' | 'fail';

const ignoreStr = `\\d的地得和与及`;
const newlineStr = `\\s\\.,，。；;：:、?？!！"“'‘·\``;
const ignore = new RegExp(`[${ignoreStr}${newlineStr}]+`);
const newline = new RegExp(`[${newlineStr}]+`);

const Ebbinghaus = [5, 25, 690, 720, 1440, 2880, 4320, 11520, 10080];

export default () => {
  const [form] = Form.useForm();
  const [flag, setFlag] = useState<ReviewType>('normal');
  const [curIdx, setCurIdx] = useState<number>(0);
  const queryClient = useQueryClient();

  const reviewListQuerier = useQuery({
    queryKey: ['review-list'],

    queryFn: () => {
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
    },
  });

  function findOneNearestNeedReview() {
    return restful
      .get(`/flashcard/record/list`, {
        notify: 'fail',
        params: {
          inReview: false,
          skip: 0,
          limit: 1,
          sort: 'cooldownAt',
          orderby: 1,
          type: 'cooling',
        },
      })
      .then((data: any) => data);
  }

  function escapeRegExp(str: string) {
    return str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  const data = reviewListQuerier?.data?.data,
    curRecord: RecordItem = data?.[curIdx]!,
    mode = curRecord?.mode ?? RECORD_MODE.FULL,
    keywordArr = curRecord?.translation
      ?.split(newline)
      ?.sort((a, b) => b?.length - a?.length),
    keywordRegexp = new RegExp(keywordArr?.map(escapeRegExp)?.join('|'), 'g'),
    keywordModeSourceSplitArr = curRecord?.source?.split(keywordRegexp),
    positionArr =
      RECORD_MODE.KEYWORD === mode
        ? Array.from(curRecord?.source?.matchAll(keywordRegexp))
        : [];

  const [source, setSource] = useState<React.ReactNode>('');

  const { hashId } = theme.useToken();

  useEffect(() => {
    setSource(curRecord?.source);
  }, [curRecord?.source]);

  useEffect(() => {
    const pre = localStorage.getItem('flashcard:review:form');
    if (pre) {
      form.setFieldsValue(JSON.parse(pre));
    }
  }, []);

  const { isPending: isLoading, mutate } = useMutation({
    mutationFn: (data: { [key: string]: any }) => {
      return restful.patch(`/flashcard/record/set-review-result`, data, {
        notify: 'fail',
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['records-list'] });
      queryClient.invalidateQueries({ queryKey: ['review-list'] });
      setFlag('normal');
      setCurIdx(0);
      form.resetFields();
      localStorage.removeItem('flashcard:review:form');
    },
  });

  const total = reviewListQuerier?.data?.total || 0;
  const hasNext = curIdx < total - 1;

  function onNext() {
    setCurIdx((i) => (++i === total ? 0 : i));
  }

  function onRemember() {
    const id = curRecord?._id;
    const now = dayjs();
    const cooldownAt = curRecord?.cooldownAt
      ? dayjs(curRecord?.cooldownAt)
      : dayjs();
    const exp = curRecord?.exp;

    const data: { [key: string]: any } = {
      id,
      cooldownAt,
      exp,
    };

    // 过了冷却才能涨经验
    if (!curRecord?.cooldownAt || now.isAfter(cooldownAt)) {
      // 艾宾浩斯遗忘曲线
      switch (exp) {
        case 0:
        case 10:
        case 20:
        case 30:
        case 40:
        case 50:
        case 60:
        case 70:
        case 80: {
          data.cooldownAt = now.add(Ebbinghaus[exp / 10], 'minutes');
          data.exp = exp + 10;
          break;
        }
        case 90:
        case 100: {
          data.exp = 100;
          data.cooldownAt = now.add(1, 'hours');
          break;
        }
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
    const id = curRecord?._id;
    const now = dayjs();
    let exp = curRecord?.exp;
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
            nextReviewTime = nextReviewRecord?.data?.[0]?.cooldownAt;

          if (nextReviewTime !== undefined) {
            let nextTime = dayjs(nextReviewTime).diff(dayjs());
            setTimeout(() => {
              registration.showNotification('复习提醒', {
                body: '你有单词需要复习～',
                // icon: '../images/touch/chrome-touch-icon-192x192.png', // icon
                // vibrate: [200, 100, 200, 100, 200, 100, 200], // 抖动
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
            跳过
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
              记住
            </Button>

            <Button
              size="small"
              type="primary"
              danger
              onClick={onForget}
              loading={isLoading}
            >
              忘记
            </Button>
            <Form.Item noStyle>
              <Button size="small" type="dashed" danger htmlType="reset">
                重置
              </Button>
            </Form.Item>
          </Space>
        );
      default:
        console.error('invalidate type: ', flag);
    }
  }

  function reset() {
    setSource('');
    setFlag('normal');
  }

  async function submitHandler() {
    const values = await form.validateFields();

    if (RECORD_MODE.KEYWORD === mode) {
      const answerArr: Array<string> = values?.answer;
      if (
        answerArr?.every(
          (i: string, idx: number) => i === positionArr?.[idx]?.[0],
        )
      ) {
        setFlag('success');
        setSource(curRecord.source);
      } else {
        const answer: Array<ReactNode> = [
          <Fragment key={keywordModeSourceSplitArr?.[0]}>
            {keywordModeSourceSplitArr?.[0]}
          </Fragment>,
        ];

        answerArr?.forEach((i, idx) => {
          if (i === positionArr?.[idx]?.[0]) {
            answer.push(<Fragment key={`${i}${idx}`}>{i}</Fragment>);
          } else {
            answer.push(
              <span
                key={`${positionArr?.[idx]?.[0]}${idx}`}
                style={{ background: 'lightcoral' }}
              >
                {positionArr?.[idx]?.[0]}
              </span>,
            );
          }
          answer.push(
            <Fragment key={keywordModeSourceSplitArr?.[idx + 1]}>
              {keywordModeSourceSplitArr?.[idx + 1]}
            </Fragment>,
          );
        });
        setFlag('fail');
        setSource(answer);
      }
    }

    if (RECORD_MODE.FULL === mode) {
      function ignoreHOF(s: string) {
        return s
          .split('')
          .filter((i) => !i.match(ignore))
          .join('');
      }

      const answer: string = values.answer,
        actual = curRecord?.source;
      if (ignoreHOF(answer) === ignoreHOF(actual)) {
        setFlag('success');
        setSource(actual);
      } else {
        // 组合法
        function combination() {
          const dAnswerDict = answer?.split(newline)?.reduce(
            (arr: Record<string, number>[], cur) =>
              arr.concat(
                cur.split('').reduce((acc: Record<string, number>, cur) => {
                  if (cur.match(ignore)) return acc;

                  if (acc[cur] === undefined) {
                    acc[cur] = 1;
                  } else {
                    acc[cur]++;
                  }
                  return acc;
                }, {}),
              ),
            [],
          );
          let dDiff: Array<React.ReactNode> = [];

          for (let i = 0, n = 0; i < actual.length; i++) {
            const c = actual[i];
            let ele: React.ReactNode;
            if (c.match(newline) && !actual[i + 1]?.match(newline)) n++;
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

          const dActualDict = actual?.split(newline)?.reduce(
            (arr: Record<string, number>[], cur) =>
              arr.concat(
                cur.split('').reduce((acc: Record<string, number>, cur) => {
                  if (cur.match(ignore)) return acc;

                  if (acc[cur] === undefined) {
                    acc[cur] = 1;
                  } else {
                    acc[cur]++;
                  }
                  return acc;
                }, {}),
              ),
            [],
          );
          let dAnswerDiff: Array<React.ReactNode> = [];

          for (let i = 0, n = 0; i < answer.length; i++) {
            const c = answer[i];
            let ele: React.ReactNode;
            if (c.match(newline) && !answer[i + 1]?.match(newline)) n++;
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
            dAnswerDiff = dAnswerDiff.concat(
              <Fragment key={i}>{ele}</Fragment>,
            );
          }

          return [dDiff, dAnswerDiff];
        }

        // 排列法

        function permutation() {
          let i = 0,
            j = 0,
            k = 0;

          let tmp1: Array<React.ReactNode> = [];
          const actualGroup = actual.split(newline);
          const answerGroup = answer.split(newline);

          while (k < actual.length) {
            while (actual?.[k]?.match(ignore)) {
              if (
                actual?.[k]?.match(newline) &&
                !actual?.[k + 1]?.match(newline)
              ) {
                i++;
                j = 0;
              }
              tmp1 = tmp1.concat(<Fragment key={k}>{actual[k]}</Fragment>);
              k++;
            }

            while (answerGroup?.[i]?.[j]?.match(ignore)) j++;

            if (actual?.[k] === answerGroup?.[i]?.[j]) {
              tmp1 = tmp1.concat(<Fragment key={k}>{actual[k]}</Fragment>);
            } else {
              tmp1 = tmp1.concat(
                <span key={k} style={{ background: 'lightcoral' }}>
                  {actual[k]}
                </span>,
              );
            }
            j++;
            k++;
          }

          i = 0;
          j = 0;
          k = 0;

          let tmp2: Array<React.ReactNode> = [];

          while (k < answer.length) {
            while (answer?.[k]?.match(ignore)) {
              if (
                answer?.[k]?.match(newline) &&
                !answer?.[k + 1]?.match(newline)
              ) {
                i++;
                j = 0;
              }
              tmp2 = tmp2.concat(<Fragment key={k}>{answer[k]}</Fragment>);
              k++;
            }

            while (actualGroup?.[i]?.[j]?.match(ignore)) j++;

            if (answer?.[k] === actualGroup?.[i]?.[j]) {
              tmp2 = tmp2.concat(<Fragment key={k}>{answer[k]}</Fragment>);
            } else {
              tmp2 = tmp2.concat(
                <span key={k} style={{ background: 'lightcoral' }}>
                  {answer[k]}
                </span>,
              );
            }
            j++;
            k++;
          }

          return [tmp1, tmp2];
        }

        const [actualDiff, answerDiff] = values?.isPermutation
          ? permutation()
          : combination();

        setSource(
          <>
            <p style={{ textIndent: 24 }}>{actualDiff}</p>
            <Divider dashed />
            <p style={{ textIndent: 24 }}>{answerDiff}</p>
          </>,
        );
        setFlag('fail');
      }
    }
  }

  function onHotKey({ key, metaKey, ctrlKey, altKey }: React.KeyboardEvent) {
    if (key === 'Enter') {
      if (
        (ua?.includes('windows') && ctrlKey) ||
        (ua?.includes('mac') && metaKey)
      ) {
        submitHandler();
      }
    }

    if (key === 'r') {
      if (
        (ua?.includes('windows') && altKey) ||
        (ua?.includes('mac') && ctrlKey)
      ) {
        form.resetFields();
        reset();
      }
    }
  }

  return (
    <Form
      form={form}
      onFinish={submitHandler}
      onReset={reset}
      onValuesChange={(_, data) => {
        localStorage.setItem('flashcard:review:form', JSON.stringify(data));
      }}
    >
      <section>
        <header style={{ height: 24 }}>
          <div className={clsx(`${prefixCls}-header`, hashId)}>
            {renderTitle()}
            <Form.Item noStyle name="isPermutation" valuePropName="checked">
              <Switch
                onChange={submitHandler}
                style={{ position: 'absolute', right: '12px' }}
                checkedChildren="排列"
                unCheckedChildren="组合"
              />
            </Form.Item>
          </div>
        </header>
        <main className={clsx(`${prefixCls}-content`, hashId)}>
          {data?.length ? (
            <div className={reviewStyles['form']}>
              {RECORD_MODE.KEYWORD === mode && (
                <>
                  <strong>请在下面填入正确关键字： </strong>
                  <strong style={{ fontSize: 30 }}>{curRecord?.tag}</strong>
                  <Form.Item className={reviewStyles['form-item']}>
                    {keywordModeSourceSplitArr?.map((i, idx) =>
                      keywordModeSourceSplitArr?.length - 1 > idx ? (
                        <Fragment key={`${curRecord?._id} + ${i}`}>
                          {i}
                          <Form.Item name={['answer', idx]} noStyle>
                            <Input
                              size="small"
                              autoFocus={idx === 0}
                              style={{
                                display: 'inline-block',
                                width: `calc(${
                                  positionArr[idx]?.[0]?.length ?? 1
                                }em + 2em)`,
                              }}
                              onKeyDown={onHotKey}
                            />
                          </Form.Item>
                        </Fragment>
                      ) : (
                        i
                      ),
                    )}
                  </Form.Item>

                  <Divider />
                  <div>原文： </div>
                  <Form.Item className={reviewStyles['form-item']}>
                    {flag !== 'normal' ? source : <Skeleton />}
                  </Form.Item>
                </>
              )}

              {RECORD_MODE.FULL === mode && (
                <>
                  <strong>译文： </strong>
                  <Form.Item className={reviewStyles['form-item']}>
                    {curRecord?.translation}
                  </Form.Item>
                  <Divider />
                  <strong>默写区： </strong>
                  <Form.Item
                    className={reviewStyles['form-item']}
                    style={{ textIndent: 0 }}
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
                  <strong>原文： </strong>
                  <Form.Item className={reviewStyles['form-item']}>
                    {flag !== 'normal' ? source : <Skeleton />}
                  </Form.Item>
                </>
              )}
            </div>
          ) : (
            <Empty className={clsx(`${prefixCls}-empty`, hashId)} />
          )}
        </main>
        <footer>
          <div className={clsx(`${prefixCls}-content-footer`, hashId)}>
            <Space style={{ marginRight: '12px', whiteSpace: 'pre-wrap' }}>
              余{total}
            </Space>
            <Space>
              {renderNextBtn()}
              <Form.Item noStyle>
                <Button size="small" type="primary" htmlType="submit">
                  {flag !== 'normal' ? '重试' : '提交'}
                </Button>
              </Form.Item>
            </Space>
          </div>
        </footer>
      </section>
    </Form>
  );
};
