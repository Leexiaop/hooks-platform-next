import React, { useState, useEffect } from 'react';
import Main from '../layouts/main';
import fetch from 'isomorphic-fetch';
import { Button, Table, Modal, Popconfirm, Form, Input, message } from 'antd';
import nookies from 'nookies';
const AddPosition = () => {
    const [tableList, setTableList] = useState([]);
    const [isModalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('添加')
    const [form, setForm] = useState({id: '', position: ''});
    const [offset, setOffset]= useState(1);
    const [total, setTotal] = useState(0);
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
        getInitData()
    }, [])
    const getInitData = async () => {
        const user = JSON.parse((nookies.get('userInfo')).userInfo)
        const res = await fetch(`http://project_platform.lee.com/api/ad/position?limit=10&offset=${offset}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        const data = await res.json()
        setTotal(data.data.total)
        setTableList(data.data.lists.map(item => {
                return { key: item.id, position: item.position}
            })
        )
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: '位置',
            dataIndex: 'position',
            key: 'key'
        },
        {
            title: '操作',
            render: (text) => {
                return (
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" size="middle" onClick={() => handleModalShowClick(text)}>编辑</Button>
                        <Popconfirm
                            placement="topRight"
                            title="Are you sure delete this task?"
                            onConfirm={() => handleDelete(text)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger  size="small">删除</Button>
                        </Popconfirm>
                    </div>
                )
            }
        }
    ];
    const handleModalShowClick = (item) => {
        setModalShow(true)
        if(!item) {
            setModalTitle('添加')
        } else {
            setModalTitle('编辑')
            setForm({...form, id: item.key, position: item.position })
        }
    }
    const handleOk = async () => {
        const res = await fetch('http://project_platform.lee.com/api/ad/position', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form.id ? form : { position: form.position })
        })
        const data =  await res.json()
        if (data.code === 0) {
            setModalShow(false)
            setForm({...form, id: '', position: ''})
            getInitData()
            message.success(data.message)
        } else {
            message.error(data.message)
        }
    }
    const handleCancel = () => {
        setModalShow(false)
        setForm({ ...form, ...{}})
    }
    const getInput = (e) => {
        form.position = e.target.value
    }
    const handleDelete = async (item) => {
        const res = await fetch(`http://project_platform.lee.com/api/ad/position/${item.key}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await res.json()
        if (data.code === 0) {
            setModalShow(false)
            getInitData()
            message.success(data.message)
        } else {
            message.error(data.message)
        }
    }
    const pagesChange = (page) => {
        setOffset(page)
        getInitData()
    }
    return (
        <Main title="广告位置管理">
            <Button type="primary" onClick={ () => handleModalShowClick() }>添加</Button>
            <br />
            <br />
            <Table columns={columns} dataSource={tableList} pagination={{
                defaultCurrent: 1,
                pageSize: 10,
                total: total,
                onChange: (pageSize) => pagesChange(pageSize)
            }}></Table>
            <Modal
                title={`${modalTitle}广告位位置`}
                visible={isModalShow}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
             >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size={'large'}
                >
                    <Form.Item label="广告位位置">
                        <Input defaultValue={form.position} onChange={ getInput }/>
                    </Form.Item>
                </Form>
            </Modal>
        </Main>
    )
}

export default AddPosition;