import React, { useState, Fragment, useEffect } from 'react'
import { Modal, Layout, Button, Input, Table, Space, message } from 'antd';
import axios from 'axios'
import wrapIcon from "../../utils/wrapIcon"
import './index.less'

const PAGESIZE = 5
const { Content } = Layout;

const columns = [
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
        title: 'Created Time',
        dataIndex: 'createTime',
        align: 'center',
    },
    {
        title: 'Update Time',
        dataIndex: 'updateTime',
        align: 'center',
    },
];




export default function ImportTablePopup(props) {

    const { visible, cancel, submit } = props
    const [dbList, setDbList] = useState({
        data: [],
        total: 0,
        pageNum: 1,
        loading: false,
        importiong: false,
        tableName: '',
        tableComment: '',
        selectedTables: ''
    })

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            if(selectedRows.length === 0){
                return setDbList({ ...dbList, selectedTables: ''})
            }
            let selected = ''
            selectedRows.forEach(element => {
                selected += "," + element.tableName
            });

            setDbList({ ...dbList, selectedTables: selected.substring(1) })
        }
    };

    function getDbTables(pageNum) {

        const { tableName, tableComment } = dbList
        setDbList({ loading: true })
        axios({
            method: 'get',
            url: `/db/list/?pageNum=${pageNum}&pageSize=${PAGESIZE}&tableName=${tableName || ''}&tableComment=${tableComment || ''}`
        }).then(
            response => {
                setDbList({ ...dbList, data: response.data.rows, total: response.data.total, pageNum })
            },
            error => {
                message.error(error.message)
            }
        )
    }

    function submitImport() {

        const { selectedTables } = dbList
        if (selectedTables === '') { return message.warning('please select the table!') }
        setDbList({ ...dbList, importiong: true })

        axios({
            method: 'post',
            url: `/importTable?tables=${selectedTables}`
        }).then(
            response => {
                message.success('imported success!')
                submit()
            },
            error => {
                message.error(error.message)
            }
        )
    }

    // eslint-disable-next-line
    useEffect(() => getDbTables(1), [])

    return (
        <Modal
            title="Import Table"
            centered
            transitionName=""
            maskClosable={false}
            visible={visible}
            width={900}
            bodyStyle={{ height: 500, overflow: "auto" }}
            onCancel={cancel}
            footer={[
                <Button key="Cancel" onClick={cancel}>Cancel</Button>,
                <Button key="submit" type="primary" loading={dbList.importiong} onClick={submitImport}>Submit</Button>,
            ]}>

            <Layout style={{ backgroundColor: "white" }}>
                <Fragment >
                    <Space>
                        Table Name <Input value={dbList.tableName} placeholder="Name" onChange={e => setDbList({ ...dbList, tableName: e.target.value })} />
                        Table Desc <Input value={dbList.tableComment} placeholder="Description" onChange={e => setDbList({ ...dbList, tableComment: e.target.value })} />
                        <Button type="primary" onClick={() => getDbTables(1)} icon={wrapIcon("SearchOutlined")}>Search</Button>
                        <Button onClick={() => setDbList({ ...dbList, tableName: '', tableComment: '' })} icon={wrapIcon("SyncOutlined")}>Reset</Button>
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
                            dataSource={dbList.data}
                            rowKey={(record) => record.tableName}
                            loading={dbList.loading}
                            pagination={
                                {
                                    current: dbList.pageNum,
                                    total: dbList.total,
                                    loading: dbList.loading,
                                    defaultPageSize: PAGESIZE,
                                    onChange: getDbTables
                                }
                            }
                        />
                    </div>
                </Content>
            </Layout>
        </Modal >
    )
}
