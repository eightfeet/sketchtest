import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import { setRuntimeVariable } from '~/actions';
// import Modal from '~/components/Modal';
import HeaderBar from '~/components/HeaderBar';
import request from '~/core/request';
import Loading from '~/components/Loading';
// import MotionPage from '~/components/MotionPage';
import FindByModel from './components/FindByModel';
import ModelList from './components/ModelList';
import Menu from './components/Menu';
import s from './style';

const isMB = !!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));

let sourcedata = [];

class List extends Component {
	constructor() {
		super();
		this.state = {
			shuffle: false,
			size: 5
		};
		this.selected = [];
		this.historySelected = [];
	}

	componentDidMount () {
		setTimeout(() => {
			this.getModels().then(() => {
				this.init();
			});
		}, 200)
	}

	getModels = () => {
		Loading.show();
		return request(this.props.requestPath.models).then(res => {
			Loading.hide();
			sourcedata = res;
		}).catch(() => {
			Loading.hide();
		});
	}

	// 随机洗牌数组
	shuffleArray = (array) => new Promise(resolve => {
		let currentIndex = array.length;
		let temporary;
		let toIndex;

		while (currentIndex) {
			toIndex = Math.floor(Math.random() * currentIndex--);
			temporary = array[currentIndex];
			array[currentIndex] = array[toIndex];
			array[toIndex] = temporary;
		}
		// 写入数据作为原
		this.props.setStore({
			sourceList: array
		});

		setTimeout(() => {
			resolve(array);
		}, 100);
	})

	init = () => {
		Loading.show();
		Promise.resolve()
			.then(() => this.props.setStore({currentList: [], page: 1}))
			.then(() => this.initBySelectedModels())
			.then(res => this.initBySelectedElement(res))
			.then(res => this.initByCondition(res))
			.then(res => {
				setTimeout(() => {
					document.getElementById('listboxid').style.height = '0px';
				}, 1000);
				if (this.state.shuffle) {
					this.shuffleArray(res);
				}
			})
			.then(() => this.setCurrentListByPage())
			.then(() => Loading.hide());
	}

	selectModels = () => {
		this.setState({
			showFilterByMd: true
		});
	}

	deeplyCopy = (data) => {
		return JSON.parse(JSON.stringify(data));
	}

	setCurrentListByPage = () => {
		const { page } = this.props;
		const operationData = this.deeplyCopy(this.props.sourceList);
		this.props.setStore({
			currentList: this.props.currentList.concat(operationData.slice((page-1) * this.state.size, page * this.state.size))
		});
	}

	onPullUp = () => {
		const { sourceList } = this.props;
		let totalpage = sourceList.length / this.state.size;
		totalpage = totalpage > window.parseInt(totalpage) ? window.parseInt(totalpage) + 1 : totalpage;
		if (isMB === false) {
			Loading.show();
		}
		return new Promise((res, rej) => {
			window.clearTimeout(this.time2);

			if (this.props.page < totalpage) {
				this.props.setStore({
					page: this.props.page + 1
				});
				setTimeout(() => {
					if (isMB === false) {
						Loading.hide();
					}
					this.setCurrentListByPage();
					res();
				}, 2000);
			}
			else {
				rej('没有了！');
				if (isMB === false) {
					Loading.hide();
				}
			}
			
		});
	}

	 
	/**
	 *
	 * @description 根据所选模特初始化源数据
	 */

	initBySelectedModels = () => new Promise((resolve) => {
		const { modelsIndex } = this.props;

		let result = [];
		// 1.按模特索引
		for (let indOpr = 0; indOpr < modelsIndex.length; indOpr++) {
			const elOpr = modelsIndex[indOpr];
			for (let index = 0; index < sourcedata.length; index++) {
				const elSource = sourcedata[index];
				if (elOpr.selected === true && elOpr.mdId === elSource.mdId) {
					result.push(elSource);
				}
			}
		}
		// 2.如果没有按模特过滤则使用原始数据
		result = result.length > 0 ? result : sourcedata;

		// 写入数据作为原
		this.props.setStore({
			sourceList: result
		});

		setTimeout(() => {
			resolve(result);
		}, 100);
	});

	initBySelectedElement = (data) => new Promise(resolve => {
		
		const { selected } = this.props;
		const optData = this.deeplyCopy(data);

		// 1.根据被选中情况（store 的 selected）来初始化数据的选择情况
		for (let index = 0; index < optData.length; index++) {
			const element = optData[index];
			for (let indexSelected = 0; indexSelected < selected.length; indexSelected++) {
				const elementSelected = selected[indexSelected];
				if (element.imgUrl === elementSelected.imgUrl) {
					element.selected = true;
				}
			}
		}

		// 写入数据作为原
		this.props.setStore({
			sourceList: optData
		});

		setTimeout(() => {
			resolve(optData);
		}, 100);

	})
	/**
	 *
	 *
	 * @description 根据过滤条件初始化数据源
	 */
	initByCondition = (data) => new Promise(resolve => {
		const {
			isX,
			isY,
			isMale,
			isFemale
		} = this.props;
		let Y = isY, X = isX, M = isMale, F = isFemale;
		if (isX === false && isY === false) {
			X = true; Y = true;
		}
		if (isMale === false && isFemale === false) {
			M = true; F = true;
		}

		const result = [];
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			if (
				((element.isX === X || element.isY === Y ) &&
				(element.isMale === M || element.isFemale === F)) ||
				(element.isHandsFeet === true) ||
				(element.isEyes) ||
				(element.isMouth) ||
				(element.isEar) ||
				(element.isNose) ||
				(element.isStill) ||
				(element.isGroup)
			) {
				// console.log('condition' );
				result.push(element);
			}
		}

		// 写入数据作为原
		this.props.setStore({
			sourceList: result
		});

		setTimeout(() => {
			resolve(result);
		}, 100);
	})

	handleModel = () => {
		this.initBySelectedModels();
		this.setState({
			showFilterByMd: false
		}, () => this.init());
		setTimeout(() => {
			document.getElementById('listboxid').style.height = '0px';
		}, 1000);
	}

	handleShuffle = () => {
		this.setState({
			shuffle: !this.state.shuffle
		}, () => this.init());
	}

	showMenu = () => {
		this.props.setStore({
			showMenu: true
		});
	}
    
	render() {
		const {
			selected,
			currentList,
			setStore,
			modelsIndex,
			isX,
			isY,
			isFemale,
			isMale
		} = this.props;
		const {
			showFilterByMd
		} = this.state;
		
		return (
			<div className={s.root}>
				<HeaderBar
					title={'选择图片'}
					selectimg={selected.length !== 0 ? selected.length : null}
					onClickLeft
					onClickRight={this.showMenu}
					rightIcon="flaticon-list"
					leftIcon="flaticon-left-arrow-line-symbol"
					leftIconClass={s.checked}
				/>
				<Menu
					setStore={setStore}
					handleModelMenu = {this.selectModels}
					shuffle = {this.state.shuffle}
					handleShuffle = {this.handleShuffle}
					currentList={currentList}
					showMenu={this.props.showMenu}
					isX={isX}
					isY={isY}
					isFemale={isFemale}
					isMale={isMale}
					pageInit={this.init}
				/>
				{showFilterByMd &&
				<FindByModel
					handleModel={this.handleModel}
					modelsIndex={modelsIndex}
					setStore={setStore}
					isBody={this.props.isBody}
					requestPath={this.props.requestPath}
				/>}
				{currentList.length > 0 && <ModelList
					selected={selected}
					currentList={currentList}
					setStore={setStore}
					onPullUp={this.onPullUp}
					requestPath={this.props.requestPath}
				/>}
				{isMB !== true && <div onClick={this.onPullUp} className={s.more}>更多</div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(List);
