import React from 'react';
import Default from '../layouts/default';
import { Form, Input, Button, Checkbox, message } from 'antd';
import Router from 'next/router';
import nookies from 'nookies';

const layout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16
    }
};
const Home = () => {
    const onFinish = async (values) => {
        const res = await fetch('http://project_platform.lee.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: values.username, password: values.password })
        })
        const data = await res.json()
        if (data.code) {
            message.error('登录失败，请重新登录！')
        } else {
            message.success('恭喜您，登录成功！')
            nookies.set(null, 'userInfo', JSON.stringify(data.data), {
                maxAge: 30 * 24 * 60 * 60,
                path: '/'
            })
            Router.push('/')
        }
    };
    return (
        <Default title="后台管理系统--登录">
            <div className="login">
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                        onFinish={onFinish}
                    >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input placeholder="Please input your username" autoComplete="username"/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            }
                        ]}
                    >
                        <Input.Password autoComplete="password" placeholder="Please input your password"/>
                    </Form.Item>

                    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                        Submit
                        </Button>
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
