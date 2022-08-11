import {React} from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {login} from "../../redux/slices/loginSlice"
import loginImg from '../../assets/images/logo.png';
import "./index.less";

export default function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    function onFinish(values) {
        // TODO: call backend api to login
        const { username, password } = values

        if (username === "root" && password === "password") {
            dispatch(login(values))
            message.success("login success!")
            navigate("/admin", { replace: true })
        } else {
            message.error("invalid username or password！")
        }
    }

    function validatePWD(rule, value, callback) {
        return new Promise((resolve, reject) => {
            if (value === undefined || !value.trim()) reject('password required')
            // else if (value.length < 4) reject('长度不小于4位')
            // else if (value.length > 12) reject('长度不大于12位')
            else if (!/^[a-zA-Z0-9_]+$/.test(value)) reject('invalid password')
            else resolve()
        })
    }

    return (
        <div className='login'>
            <header className='login-header'>
                <img src={loginImg} alt="" />
                <h1>Code-Generate</h1>
            </header>
            <section className='login-content'>
                <h2>Login</h2>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}

                    onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        // 声明式验证：直接使用antd库提供的验证
                        rules={[
                            { required: true, message: 'username required' },
                            // { min: 4, message: '用户名至少4位' },
                            // { max: 12, message: '用户名最多12位' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: 'invalid username' },
                            { whitespace: true }
                        ]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { validator: validatePWD }
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </section>
        </div>
    )
}