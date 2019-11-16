import { h, Component } from 'preact';
import { Router } from 'preact-router';
import Loadable from "react-loadable";
import history from '~/core/history';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import { setRuntimeVariable } from '~/actions';
import MaskSpin from '~/components/Loading/MaskSpin';
import Loading from '~/components/Loading';
import request from '~/core/request';
import getPath from '~/core/getPath';

// Code-splitting is automated for routes
// import Home from '~/routes/home';
// import List from '~/routes/list';
// import SView from '~/routes/view';

const Home = Loadable({
	loader: () => import('~/routes/home'),
	loading: MaskSpin
});

const List = Loadable({
	loader: () => import('~/routes/list'),
	loading: MaskSpin
});

const SView = Loadable({
	loader: () => import('~/routes/view'),
	loading: MaskSpin
});

class App extends Component {

	constructor(props){
		super(props);
		this.state={
			isBody: false
		};
	}
	
	handleRoute = (e) => {
		const {path, source, projectname} = e.current.attributes;
		let rootPath = '';
		if (path.indexOf('/:source/:projectname') !== -1 ) {
			rootPath = `/${source}/${projectname}/`;
		}

		this.props.setStore({
			rootPath,
			requestPath: getPath(source, projectname)
		});
	}

	// 随机洗牌数组
	shuffleArray = (array) => {
		let currentIndex = array.length;
		let temporary;
		let toIndex;

		while (currentIndex) {
			toIndex = Math.floor(Math.random() * currentIndex--);
			temporary = array[currentIndex];
			array[currentIndex] = array[toIndex];
			array[toIndex] = temporary;
		}
		
		return array;
	}

	componentDidMount() {
		setTimeout(() => this.getModelsIndex(), 200)
	}

	getModelsIndex = () => {
		Loading.show();
		request(this.props.requestPath.modelsIndex).then(res => {
			Loading.hide();
			this.props.setStore({
				modelsIndex: this.shuffleArray(res)
			});
		}).catch(() => {
			Loading.hide();
		});
	}
	
	render() {
		return (
			<div id="app">
				<div><audio id="audioWarry" src="./assets/di.mp3"/></div>
				<Router history={history} onChange={this.handleRoute}>
					<Home path="/" />
					<Home path="/:source/:projectname" />
					<List path="/list" />
					<List path="/:source/:projectname/list" />
					<SView path="/view" />
					<SView path="/:source/:projectname/view" />
				</Router>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return state;
}


function mapDispatchToProps(dispatch){
	return bindActionCreators({ setStore: setRuntimeVariable }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
