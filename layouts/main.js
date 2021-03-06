import React, { Fragment, useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Layout, Button, Avatar, Menu, message } from 'antd';
import { LoginOutlined, MailOutlined, AppstoreOutlined } from '@ant-design/icons';
import nookies from 'nookies'

const Main = ({ children, title='管理后台系统'}) => {
    const { Header, Sider, Content } = Layout;
    const { SubMenu } = Menu;
    const [ current, setCurrent ] = useState('1');
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        const cookies = nookies.get('userInfo')
        if (!Object.keys(cookies).length) {
            message.error('登录已过期，请重新登录！')
            Router.push('/login')
            return
        }
        const userInfos = JSON.parse(cookies.userInfo)
        setUserInfo(userInfos.userInfo)
    }, [])
    const routerList = [
        {
            id: 'index',
            icon: <MailOutlined />,
            title: '广告位管理',
            children: [
                {
                    id: 1,
                    label: '广告位位置管理',
                    route: '/'
                },
                {
                    id: 2,
                    label: '轮播图管理',
                    route: '/slider'
                }
            ]
        }
    ]

    const handleClick = ({ key, keyPath }) => {
        const [id, index] = keyPath;
        setCurrent(key)
        Router.push(routerList.find(router => {
            return router.id === index
        }).children.find(child => {
            return child.id === parseInt(id)
        }).route)
    };
    const logout = () => {
        nookies.destroy(null, 'userInfo')
        Router.push('/login')
    };
    return  (
        <Fragment>
            <Head>
                <title>{`管理后台系统--${title}`}</title>
                <meta charSet='utf-8' />
            </Head>
            <Layout>
                <Header>
                    <div>
                        <Avatar src={userInfo.avatar} style={{width: '48px', height: 'auto'}}></Avatar>&nbsp;&nbsp;&nbsp;{userInfo.name}
                    </div>
                    <Button onClick={logout}><LoginOutlined />退出</Button>
                </Header>
                <Layout>
                    <Sider>
                        <Menu
                            theme={'dark'}
                            onClick={handleClick}
                            style={{ width: 200 }}
                            defaultOpenKeys={['index']}
                            selectedKeys={[current]}
                            mode="inline"
                        >
                            {
                                routerList.map(route => {
                                    return (
                                        <SubMenu
                                            key={route.id}
                                            title={
                                            <span>
                                                {route.icon}
                                                <span>{route.title}</span>
                                            </span>
                                            }
                                        >
                                            {
                                                route.children.map(child => {
                                                    return (
                                                        <Menu.Item key={child.id}>{child.label}</Menu.Item>
                                                    )
                                                })
                                            }
                                        </SubMenu>
                                    )
                                })
                            }
                        </Menu>
                    </Sider>
                    <Content>{children}</Content>
                </Layout>
            </Layout>
            <style jsx global>
                {`
                    #__next {
                        height: 100%;
                    }
                    .ant-layout {
                        width: 100%;
                        height: 100%;
                        color: #fff;
                    }
                    .ant-layout-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: #fff;
                    }
                    .ant-layout-content {
                        color: #333;
                        padding: 24px;
                    }
                `}    
            </style>
        </Fragment>
    )
}

export default Main;
