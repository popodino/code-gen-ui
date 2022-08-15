
import wrapIcon from '../utils/wrapIcon'

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const menuList = [
  getItem('Code Generate','/admin/code', wrapIcon('CodeOutlined')),
  getItem('Code Template','/admin/template', wrapIcon('ControlOutlined'))
]

export default menuList