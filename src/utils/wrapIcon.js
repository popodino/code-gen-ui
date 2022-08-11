import React from "react";
import * as Icon from '@ant-design/icons';
export default function wrapIcon(strIcon){
    return React.createElement(Icon[strIcon])
}
