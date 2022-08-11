import {Fragment} from 'react';
import {useRoutes} from 'react-router-dom'
import routes from "./route"
import './App.less';

export default function App() {
  const elements = useRoutes(routes());
  return (
    <Fragment>
      {elements}
    </Fragment>
  );
}
