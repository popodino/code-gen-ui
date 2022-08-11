import React from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector ,useDispatch} from 'react-redux'
import { Button } from 'antd';
import {logout} from "../../redux/slices/loginSlice"
import "./index.less"


export default function Header() {
    const user = useSelector(state => state.login.value)
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
                {/*<div className='header-bottom-left'>xxx</div>
                 <div className='header-bottom-right'>
                    <span>xxx</span>
                    <span>xxx</span>
                    <span>xxx</span>
                </div> */}
            </div>
        </div>
    )
}
