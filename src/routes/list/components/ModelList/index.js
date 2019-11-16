import { h, Component } from "preact";
import classNames from "classnames";
import s from "./../../style.scss";
import PullToRefresh from 'rmc-pull-updown-to-refresh';

let shotline = null;
let listHeight = 0;

class ModelList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false
		};
		this.time2 = null;
		this.ref = null;
	}
	
	// 操作选择与取消选择图片
	handleSelect = (i) => (e) => {
		e.preventDefault();
		const { currentList, selected } = this.props;
		const operationData = JSON.parse(JSON.stringify(currentList));
		let operationHistory = JSON.parse(JSON.stringify(selected));

		// toggle 更新显示数据
		operationData[i].selected = !operationData[i].selected;
		this.props.setStore({
			currentList: operationData
		});

		// 选择的情况
		if (operationData[i].selected) {
			// 判断已选择列表是否保存这个数
			for (let index = 0; index < operationHistory.length; index += 1) {
				if (operationHistory[index].imgUrl === operationData[i].imgUrl) {
					// 有则不再操作
					return;
				}
			}
			// 无则推送一条进已选择的列表
			operationHistory.push(operationData[i]);
			this.props.setStore({
				selected: operationHistory
			});
		}

		// 取消选择的情况
		if (!operationData[i].selected) {
			// 移除已选择列表的当前项
			for (let index = 0; index < operationHistory.length; index += 1) {
				if (operationHistory[index].imgUrl === operationData[i].imgUrl) {
					const parta = operationHistory.slice(0, index);
					const partb = operationHistory.slice(index + 1, operationHistory.length);
					operationHistory = parta.concat(partb);
				}
			}
			// 更新已选择的列表
			this.props.setStore({
				selected: operationHistory
			});
		}
	}

	componentDidMount () {
		this.ref.style.height = '0px';
	}

	// 换一批模特
	render() {
		const { currentList } = this.props;
		let p1 = 0, p2 = 0, p3 = 0;
		return (
			<div className={s.list}>
				<PullToRefresh
					className={s.bg_orange}
					disablePullDown
					disablePullUp={false}
					pullUpText="加载更多"
					onPullUp={this.props.onPullUp}
					loadBackground="#fff"
					loadTextColor="#999"
				>
					
					<div className="clearfix" id="listboxid" ref={ref => {this.ref = ref; }} style={{height: listHeight}}>
						{
							// if(currentList) {
							currentList ? currentList.map((item, i) => {
								const img = window.document.createElement('img');
								img.src = `${this.props.requestPath.imageUrl}/small/${item.imgUrl}`;
								// img.src = '';
								const imginfo = item.imgUrl.split('&');
								const rate = parseInt(imginfo[1], 0) / (window.innerWidth/3);

								if (isNaN(rate)|| rate === 0) {
									return;
								}
								const width = window.innerWidth/3;
								const height = parseInt(imginfo[2], 0) / rate;
								const hp1 = p1, hp2 = p2, hp3 = p3;
								let left = 0, top = 0;

								const minHeight = Math.min(hp1, hp2, hp3);

								
								if (minHeight === hp1) {
									shotline = 1;
								}

								if (minHeight === hp2) {
									shotline = 2;
								}

								if (minHeight === hp3) {
									shotline = 3;
								}

								if (shotline === 1) {
									p1 = p1 + height;
									left = 0;
									top = hp1 + 3;
								}
								if (shotline === 2) {
									p2 = p2 + height;
									left = width;
									top = hp2 + 3;
								}
								if (shotline === 3) {
									p3 = p3 + height;
									left = width * 2;
									top = hp3 + 3;
								}

								listHeight = Math.max(p1, p2, p3);

								return (
									<div
										style={{
											width, height, left, top,
											boxSizing: 'border-box',
											border: '2px solid #fff'
										}}
										className={s.imgbox}
										onClick={this.handleSelect(i)}
									>
										<img
											src={img.src} alt=""
											className={s.loadingbg}
										/>
										{
											<div
												className={classNames(s.checkboxitem, item.selected ?s.selecteditem : null)}
											/>
										}
									</div>
								);
							}) : null
							//}
						}
					</div>
				</PullToRefresh>
			</div>
			
		);
	}
}

export default ModelList;
