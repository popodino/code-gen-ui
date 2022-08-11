import React,{useState} from 'react'
import { Modal, Tabs, Button, message } from 'antd';
import hljs from 'highlight.js'
import copy from 'copy-to-clipboard';
import wrapIcon from "../../utils/wrapIcon"
import 'highlight.js/styles/github.css';
import './index.less'

const { TabPane } = Tabs;




export default function PreviewPopup(props) {
    const { sourceCode, isModalVisible, cancel } = props

    function createTabPane() {
        let node = [];
        for (var code in sourceCode) {
            const name = code.substring(code.lastIndexOf("/") + 1, code.length).replace(".vm", "")
            node = [...node, <TabPane tab={name} key={name} style={{position: 'relative'}}>
                <div className='code-content' dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(sourceCode[code]).value }}>
                </div>
                <Button source={code} onClick={(e) => copyContent(e.target.getAttribute('source'))} className='copy' type='text' size='large' icon={wrapIcon("CopyOutlined")}>Copy</Button>
            </TabPane>]
        }
        return node;
    }

    function copyContent(code){
        copy(sourceCode[code])
        message.success("copied success!")
    }

    return (
        <Modal
            title="View Source Code"
            centered
            transitionName=""
            visible={isModalVisible}
            width={1200}
            bodyStyle={{ height: 600, overflow: "auto" }}
            onCancel={() => cancel()}
            footer={null}>
            <Tabs defaultActiveKey="1">
                {createTabPane()}
            </Tabs>
        </Modal >
    )
}
