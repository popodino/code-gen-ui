import React from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { Menu  } from 'antd';
import menulist from "../../config/menuConfig"
import loginImg from '../../assets/images/logo.png';
import './index.less'

export default function LeftNav() {
    const navigate = useNavigate()

    const onClick = (e) => {
        navigate(e.key)
      };

    return (
        <div className='left-nav'>
            <Link to="/admin/code" className='left-nav-header'>
                <img src={loginImg} alt="" />
                <h1>Code Generate</h1>
            </Link>
            <div className='left-nav-menu'>
                <Menu
                    defaultSelectedKeys={"/admin/code"}
                    defaultOpenKeys={"/admin/code"}
                    theme="dark"
                    items={menulist}
                    onClick={onClick}/>
            </div>
        </div>
    )
}
