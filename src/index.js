import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import 'whatwg-fetch';
import './style/index.scss';

const INITIAL = {};
const store = createStore( reducer, INITIAL, typeof window.devToolsExtension==='function' ? window.devToolsExtension() : undefined);

let fontsize = 12;

if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
	const size = window.innerWidth/24;
	//移动端
	fontsize = size > 16 ? 16 : size;
}

document.body.style.fontSize = `${fontsize}px`;

let root;
function init() {
	let App = require('./components/app').default;
	root = render(<Provider store={store}>
		<App />
	</Provider>, document.body, root);
}

init();



