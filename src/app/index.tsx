import '../styles/_global.scss';
import {h, render} from 'preact';
import {App}       from './App';

render(
    <App/>,
    document.getElementById('app') as HTMLElement
);


