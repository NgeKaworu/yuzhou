import { Mail } from '@/constant/email';
import useCoolDown from '@/js-sdk/hooks/useCoolDown';
import { MailOutlined, UserOutlined, RobotOutlined, LockOutlined } from '@ant-design/icons';
import { AutoComplete, Form, Input, Typography } from 'antd';
import { FormInstance } from 'rc-field-form';
import { useState } from 'react';
import { validateKey } from '../api';
import { fetchCaptcha, checkCaptcha } from '../api/captcha';
const { Item } = Form;
const { Link, Text } = Typography;

export interface FieldProps {
  disabled?: boolean;
  checkout?: boolean;
}

export const Email = ({ disabled, checkout }: FieldProps) => {
  const [mail, setMail] = useState<{ value: string }[]>([]);
  function onSearch(value: string) {
    if (value?.includes('@')) {
      const [v] = value?.split('@');
      setMail(Mail.map((m) => ({ value: `${v}@${m}` })));
    } else {
      setMail([]);
    }
  }
  return (
    <Item
      name="email"
      hasFeedback
      rules={[
        { required: true, message: '请输入邮箱' },
        {
          validator: (_, email) =>
            checkout && email
              ? validateKey({ params: { email }, notify: false })
              : Promise.resolve(),
        },
        { type: 'email', message: '请检查邮箱格式' },
      ]}
    >
      <AutoComplete
        options={mail}
        onSearch={onSearch}
        filterOption={(inputValue, option) =>
          option?.value?.toUpperCase?.()?.indexOf?.(inputValue?.toUpperCase?.()) !== -1
        }
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="邮箱"
          disabled={disabled}
          allowClear
          size="large"
        />
      </AutoComplete>
    </Item>
  );
};

export const Captcha = () => {
  const { remaining, cooling, start } = useCoolDown({ count: 60, persistenceKey: 'captcha' });

  function getCAPTCHA(form: FormInstance<any>) {
    return async () => {
      const { email } = await form.validateFields(['email']);
      await fetchCaptcha({ params: { email }, notify: true });
      start();
    };
  }

  return (
    <Item dependencies={[['email']]} noStyle>
      {(form) => (
        <Item
          rules={[
            { required: true, message: '请校验验证码' },
            ({ getFieldValue }) => {
              return {
                validator: async (_, captcha) => {
                  const email = await getFieldValue(['email']);

                  if (!/^[0-9]{4}$/.test(captcha))
                    return Promise.reject(new Error('请输入4位数验证码'));

                  return await checkCaptcha({ params: { email, captcha }, notify: false });
                },
              };
            },
          ]}
          name="captcha"
          hasFeedback
        >
          <Input
            prefix={<RobotOutlined />}
            placeholder="验证码"
            maxLength={4}
            suffix={
              cooling ? (
                <Text type="secondary">{remaining}秒</Text>
              ) : (
                <Link onClick={getCAPTCHA(form)}>发送验证码</Link>
              )
            }
            allowClear
            size="large"
          />
        </Item>
      )}
    </Item>
  );
};

export const Pwd = ({ disabled }: FieldProps) => (
  <Item
    name="pwd"
    rules={[
      { required: !disabled, message: '请输入密码' },
      {
        pattern: /^(?![0-9]+$)(?![A-Z]+$)(?![a-z]+$)[0-9A-Za-z]{8,}$/,
        message: '密码8位字符以上，包含字母大小写和数字中两种和以上',
      },
    ]}
    hasFeedback
  >
    <Input.Password prefix={<LockOutlined />} placeholder="密码" allowClear size="large" />
  </Item>
);

export const ConfirmPwd = ({ pwdField = 'pwd' }: { pwdField?: string }) => (
  <Item
    name="confirmPwd"
    dependencies={[[pwdField]]}
    rules={[
      ({ getFieldValue }) => ({
        validator: (_, v) =>
          v === getFieldValue(pwdField)
            ? Promise.resolve()
            : Promise.reject(new Error('两次密码不一致')),
      }),
    ]}
    hasFeedback
  >
    <Input.Password prefix={<LockOutlined />} placeholder="确认密码" allowClear size="large" />
  </Item>
);

export const Name = () => (
  <Item name="name" rules={[{ required: true, message: '请输入用户名' }]} hasFeedback>
    <Input placeholder="用户名" allowClear size="large" prefix={<UserOutlined />} />
  </Item>
);
