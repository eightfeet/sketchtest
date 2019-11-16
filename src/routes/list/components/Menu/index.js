import { h, Component } from "preact";
import classNames from "classnames";
import Modal from '~/components/Modal';
import s from "./../../style.scss";

class Menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showFilterModel: false
		};
	}

	hideMenu = () => {
		this.props.setStore({
			showMenu: false
		});
	}

	reSelect = () => {
		const operatinData = JSON.parse(JSON.stringify(this.props.currentList));

		operatinData.forEach((item) => {
			item.selected = false;
		});

		this.props.setStore({
			selected: [],
			currentList: operatinData
		});
		this.hideMenu();
	}

	selectAll = () => {
		const operatinData = JSON.parse(JSON.stringify(this.props.currentList));

		operatinData.forEach((item) => {
			item.selected = true;
		});

		this.props.setStore({
			selected: operatinData,
			currentList: operatinData
		});
		this.hideMenu();
	}

	handleModelMenu = () => {
		this.props.handleModelMenu();
		this.hideMenu();
	}

	handleShuffle = () => {
		this.props.handleShuffle();
		this.hideMenu();
	}

	closeFilterModel = () => {
		this.setState({
			showFilterModel: false
		});
	}

	showFilterModel = () => {
		this.setState({
			showFilterModel: true
		});
	}

	Filter = () => {
		this.showFilterModel();
		this.hideMenu();
	}

	filterToggle = (selected) => classNames({
		'fw-b': true,
		pdr1: true,
		'flaticon-checkmark-square-button-outline gray-lighter': !selected,
		gray: !selected,
		'flaticon-checkmark-square-button-outline fw-b': selected,
		greenspec: selected
	})

	// 筛选开关设置
	toggle = (element) => () => {
		const data = {};
		data[element] = !this.props[element];
		this.props.setStore(data);
		this.props.pageInit();
	}
	
	render() {
		const { shuffle, showMenu, isX, isY, isFemale, isMale } = this.props;
		return (
			<div>
				<div className={classNames(s.menu, 'shadow-bottom')} style={{display: showMenu ? 'block' : 'none'}}>
					<ul className="nls">
						<li className={`pdl1 ${s.bymodel}`} onClick={this.props.handleModelMenu}><i className="flaticon-user-outline-male-symbol-of-interface pdl1" />&nbsp;&nbsp;按模特选择</li>
						<li className="pdl1" onClick={this.Filter}><i className="flaticon-tag-outline pdl1" />&nbsp;&nbsp;筛选</li>
						<li className="pdl1" onClick={this.handleShuffle}><i className={shuffle ?  "flaticon-circular-arrow-counterclockwise-rotating-symbol pdl1" : "flaticon-shuffle pdl1"} />&nbsp;&nbsp;{shuffle ? '排序显示' : '随机显示'}</li>
						<li className="pdl1" onClick={this.selectAll}><i className="flaticon-checkmark-square-button-outline pdl1" />&nbsp;&nbsp;选择全部</li>
						<li className="pdl1" onClick={this.reSelect}><i className="flaticon-button-of-nine-outlined-circles pdl1" />&nbsp;&nbsp;重新选择</li>
					</ul>
					<div className={s.over} onClick={this.hideMenu}>
							&nbsp;
					</div>
				</div>
				<Modal
					contentLabel="time2"
					isOpen={this.state.showFilterModel}
					onRequestClose={this.closeFilterModel}
				>
					<h3 className="al-c font-bigger pdt2 pdb1">
						筛选
					</h3>
					<div className="pdl2 pdr2 nls al-c">
						<ul className={classNames(s.filter, 'clearfix', 'font')}>
							<li className="fl w4-5" onClick={this.toggle('isX')}>
								<i className={this.filterToggle(isX)} />横向
							</li>
							<li className="fl w1" />
							<li className="fl w4-5" onClick={this.toggle('isY')}>
								<i className={this.filterToggle(isY)} />纵向
							</li>
							<li className="fl w4-5" onClick={this.toggle('isMale')}>
								<i className={this.filterToggle(isMale)} />男性
							</li>
							<li className="fl w1" />
							<li className="fl w4-5" onClick={this.toggle('isFemale')}>
								<i className={this.filterToggle(isFemale)} />女性
							</li>
						</ul>
						&nbsp;
					</div>
					<div className="w9 center pdb1">
						<button className="btngreen font" onClick={this.closeFilterModel}>
							确&nbsp;&nbsp;认
						</button>
					</div>
				</Modal>
			</div>
		);
	}
}

export default Menu;
