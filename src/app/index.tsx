import {h, render} from 'preact';
import '../styles/_global.scss';
import {App}       from './App';

render(
    <App/>,
    document.getElementById('app'
) as HTMLElement);



