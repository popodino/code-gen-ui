import React, { useState, useEffect, Fragment, useRef } from 'react'
import { Form, Tabs, Button, message, Spin } from 'antd';
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from 'axios'
import './index.less'


const { TabPane } = Tabs;
const tabNames = [
  { name: 'javaDomain', title: 'Domain.java' },
  { name: 'javaMapper', title: 'Mapper.java' },
  { name: 'javaService', title: 'Service.java' },
  { name: 'javaServiceimpl', title: 'ServiceImpl.java' },
  { name: 'javaController', title: 'Controller.java' },
  { name: 'mapperXml', title: 'Mapper.xml' },
  { name: 'systemSql', title: 'Sql' },
  { name: 'apiJs', title: 'Api.js' },
  { name: 'indexVue', title: 'Index.vue' },
  { name: 'indexReact', title: 'Index.jsx' }
]

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

        if (response.data.code === 200) {
          getCodeTemplate()
          message.success(response.data.msg)
        } else {
          setCodeTemplate({ ...codeTemplate, updating: false })
          message.error(response.data.msg)
        }

      },
      error => {
        message.error(error.message)
      }
    );
  }

  function changeCode(e, name) {
    const temp = codeTemplate.data
    temp[name] = e.currentTarget.value
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
              <Tabs defaultActiveKey="1">{
                tabNames.map(item => (<TabPane tab={item.title} key={item.name}>
                  <div className='codeContainer'>
                    {/* <Form.Item name={item} initialValue={codeTemplate.data[item]}>
                      <TextArea autoSize={{ minRows: 30, maxRows: 30 }} />
                    </Form.Item> */}
                    <CodeEditor
                      value={codeTemplate.data[item.name]}
                      language={item.title.substring(item.title.indexOf('.') + 1)}
                      placeholder="enter the source code."
                      onChange={(e) => changeCode(e, item.name)}
                      padding={15}
                      className='editer'
                    />
                  </div>
                </TabPane>))
              } </Tabs>
            </Form>
            <div><Button key="submit" type="primary" loading={codeTemplate.updating} onClick={updateCodeTemplate} className='submitBtn'>Submit</Button></div>
          </Fragment>
      }

    </Fragment>
  )
}
