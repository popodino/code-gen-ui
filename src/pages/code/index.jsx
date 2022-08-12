import React, { Fragment, useState, useEffect } from 'react'
import { Layout, Button, Input, DatePicker, Space, Table, message, Popconfirm, Modal } from 'antd';
import axios from 'axios'
import { saveAs } from "file-saver"
import PreviewPopup from './PreviewPopup'
import ImportTablePopup from './ImportTablePopup';
import wrapIcon from "../../utils/wrapIcon"
import "./index.less"

const PAGESIZE = 10
const { Content } = Layout;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

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
                <Button onClick={() => setList({ ...list, showPreview: true, currentTableId: record.tableId })} type='link' size="small" icon={wrapIcon("EyeOutlined")}>View</Button>
                <Button type='link' size="small" icon={wrapIcon("EditOutlined")}>Edit</Button>
                <Button onClick={() => deleteTable(record.tableId,record.tableName)} type='link' size="small" icon={wrapIcon("DeleteOutlined")}>Delete</Button>
                <Popconfirm
                    title={"Are you sure to sync the '" + record.tableName + "' table structure?"}
                    onConfirm={() => syncTable(record.tableName)}
                >
                    <Button type='link' size="small" icon={wrapIcon("SyncOutlined")}>Sync</Button>
                </Popconfirm>
                <Button onClick={() => download(record.tableName)} type='link' size="small" icon={wrapIcon("DownloadOutlined")}>Generate</Button>
            </div>,
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRows.length === 0) {
                return setList({ ...list, selectedTableIds: '', selectedTableNames: '' })
            }
            
            let  selectedNames = ''
            let  selectedIds  = ''
            selectedRows.forEach(element => {
                selectedIds += "," + element.tableId
                selectedNames += "," + element.tableName
            });
            setList({ ...list, selectedTableIds: selectedIds.substring(1), selectedTableNames: selectedNames.substring(1) })
        }
    };

    const [list, setList] = useState({
        total: 0,
        data: [],
        pageNum: 1,
        loading: false,
        tableName: '',
        tableComment: '',
        showPreview: false,
        showImport: false,
        selectedTableNames: '',
        selectedTableIds: '',
        currentTableId: 0
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
                    pageNum,
                    loading: false,
                    showImport: false
                })
            },
            error => {
                message.error(error.message)
            }
        )
    }

    async function download(tableName) {
        if (tableName === '') { return message.warning('please select the table!') }
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

    async function deleteTable(tableIds,tableNames) {
        if (tableIds === '') { return message.warning('please select the table!') }
        confirm({
            title: `Do you Want to delete ${tableNames}?`,
            icon: wrapIcon('ExclamationCircleOutlined'),
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios({
                    method: 'delete',
                    url: `/${tableIds}`,
                }).then(
                    response => {
                        if (response.data.code === 200) {
                            getTables(list.pageNum)
                            message.success(response.data.msg)
                        } else {
                            message.error(response.data.msg)
                        }
                    },
                    error => {
                        message.error(error.message)
                    }
                )
            },
        });
    }

    async function syncTable(tableName) {
        await axios({
            method: 'get',
            url: `/synchDb/${tableName}`,
        }).then(
            response => {
                if (response.data.code === 200) {
                    getTables(list.pageNum)
                    message.success(response.data.msg)
                } else {
                    message.error(response.data.msg)
                }
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
                    <Button onClick={() => download(list.selectedTableNames)} icon={wrapIcon("DownloadOutlined")} className="generate">Generage</Button>
                    <Button onClick={() => setList({ ...list, showImport: true })} icon={wrapIcon("CloudUploadOutlined")} className="import">Import</Button>
                    <Button icon={wrapIcon("EditOutlined")} className="edit">Edit</Button>
                    <Button onClick={() => deleteTable(list.selectedTableIds,list.selectedTableNames)} icon={wrapIcon("DeleteOutlined")} className="delete">Delete</Button>
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
                        rowKey={(record) => record.tableId}
                        loading={list.loading}
                        pagination={
                            {
                                current: list.pageNum,
                                total: list.total,
                                loading: list.loading,
                                defaultPageSize: PAGESIZE,
                                onChange: getTables
                            }
                        }
                    />
                </div>
            </Content>
            {list.showPreview ?
                <PreviewPopup visible={list.showPreview} cancel={() => setList({ ...list, showPreview: false })} currentTableId={list.currentTableId} /> :
                <Fragment />}
            {list.showImport ?
                <ImportTablePopup visible={list.showImport} cancel={() => setList({ ...list, showImport: false })} submit={() => getTables(1)} /> :
                <Fragment />}


        </Layout>
    )
}
