import React, { Fragment, useState, useEffect } from 'react'
import { Layout, Button, Input, DatePicker, Space, Table, message, Popconfirm } from 'antd';
import axios from 'axios'
import { saveAs } from "file-saver"
import PreviewPopup from './PreviewPopup'
import wrapIcon from "../../utils/wrapIcon"
import "./index.less"

const PAGESIZE = 10


const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
    }),
};




export default function Code() {

    const columns = [
        {
            title: 'SNo',
            dataIndex: '',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Table Name',
            dataIndex: 'tableName',
            align: 'center',
        },
        {
            title: 'Table Desc',
            dataIndex: 'tableComment',
            align: 'center',
        },
        {
            title: 'Table Entity',
            dataIndex: 'className',
            align: 'center',
        },
        {
            title: 'Created Time',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: 'Update Time',
            dataIndex: 'updateTime',
            align: 'center',
        },
        {
            title: 'Actions',
            dataIndex: '',
            align: 'center',
            render: (text, record, index) => <div className='actionmenu'>
                <Button onClick={() => getSourceCode(record.tableId)} type='link' size="small" icon={wrapIcon("EyeOutlined")}>View</Button>
                <Button type='link' size="small" icon={wrapIcon("EditOutlined")}>Edit</Button>

                <Popconfirm
                    title={"Are you sure to delete the '" +record.tableName + "' ?"}
                    onConfirm={() =>deleteTable(record.tableId)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type='link' size="small" icon={wrapIcon("DeleteOutlined")}>Delete</Button>
                </Popconfirm>
                
                <Popconfirm
                    title={"Are you sure to sync the '" +record.tableName + "' table structure?"}
                    onConfirm={() =>syncTable(record.tableName)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type='link' size="small" icon={wrapIcon("SyncOutlined")}>Sync</Button>
                </Popconfirm>
                <Button onClick={() => downloadOne(record.tableName)} type='link' size="small" icon={wrapIcon("DownloadOutlined")}>Generate</Button>
            </div>,
        },
    ];

    const { Content } = Layout;
    const { RangePicker } = DatePicker;
    const [list, setList] = useState({
        total: 0,
        data: [],
        pageNum: 1,
        loading: false,
        tableName: '',
        tableComment: '',
        showPreview:false,
        sourceCode:{}
    })

    async function getTables(pageNum) {
        const { tableName, tableComment } = list
        setList({ ...list, loading: true })

        await axios({
            method: 'get',
            url: `/list?pageNum=${pageNum}&pageSize=${PAGESIZE}&tableName=${tableName || ''}&tableComment=${tableComment || ''}`
        }).then(
            response => {
                setList({
                    ...list,
                    total: response.data.total,
                    data: response.data.rows,
                    loading: false
                })
            },
            error => {
                message.error(error.message)
            }
        )
    }

    async function downloadOne(tableName) {
        await axios({
            method: 'get',
            url: `/batchGenCode?tables=${tableName}`,
            responseType: 'blob'
        }).then(
            response => {
                const blob = new Blob([response.data], { type: 'application/zip' })
                saveAs(blob, tableName)
            },
            error => {
                message.error(error.message)
            }
        )
    }

    async function deleteTable(tableIds) {
        await axios({
            method: 'delete',
            url: `/${tableIds}`,
        }).then(
            response => {
                if(response.data.code === 200){
                    getTables(list.pageNum)
                    message.success(response.data.msg)
                }else{
                    message.error(response.data.msg)
                }
            },
            error => {
                message.error(error.message)
            }
        )
    }

    async function syncTable(tableName) {
        await axios({
            method: 'get',
            url: `/synchDb/${tableName}`,
        }).then(
            response => {
                if(response.data.code === 200){
                    getTables(list.pageNum)
                    message.success(response.data.msg)
                }else{
                    message.error(response.data.msg)
                }
            },
            error => {
                message.error(error.message)
            }
        )
    }

    async function getSourceCode(currentTableId) {
        axios({
            method: 'get',
            url: `/preview/${currentTableId}`
        }).then(
            response => {
                setList({ ...list, showPreview: true,sourceCode:response.data.data})
            },
            error => {
                message.error(error.message)
            }
        )
    }

    // eslint-disable-next-line
    useEffect(() => { getTables(1) }, [])


    return (
        <Layout style={{ backgroundColor: "white" }}>
            <Fragment >
                <Space className='search'>
                    Table Name <Input value={list.tableName} placeholder="Name" onChange={e => setList({ ...list, tableName: e.target.value })} />
                    Table Desc <Input value={list.tableComment} placeholder="Description" onChange={e => setList({ ...list, tableComment: e.target.value })} />
                    Created Time <RangePicker />
                    <Button type="primary" onClick={() => getTables(1)} icon={wrapIcon("SearchOutlined")}>Search</Button>
                    <Button onClick={() => setList({ ...list, tableName: '', tableComment: '' })} icon={wrapIcon("SyncOutlined")}>Reset</Button>
                </Space>
                <Space className='actions'>
                    <Button icon={wrapIcon("DownloadOutlined")} className="generate">Generage</Button>
                    <Button icon={wrapIcon("CloudUploadOutlined")} className="import">Import</Button>
                    <Button icon={wrapIcon("EditOutlined")} className="edit">Edit</Button>
                    <Button icon={wrapIcon("DeleteOutlined")} className="delete">Delete</Button>
                </Space>
            </Fragment>
            <Content>
                <div className='codelist'>
                    <Table
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={list.data}
                        rowKey='tableId'
                        loading={list.loading}
                    />
                </div>
            </Content>
            <PreviewPopup isModalVisible={list.showPreview} cancel = {() =>  setList({ ...list, showPreview: false})} sourceCode= {list.sourceCode}/>
        </Layout>
    )
}
