import { Navigate } from "react-router-dom"
import Login from "../pages/login";
import Admin from "../pages/admin";
import Code from "../pages/code";
import CodeTemplate from "../pages/codetemplate";

export default function routes() {
    return [
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/admin",
            element: <Admin />,
            children: [
                {
                    path: "code",
                    element: <Code />
                },
                {
                    path: "template",
                    element: <CodeTemplate />
                }
            ]
        },
        {
            path: "/*",
            element: <Navigate to="/admin/Code" />
        }
    ];
}