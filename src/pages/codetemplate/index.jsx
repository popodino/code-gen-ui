import React, { useState, useEffect, Fragment, useRef } from 'react'
import { Form, Tabs, Button, message, Spin, Input } from 'antd';
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from 'axios'
import './index.less'


const { TabPane } = Tabs;
const { TextArea } = Input;
const tabNames = {
  'javaDomain': { title: 'Domain.java', type: 'java' },
  'javaMapper': { title: 'Mapper.java', type: 'java' },
  'javaService': { title: 'Service.java', type: 'java' },
  'javaServiceimpl': { title: 'ServiceImpl.java', type: 'java' },
  'javaController': { title: 'Controller.java', type: 'java' },
  'mapperXml': { title: 'Mapper.xml', type: 'xml' },
  'systemSql': { title: 'Sql', type: 'sql' },
  'apiJs': { title: 'Api.js', type: 'javascript' },
  'indexVue': { title: 'Index.vue', type: 'javascript' },
  'indexReact': { title: 'Index.jsx', type: 'javascript' }
}

export default function CodeTemplate() {

  const [codeTemplate, setCodeTemplate] = useState({
    data: {},
    loading: false,
    updating: false
  })

  const formRef = useRef()

  function getCodeTemplate() {

    setCodeTemplate({ loading: true })

    axios({
      method: 'get',
      url: `/template/1`
    }).then(
      response => {
        setCodeTemplate({ data: response.data.data })
      },
      error => {
        message.error(error.message)
      }
    )
  }

  async function updateCodeTemplate() {
    setCodeTemplate({ ...codeTemplate, updating: true })
    // let {
    //   javaDomain, javaMapper, javaService,
    //   javaServiceimpl, javaController, mapperXml,
    //   systemSql, apiJs, indexVue, indexReact
    // } = await formRef.current.validateFields()

    // const record = {
    //   id: codeTemplate.data.id, javaDomain, javaMapper, javaService,
    //   javaServiceimpl, javaController, mapperXml,
    //   systemSql, apiJs, indexVue, indexReact
    // }

    await axios({
      method: 'put',
      url: '/template',
      data: codeTemplate.data
    }).then(
      response => {
        getCodeTemplate()
        message.success(response.data.msg)
      },
      error => {
        message.error(error.message)
      }
    );
  }


  function createTabPane() {
    let node = []
    for (var name in tabNames) {
      node = [...node, <TabPane tab={tabNames[name].title} key={name}>
        <div className='codeContainer'>
          {/* <Form.Item name={item} initialValue={codeTemplate.data[item]}>
            <TextArea autoSize={{ minRows: 30, maxRows: 30 }} />
          </Form.Item> */}
          <CodeEditor
            value={codeTemplate.data[name]}
            language={tabNames[name].type}
            placeholder="enter the source code."
            onChange={(e) => changeCode(e, name)}
            padding={15}
            className='editer'
          />
        </div>
      </TabPane>]
    }
    return node
  }

  function changeCode(e, name) {
    const temp = codeTemplate.data
    temp[name] = e.currentTarget.value
    console.log(temp)
    setCodeTemplate({ ...codeTemplate, data: temp })
  }

  // eslint-disable-next-line
  useEffect(() => getCodeTemplate(), [])

  return (
    <Fragment>
      {
        codeTemplate.loading ? <div style={{ padding: '250px 0 0 0', textAlign: 'center' }}><Spin tip="Loading..." size="large" /></div> :
          <Fragment>
            <Form ref={formRef} disabled={codeTemplate.updating}>
              <Tabs defaultActiveKey="1">{createTabPane()} </Tabs>
            </Form>
            <div><Button key="submit" type="primary" loading={codeTemplate.updating} onClick={updateCodeTemplate} className='submitBtn'>Submit</Button></div>
          </Fragment>
      }

    </Fragment>
  )
}
