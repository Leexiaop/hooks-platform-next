import React from 'react';
import Default from '../layouts/default';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const Home = () => {
    const onFinish = values => {
        console.log('Received values of form: ', values);
    };
    return (
        <Default title="后台管理系统--登录">
            <div className="login">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                      remember: true
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            }
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            }
                        ]}
                    >
                        <Input
                          prefix={<LockOutlined className="site-form-item-icon" />}
                          type="password"
                          placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <a className="login-form-forgot" href="">
                      Forgot password
                    </a>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                          Log in
                        </Button>
                        Or <a href="">register now!</a>
                    </Form.Item>
                </Form>
            </div>
            <style jsx>
                {`
                    .login {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 0 auto;
                    }
                `}
            </style>
        </Default>
    )
}

export default Home
