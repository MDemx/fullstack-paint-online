import './styles/App.scss'
import {Toolbar} from "./components/Toolbar";
import {SettingsBar} from "./components/SettingsBar";
import {Canvas} from "./components/Canvas";
import 'antd/dist/antd.css';
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component'

const App = () => {
    return (
        <BrowserRouter>
            <div className='app'>
                <Switch>
                    <Route path='/:id'>
                        <ReactNotification />
                        <Toolbar/>
                        <SettingsBar/>
                        <Canvas/>
                    </Route>
                    <Redirect to={`f${((+new Date()).toString(16))}`}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
