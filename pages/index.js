import React, { useState } from 'react';
import Main from '../layouts/main';
import { Button, Table, Modal, Popconfirm, message, Form, Input, Select, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const Slider = () => {
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: '位置',
            dataIndex: 'age',
            key: 'age'
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: '操作',
            key: 'action',
            render: () => {
                return (
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" size="middle" onClick={() => handModalShow(3)}>编辑</Button>
                        <Button type="primary" ghost size="middle" onClick={() => handModalShow(2)}>预览</Button>
                        <Popconfirm
                            placement="topRight"
                            title="Are you sure delete this task?"
                            onConfirm={handleDelete}
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
      
    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        }
    ];
    const [isModalShow, setModalShow] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [form, setForm] = useState({})
    const [fileList, setFilelist]= useState([])
    const handModalShow = (item) => {
        setModalType(item)
        setModalShow(true)
    }
    const handleCancel = () => {
        setModalShow(false)
    }
    const handleOk = () => {
        setModalShow(false)
    }
    const handleDelete = () => {}
    const handleChange = () => {}
    const handlePreview = () => {}
    return (
        <Main title='轮播图管理'>
            <Button type="primary" onClick={() => handModalShow(1)}>添加</Button>
            <br />
            <br />
            <Table columns={columns} dataSource={data} />
            <Modal
                title="Basic Modal"
                visible={isModalShow}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {
                    modalType === 1 ? (<Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        size={'large'}
                    >
                        <Form.Item label="跳转地址">
                            <Input value={form.link}/>
                        </Form.Item>
                        <Form.Item label="位置">
                            <Select>
                                <Select.Option value="demo">Demo</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="上传图片">
                            <div className="clearfix">
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    {
                                        fileList.length >= 1 ? null :
                                        (<div>
                                            <PlusOutlined />
                                            <div className="ant-upload-text">上传图片</div>
                                        </div>)
                                    }
                                </Upload>
                            </div>
                        </Form.Item>
                    </Form>) : (
                        modalType === 2 ? (<div>弹床1</div>) : (<div>弹窗2</div>)
                    )
                }
            </Modal>
        </Main>
    )
}

export default Slider;
