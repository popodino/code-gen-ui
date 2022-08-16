import React, { useState, useEffect, useRef } from 'react'
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
        render: (text, record, index) => <Form.Item name={record.columnId + '#columnComment'} initialValue={record.columnComment}><Input style={{ width: 100 }} /></Form.Item>
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
            <Form.Item name={record.columnId + '#javaType'} initialValue={record.javaType}>
                <Select style={{ width: 100 }} >
                    {JAVA_TYPE.map(item => <Option key={item} value={item}>{item}</Option>)}
                </Select>
            </Form.Item>
    },
    {
        title: 'Java Name',
        dataIndex: '',
        align: 'left',
        render: (text, record, index) => <Form.Item name={record.columnId + '#javaField'} initialValue={record.javaField}><Input style={{ width: 100 }} /></Form.Item>
    },
    {
        title: 'Insert',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Form.Item name={record.columnId + '#isInsert'} initialValue={record.isInsert} valuePropName="checked"><Checkbox /></Form.Item>
    },
    {
        title: 'Edit',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Form.Item name={record.columnId + '#isEdit'} initialValue={record.isEdit} valuePropName="checked"><Checkbox value={1} /></Form.Item>
    },
    {
        title: 'List',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Form.Item name={record.columnId + '#isList'} initialValue={record.isList} valuePropName="checked"><Checkbox /></Form.Item>
    },
    {
        title: 'Query',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Form.Item name={record.columnId + '#isQuery'} initialValue={record.isQuery} valuePropName="checked"><Checkbox /></Form.Item>
    },
    {
        title: 'Query Type',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) =>
            <Form.Item name={record.columnId + '#queryType'} initialValue={record.queryType}>
                <Select style={{ width: 100 }} >
                    {QUERY_TYPE.map(item => <Option key={item.name} value={item.value}>{item.name}</Option>)}
                </Select>
            </Form.Item>
    },
    {
        title: 'Required',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) => <Form.Item name={record.columnId + '#isRequired'} initialValue={record.isRequired} valuePropName="checked"><Checkbox /></Form.Item>
    },
    {
        title: 'Html Type',
        dataIndex: '',
        align: 'center',
        render: (text, record, index) =>
            <Form.Item name={record.columnId + '#htmlType'} initialValue={record.htmlType}>
                <Select style={{ width: 100 }} >
                    {HTML_TYPE.map(item => <Option key={item} value={item}>{item}</Option>)}
                </Select>
            </Form.Item>
    },
];




export default function EditPopup(props) {

    const { visible, cancel, tableId, tableName } = props
    const baseForm = useRef()
    const attrForm = useRef()
    const genForm = useRef()
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

    async function submit() {
        const baseValues = baseForm.current ? await baseForm.current.validateFields() : editInfo.info
        const attrValues = attrForm.current ? await attrForm.current.validateFields() : editInfo.rows
        let temp = 0
        let node = {}
        let rows = []
        for (var key in attrValues) {
            const [id, name] = key.split('#')
            if (temp !== 0 && temp !== id) {
                rows = [...rows, node]
                node = {}
            }
            temp = id
            node = { ...node, id, name }
            node[name] = attrValues[key]
        }

        console.log(rows)

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
                <Button key="submit" type="primary" loading={false} onClick={submit}>Submit</Button>,
            ]}>
            {editInfo.loading ? <div style={{ padding: '250px 0 0 0', textAlign: 'center' }}><Spin tip="Loading..." size="large" /></div> :
                <Tabs defaultActiveKey="2">
                    <TabPane tab='Base Info' key='1'>
                        <Form layout="vertical" ref={baseForm}>
                            <Row>
                                <Col span={12} className='formitem'>
                                    <Form.Item label="Table Name" name="tableName" required initialValue={editInfo.info.tableName}><Input /></Form.Item>
                                </Col>
                                <Col span={12} className='formitem'>
                                    <Form.Item label="Table Desc" name='tableComment' required initialValue={editInfo.info.tableComment}><Input /></Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} className='formitem'>
                                    <Form.Item label="Entity Name" name='className' required initialValue={editInfo.info.className}><Input /></Form.Item>
                                </Col>
                                <Col span={12} className='formitem'>
                                    <Form.Item label="Author Name" name='functionAuthor' required initialValue={editInfo.info.functionAuthor}><Input /></Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} className='formitem'>
                                    <Form.Item label="Remarks" name='remark' initialValue={editInfo.info.remark}><TextArea autoSize={{ minRows: 4, maxRows: 6 }} /></Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane tab='Attribute Info' key='2'>
                        <Form ref={attrForm} className='attr-form'>
                            <Table
                                columns={columns}
                                dataSource={editInfo.rows}
                                rowKey={(record) => record.columnId}
                                pagination={false}
                            />
                        </Form>
                    </TabPane>
                    {/* <TabPane tab='Genergate Info' key='3'>

                    </TabPane> */}
                </Tabs>}
        </Modal >
    )
}
