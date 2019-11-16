import { h, Component } from 'preact';
import classNames from 'classnames';
import s from './../../style.scss';

class FindByModel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sellectAll: false,
			indexValue: null,
			isBody: this.props.isBody
		};
		this.showBody = false;
	}

	toggleSelectModels = (item, index) => () => {
		const operatinData = JSON.parse(JSON.stringify(this.props.modelsIndex));
		operatinData[index].selected = !operatinData[index].selected;
		this.props.setStore({
			modelsIndex: operatinData
		});
	}

	filterModel = (e) => {
		// this.state.sourcedataindex
		e.preventDefault();
		this.props.setStore({
			showMenu: false
		});
		this.props.handleModel();
		// sourceList
	}

	handleIndexAll = () => {
		const operatinData = JSON.parse(JSON.stringify(this.props.modelsIndex));
		if (this.state.sellectAll) {
			operatinData.forEach((item) => {
				if (!this.state.indexValue) {
					item.selected = true;
				}
				if (item.title.indexOf(this.state.indexValue) !== -1) {
					item.selected = true;
				}
			});
		} else {
			operatinData.forEach((item) => {
				if (!this.state.indexValue) {
					item.selected = false;
				}
				if (item.title.indexOf(this.state.indexValue) !== -1) {
					item.selected = false;
				}
			});
		}
		this.props.setStore({
			modelsIndex: operatinData
		});
	}

	toggleAllSelected = (e) => {
		e.preventDefault();
		this.setState({
			sellectAll: !this.state.sellectAll
		}, () => this.handleIndexAll());
	}

	changeIndex = (e) => {
		if (e.target.value.indexOf('人体动态') !== -1) {
			this.setState({
				isBody: true
			}, () => {
				this.showBody = true;
				window.clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.setState({
						isBody: false
					});
				}, 5000);
			});
		}
		this.setState({
			indexValue: e.target.value
		});
	}
		
	render(){
		return (<div>
			{
				<div className={s.findbymodelidbox}>
					<div className={s.findbymodelid}>
						<div className={s.fbmbox}>
							<ul className="nls">
								<li className={s.formbox}>
									<div className="w9-5 center">
										<input type="text" placeholder="输入查找" onInput={this.changeIndex} value={this.state.indexValue} />
									</div>
								</li>
								{this.state.isBody && <li className={s.warry}>人体艺术仅供艺用解剖学习！</li>}
								{
									this.props.modelsIndex.map((item, index) => {
										if (item.title.indexOf('人体') === -1 || this.showBody) {
											if (!this.state.indexValue) {
												return (<li
													className="al-l"
													onClick={this.toggleSelectModels(item, index)}
												>
													<img
														src={`${this.props.requestPath.imageUrl}/small/${item.imgUrl}`} alt=""
														style="max-width: 50%"
													/>
													<div className={s.modelstitle}>{item.title}</div>
													<div className={classNames(s.checkbox,  'flaticon-checkmark-square-button-outline', item.selected?s.select:null)} />
												</li>);
											}

											if (item.title.indexOf(this.state.indexValue) !== -1) {
												return (<li
													className="al-l"
													onClick={this.toggleSelectModels(item, index)}
												>
													<img
														src={`${this.props.requestPath.imageUrl}/small/${item.imgUrl}`} alt=""
													/>
													<div className={s.modelstitle}>{item.title}</div>
													<div className={classNames(s.checkbox,  'flaticon-checkmark-square-button-outline', item.selected?s.select:null)} />
												</li>);
											}
										}
										
										return null;
									})
								}
							</ul>
						</div>
					</div>
					<div className={classNames(s.dock, 'shadow-top')}>
						<div className="w8 fw-b center">
								按模特选择
						</div>
						<a
							onClick={this.filterModel}
							className={`flaticon-pin ${s.statusbutton}`}
							style={{left: 0}}
						/>
						<a
							onClick={this.toggleAllSelected}
							className={`flaticon-checkmark-square-button-outline ${s.statusbutton}`}
							style={{right: 0, fontSize: '1rem', color: this.state.sellectAll ? '#00b67b' : '#999'}}
						/>
					</div>
				</div>
			}
		</div>);
	}
}

export default FindByModel;