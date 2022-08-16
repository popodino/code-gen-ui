import React from 'react'
import { useNavigate,useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { Button, Breadcrumb } from 'antd';
import { logout } from "../../redux/slices/loginSlice"
import wrapIcon from '../../utils/wrapIcon';
import "./index.less"


export default function Header() {
    const user = useSelector(state => state.login.value)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    function dologout() {
        dispatch(logout())
        navigate("/login", { replace: true })
    }

    return (
        <div className='header'>
            <div className='header-top'>
                <span>Welcome {user.username}</span>
                <Button type="text" onClick={dologout}>Logout</Button>
            </div>
            <div className='header-bottom'>
                <Breadcrumb>
                    <Breadcrumb.Item>{wrapIcon('HomeOutlined')}</Breadcrumb.Item>
                    <Breadcrumb.Item>Code</Breadcrumb.Item>
                    <Breadcrumb.Item>{location.pathname === '/admin/code'? 'Code Generate':'Code Template'}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </div>
    )
}
