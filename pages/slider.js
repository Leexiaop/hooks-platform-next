import React, { useState, useEffect } from 'react';
import Main from '../layouts/main';
import { Button, Table, Modal, Popconfirm, message, Form, Input, Select, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const Slider = () => {
    const [isModalShow, setModalShow] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [modalTitle, setModalTitle] = useState('添加')
    const [offset, setOffset] = useState(1)
    const [form, setForm] = useState({})
    const [fileList, setFilelist]= useState([])
    const [total, setTotal] = useState(0)
    const [tableList, setTableList] = useState([]);
    const [positionList, setPositionList] = useState([])
    const [imgUrl, setImgUrl] = useState('')
    const [userInfo, setUserInfo] = useState({})
    useEffect(() => {
        setUserInfo(JSON.parse(window.localStorage.getItem('userinfo')))
        getInitData()
    }, [])
    const getInitData = async () => {
        const res = await fetch(`http://project_platform.lee.com/api/ad/slider?limit=10&offset=${offset}`, {
            headers: {
                Authorization: userInfo.token
            }
        })
        const data = await res.json()
        setTotal(data.data.total)
        const obj = await fetch(`http://project_platform.lee.com/api/ad/position`)
        const item = await obj.json()
        setTableList(data.data.lists.map(m => {
            item.data.lists.map(n => {
                if (m.position === n.id) {
                    m.positionName = n.position
                }
            })
            return { key: m.id, link: m.link, img: m.img, position: m.position, positionName: m.positionName }
        }))
        setPositionList(item.data.lists)
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: '位置',
            dataIndex: 'positionName',
            key: 'positionName'
        },
        {
            title: '图片地址',
            dataIndex: 'img',
            key: 'img'
        },
        {
            title: '跳转链接',
            dataIndex: 'link',
            key: 'link'
        },
        {
            title: '操作',
            key: 'action',
            render: (text) => {
                return (
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" size="middle" onClick={() => handModalShow(text, 3)}>编辑</Button>
                        <Button type="primary" ghost size="middle" onClick={() => handModalShow(text, 2)}>预览</Button>
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
    
    const handModalShow = (item, type) => {
        setModalType(type)
        setModalShow(true)
        setModalTitle(type === 1 ? '添加' : (type === 2 ? '图片预览' : '编辑'))
        if (!item) return
        if (type === 2) setImgUrl(item.img)
        if (type === 3) setFilelist([{uid: item.key, url: item.img}])
        setForm({ ...form, id: item.key, link: item.link, position: item.position, positionName: item.positionName })
    }
    const handleCancel = () => {
        setModalShow(false)
        setForm({})
        setFilelist([])
    }
    const handleOk = async () => {
        if (modalType === 2) {
            setModalShow(false)
            return
        }
        const res = await fetch('http://project_platform.lee.com/api/ad/slider', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form.id ? {
                id: form.id,
                position: form.position,
                img: form.img.response.data.url,
                link: form.link
            } : {
                position: form.position,
                img: form.img.response.data.url,
                link: form.link
            })
        })
        const data =  await res.json()
        if (data.code === 0) {
            setModalShow(false)
            setForm({})
            setFilelist([])
            getInitData()
            message.success(data.message)
        } else {
            message.error(data.message)
        }
    }
    const handleDelete = async (item) => {
        const res = await fetch(`http://project_platform.lee.com/api/ad/slider/${item.key}`, {
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
    const handleChange = ({fileList, file}) => {
        setForm({...form, img: file })
        setFilelist(fileList)
    }
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        setModalShow(true)
        setModalType(2)
        setModalTitle('查看图片')
        setImgUrl(file.url || file.preview)
      }
    const pagesChange = () => {
        setOffset(page)
        getInitData()
    }
    const getInputData = (e) => {
        form.link = e.target.value
    }
    const getSelectData = (value, option) => {
        form.position = option.key
    }
    return (
        <Main title='轮播图管理'>
            <Button type="primary" onClick={() => handModalShow(null, 1)}>添加</Button>
            <br />
            <br />
            <Table columns={columns} dataSource={tableList} pagination={{
                defaultCurrent: 1,
                pageSize: 10,
                total: total,
                onChange: (pageSize) => pagesChange(pageSize)
            }}/>
            <Modal
                title={modalTitle}
                visible={isModalShow}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                {
                    modalType === 1 || modalType === 3 ? (<Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        size={'large'}
                    >
                        <Form.Item label="跳转地址">
                            <Input defaultValue={form.link} onChange={getInputData}/>
                        </Form.Item>
                        <Form.Item label="位置">
                            <Select placeholder="请选择广告位位置" onChange={getSelectData} defaultValue={form.positionName}>
                                {
                                    positionList.map(position => {
                                        return <Select.Option value={position.position} key={position.id}>{position.position}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="上传图片">
                            <div className="clearfix">
                                <Upload
                                    name="file"
                                    multiple={false}
                                    headers={{ Accept: 'application/json'}}
                                    accept="image/jpg, image/png"
                                    action="http://project_platform.lee.com/api/upload"
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
                        <img src= {imgUrl} style={{width: '100%', height: 'auto'}}/>
                    )
                }
            </Modal>
        </Main>
    )
}

export default Slider;
