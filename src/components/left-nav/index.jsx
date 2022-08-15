import React from 'react'
import { Link,useNavigate,useLocation  } from 'react-router-dom';
import { Menu  } from 'antd';
import menulist from "../../config/menuConfig"
import loginImg from '../../assets/images/logo.png';
import './index.less'

export default function LeftNav() {
    const navigate = useNavigate()
    const location = useLocation();

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
                    defaultSelectedKeys={location.pathname}
                    defaultOpenKeys={location.pathname}
                    theme="dark"
                    items={menulist}
                    onClick={onClick}/>
            </div>
        </div>
    )
}
