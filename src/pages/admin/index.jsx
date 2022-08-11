import React from 'react'
import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from 'react-redux'
import { Layout } from 'antd';
import Header from '../../components/header';
import LeftNav from '../../components/left-nav';
export default function Admin() {
  const user = useSelector(state => state.login.value)
  const { Footer, Sider, Content } = Layout;
  if (true) {
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <div style={{ backgroundColor: "white", padding: "10px 25px 10px 25px", height: "100%" }}>
            <Content style={{ backgroundColor: "white", height: "100%", width: "100%" }}>
              <Outlet />
            </Content>
          </div>
          <Footer style={{ textAlign: "center", backgroundColor: "#f0f2f5" }}></Footer>
        </Layout>
      </Layout>
    )
  } else {
    return (<Navigate to='/login' />)
  }

}
