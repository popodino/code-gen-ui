import React, { useState,useEffect } from 'react'
import { Modal, Tabs, Button, message,Spin } from 'antd';
import axios from 'axios'
import hljs from 'highlight.js'
import copy from 'copy-to-clipboard';
import wrapIcon from "../../utils/wrapIcon"
import 'highlight.js/styles/github.css';
import './index.less'

const { TabPane } = Tabs;

export default function PreviewPopup(props) {
    const { currentTableId, visible, cancel } = props
    const [sourceCode, setSourceCode] = useState({
        data: {},
        loading: false
    })

    function getSourceCode() {

        setSourceCode({ loading: true })

        axios({
            method: 'get',
            url: `/preview/${currentTableId}`
        }).then(
            response => {
                setSourceCode({ data: response.data.data })
            },
            error => {
                message.error(error.message)
            }
        )
    }

    function createTabPane() {
        let node = [];
        for (var code in sourceCode.data) {
            const name = code.substring(code.lastIndexOf("/") + 1, code.length).replace(".vm", "")
            node = [...node, <TabPane tab={name} key={name} style={{ position: 'relative' }}>
                <div className='code-content' dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(sourceCode.data[code]).value }}>
                </div>
                <Button codename={code} onClick={(e) => copyContent(e)} className='copy' type='text' size='large' icon={wrapIcon("CopyOutlined")}></Button>
            </TabPane>]
        }
        return node;
    }

    function copyContent(e) {
        const code = e.currentTarget.getAttribute('codename')
        copy(sourceCode.data[code])
        message.success("copied success!")
    }

    // eslint-disable-next-line
    useEffect(() => getSourceCode(), [])

    return (
        <Modal
            title="View Source Code"
            centered
            transitionName=""
            maskClosable= {false}
            visible={visible}
            width={1200}
            bodyStyle={{ height: 600, overflow: "auto" }}
            onCancel={() => cancel()}
            footer={null}>

            {sourceCode.loading ? <div style={{padding:'250px 0 0 0' ,textAlign:'center'}}><Spin tip="Loading..." size="large" /></div> : 
                <Tabs defaultActiveKey="1"> {createTabPane()} </Tabs>}
        </Modal >
    )
}
