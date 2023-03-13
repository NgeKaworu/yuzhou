import { useParams, useHistory } from 'react-router-dom';
import { Button, Form, Card, FormProps, Typography } from 'antd';
import { ConfirmPwd, Email, Name, Pwd, Captcha } from './user/component/Field';
import { restful } from '@/js-sdk/utils/http';
import { useMutation } from 'react-query';
import styles from './profile.less';

const { Item } = Form;
const { Link, Title } = Typography;

interface Entry {
  title: string;
}
type ENTRY_TYPE = 'register' | 'login' | 'forget-pwd';

const ENTRY_MAP = new Map<ENTRY_TYPE, Entry>([
  [
    'register',
    {
      title: '注册',
    },
  ],
  [
    'login',
    {
      title: '登录',
    },
  ],
  [
    'forget-pwd',
    {
      title: '重置密码',
    },
  ],
]);

export default () => {
  const { entry } = useParams() as { entry: ENTRY_TYPE },
    history = useHistory(),
    [form] = Form.useForm(),
    charon = useMutation((value) => restful.post(`user-center/${entry}`, value));

  if (!['register', 'login', 'forget-pwd'].includes(entry)) {
    history.replace('/');
  }

  function go(pathname: ENTRY_TYPE) {
    return () => history.replace(`/${pathname}`);
  }

  const onFinish: FormProps['onFinish'] = async (value) => {
    try {
      const res = await charon.mutateAsync(value);
      window.localStorage.setItem('token', res?.data);
      location.replace('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.content}>
      <Card title={ENTRY_MAP.get(entry)?.title}>
        <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={console.warn}>
          <div className={[styles['space-between'], styles.column, styles.card]?.join(' ')}>
            <div>
              {entry === 'register' && <Name />}
              <Email checkout={entry === 'register'} />
              {entry !== 'login' && <Captcha />}
              <Pwd />
              {entry !== 'login' && <ConfirmPwd />}
            </div>

            <div>
              <Item noStyle>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  block
                  loading={charon.isLoading}
                >
                  {ENTRY_MAP.get(entry)?.title}
                </Button>
              </Item>

              <Item>
                <div className={styles['space-between']}>
                  {entry !== 'login' && <Link onClick={go('login')}>已有账号？现在登录！</Link>}
                  {entry !== 'register' && (
                    <Link onClick={go('register')}>没有账号？现在注册！</Link>
                  )}
                  {entry !== 'forget-pwd' && <Link onClick={go('forget-pwd')}>忘记密码？</Link>}
                </div>
              </Item>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};
