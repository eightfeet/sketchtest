import preact, { h, Component } from 'preact';
import ReactDOM from 'react-dom';
import MaskSpin from '~/components/Loading/MaskSpin';

class Loading {
	constructor(component) {
		this.component = component;
		this.container = null;
		this.counter = 0;
	}

	show = () => {
		this.counter++;

		if (this.counter === 1) {
			this.create();
		}
	}

	hide = () => {
		this.counter = this.counter < 0 ? 0 : this.counter - 1;

		if (this.counter === 0) {
			this.destory();
		}
	}

	reset = () => {
		this.destory();
		this.counter = 0;
	}

	create = () => {
		if (!this.container) {
			this.container = window.document.createElement('div');
			window.document.body.appendChild(this.container);

			ReactDOM.render(h(
				this.component,
				{ show: true, fixed: true }
			), this.container);
		}
	}

	destory = () => {
		if (this.container) {
			ReactDOM.unmountComponentAtNode(this.container);
			window.document.body.removeChild(this.container);

			this.container = null;
		}
	}
}

export default new Loading(MaskSpin);
