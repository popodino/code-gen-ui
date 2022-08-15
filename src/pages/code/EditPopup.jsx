import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, Table, Form, message, Tabs, Spin, Select, Checkbox, Col, Row } from 'antd';
import axios from 'axios'
import './index.less'
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const JAVA_TYPE = ['Long', 'String', 'Integer', 'Double', 'BigDecimal', 'Date', 'Boolean']
const HTML_TYPE = ['input', 'textarea', 'dropdown', 'radio', 'checkbox', 'date', 'img']
const QUERY_TYPE = [{ value: 'EQ', name: '=' }, { value: 'NE', name: '!=' }, { value: 'GT', name: '>' }, { value: 'GTE', name: '>=' },
                    { value: 'LT', name: '<' }, { value: 'LTE', name: '<=' }, { value: 'LIKE', name: 'Like' }, { value: 'BETWEEN', name: 'Between' }]

const columns = [
    {
        title: 'SNo',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Col Name',
        dataIndex: 'columnName',
        align: 'left',
    },
    {
        title: 'Col Comment',
        dataIndex: '',
        align: 'left',
        render: (text, record, index) => <Input style={{ width: 100 }} value={record.columnComment}></Input>
    },
    {
        title: 'Col Type',
        dataIndex: 'columnType',
        align: 'left',
    },
    {
        title: 'Java Type',
        dataIndex: '',
        align: 'left',
        render: (text, record, index) =>
            <Select style={{ width: 100 }} defaultValue={record.javaType} onChange={() => { }}>
                {JAVA_TYPE.map(item => <Option key={item} value={item}>{item}</Option>)}
            </Select>
    },
    {
        title: 'Java Name',
        dataIndex: '',
        align: 'left',
        render: (text, record, index) => <Input style={{ width: 100 }} value={record.javaField}></Input>
    },
    {
        title: 'Insert',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Checkbox checked={record.isInsert} onChange={() => { }}></Checkbox>
    },
    {
        title: 'Edit',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Checkbox checked={record.isEdit} onChange={() => { }}></Checkbox>
    },
    {
        title: 'List',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Checkbox checked={record.isList} onChange={() => { }}></Checkbox>
    },
    {
        title: 'Query',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Checkbox checked={record.isQuery} onChange={() => { }}></Checkbox>
    },
    {
        title: 'Query Type',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) =>
            <Select style={{ width: 100 }} defaultValue={record.queryType} onChange={() => { }}>
                {QUERY_TYPE.map(item => <Option key={item.name} value={item.value}>{item.name}</Option>)}
            </Select>
    },
    {
        title: 'Required',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Checkbox checked={record.isRequired} onChange={() => { }}></Checkbox>
    },
    {
        title: 'Html Type',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) =>
            <Select style={{ width: 100 }} defaultValue={record.htmlType} onChange={() => { }}>
                {HTML_TYPE.map(item => <Option key={item} value={item}>{item}</Option>)}
            </Select>
    },
];




export default function EditPopup(props) {

    const { visible, cancel, tableId, tableName } = props
    const [editInfo, setEditInfo] = useState({
        info: {},
        rows: [],
        tables: [],
        loading: false,
    })

    function getGenerateDetail() {

        setEditInfo({ loading: true })

        axios({
            method: 'get',
            url: `/${tableId}`
        }).then(
            response => {
                setEditInfo({ ...editInfo, ...response.data.data, loading: false })
            },
            error => {
                message.error(error.message)
            }
        )
    }

    // eslint-disable-next-line
    useEffect(() => getGenerateDetail(), [])

    return (
        <Modal
            title={"Edit '" + tableName + "' Generate Detail"}
            centered
            transitionName=""
            maskClosable={false}
            visible={visible}
            width={'80%'}
            bodyStyle={{ height: 600, overflow: "auto" }}
            onCancel={() => cancel()}
            footer={[
                <Button key="Cancel" onClick={cancel}>Cancel</Button>,
                <Button key="submit" type="primary" loading={false} onClick={() => { }}>Submit</Button>,
            ]}>
            {editInfo.loading ? <div style={{ padding: '250px 0 0 0', textAlign: 'center' }}><Spin tip="Loading..." size="large" /></div> :
                <Tabs defaultActiveKey="2">
                    <TabPane tab='Base Info' key='1'>
                        <Form
                            layout="vertical"
                        >
                            <Row>
                                <Col span={12} className='formitem'>
                                    <Form.Item label="Table Name" required>
                                        <Input value={editInfo.info.tableName} />
                                    </Form.Item>
                                </Col>
                                <Col span={12} className='formitem'>
                                    <Form.Item label="Table Desc" required>
                                        <Input value={editInfo.info.tableComment} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} className='formitem'>
                                    <Form.Item label="Entity Name" required>
                                        <Input value={editInfo.info.className} />
                                    </Form.Item>
                                </Col>
                                <Col span={12} className='formitem'>
                                    <Form.Item label="Author Name" required>
                                        <Input value={editInfo.info.functionAuthor} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} className='formitem'>
                                    <Form.Item label="Remarks">
                                        <TextArea value={editInfo.info.remark} rows={4} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane tab='Attribute Info' key='2'>
                        <Table
                            columns={columns}
                            dataSource={editInfo.rows}
                            rowKey={(record) => record.columnId}
                            pagination={false}
                        />
                    </TabPane>
                    {/* <TabPane tab='Genergate Info' key='3'>

                    </TabPane> */}
                </Tabs>}
        </Modal >
    )
}
