import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import { setRuntimeVariable } from '~/actions';
import classNames from 'classnames';
import Modal from '~/components/Modal';
import { slope, arrivedTime, ShowCountDown } from './helper';
import history from '~/core/history';
import '~/core/wheelzoom';
import s from './style.scss';


window.onresize = () => {
	window.location.reload();
};

let isMB = null;
if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
	//移动端
	isMB = true;
} else {
	isMB = false;
}

class View extends Component {

	// 减时间
	handleMinus = (e) => {
		e.preventDefault();
		this.props.setStore({
			time: this.props.time > 1 ? this.props.time - 1 : 1
		});
	}

	// 加时间
	handlePlus = (e) => {
		e.preventDefault();
		this.props.setStore({
			time: this.props.time < 60 ? this.props.time + 1 : 60
		});
	}

	closeError = () => {
		history.push('list');
	}

	// 显示时间设置
	showTimeModal = (e) => {
		e.preventDefault();
		this.setState({
			timeModal: true
		});
	}

	hideTimeModal = () => {
		const { time } = this.props;
		this.setState({
			timeModal: false
		});
		this.reSet(time);
		// 缓存时间数据到浏览器
		window.localStorage.setItem('time', time);
	}

	// 重制倒计时
	reSet = (sec) => {
		window.clearInterval(this.timer);
		const getTime = arrivedTime(sec);
		this.timer = window.setInterval(() => {
			this.setState({
				infomation: ShowCountDown(getTime),
				num: parseInt(ShowCountDown(getTime).replace(/\:/g, ''), 0)
			}, () => {
				if (this.state.num === 0) {
					this.handleNext();
				}
				if (this.state.num === 19) {
					const warn = document.getElementById('audioWarry');
					warn.play();
				}
			});
		}, 1000);
	}

	setData = () => {
		const { originData } = this.state;
		let showlist = [];
		if (originData.length <= 5) {
			showlist = originData;
		}
		else {
			showlist = [...originData.slice(originData.length - 2, originData.length),...originData.slice(0, 3)];
		}
		this.setState({
			showlist
		});
	}

	init = () => {
		const { time } = this.props;
		this.tranbox.style.left = `${this.startPos}px`;
		this.tranbox.setAttribute('data-index', 0);
		const { selected } = this.props;
		let originData = JSON.parse(JSON.stringify(selected));

		if (selected.length === 0) {
			history.push('./');
		}

		if (selected.length === 1) {
			originData = originData.concat(originData);
		}

		if (selected.length < 6) {
			originData = originData.concat(originData);
		}

		this.setState({
			originData
		}, this.setData);

		this.reSet(time);

		if (!isMB) {
			this.onKey();
		}
	}

	goHome = () => {
		history.push('/');
	}

	onAddEventListener = () => {
		this.tranbox.addEventListener('transitionend', this.handleTransformEnd);
	}

	onRemoveListener = () => {
		if (this.tranbox) {
			this.tranbox.removeEventListener('transitionend', this.handleTransformEnd);
		}
	}

	handleTransformEnd = () => {
		this.onRemoveListener();
		const { showlist, originData } = this.state;
		const currentInd = parseInt(this.tranbox.getAttribute('data-index'), 0);
		showlist[currentInd] && window._hmt && window._hmt.push(['_trackEvent', '详细', '展示', showlist[currentInd].imgUrl]);
		let newList = [];
		let index = null;
		if (this.direction === 'next') {
			index = (currentInd + 3) % originData.length;
			newList = [...showlist.slice(1, showlist.length), originData[index]];
		}
		if (this.direction === 'last') {
			const dataindex = currentInd - 3;
			if (dataindex < 0) {
				index = originData.length + dataindex;
			}
			else {
				index = dataindex;
			}
			newList = [originData[index], ...showlist.slice(0, showlist.length - 1)];
		}
		this.setState({
			showlist: newList
		}, () => {
			this.tranbox.style.transform = 'translateX(0px)';
			this.tranbox.style.transitionDuration = '0s';
			this.oprationDataIndex();
			this.reSet(this.props.time);
		});
	}

	oprationDataIndex = () => {
		const { originData } = this.state;
		const index = parseInt(this.tranbox.getAttribute('data-index'), 0);
		let opreatIndex = null;
		if (this.direction === 'next') {
			opreatIndex = index + 1;
			if (opreatIndex >= originData.length) {
				opreatIndex = 0;
			}
			this.tranbox.setAttribute('data-index', opreatIndex);
		}
		if (this.direction === 'last') {
			opreatIndex = index - 1;
			if (index <= 0) {
				opreatIndex = originData.length - 1 + index;
			}
			else {
				opreatIndex = index - 1;
			}
			this.tranbox.setAttribute('data-index', opreatIndex);
		}
	}

	handleLast = () => {
		this.onAddEventListener();
		this.direction = 'last';
		this.tranbox.style.transform = `translateX(${this.itemWidth}px)`;
		this.tranbox.style.transitionDuration = '500ms';
	}

	handleNext = () => {
		this.onAddEventListener();
		this.direction = 'next';
		this.tranbox.style.transform = `translateX(-${this.itemWidth}px)`;
		this.tranbox.style.transitionDuration = '500ms';
	}

	onTouchStart = (e) => {
		e.preventDefault();
		this.touchX = {
			start: null,
			end: null
		};
		this.touchY = {
			start: null,
			end: null
		};
		this.touchX.start = e.touches[0].screenX;
		this.touchY.start = e.touches[0].screenY;
	}

	onTouchMove = (e) => {
		this.touchX.end = e.touches[0].screenX;
		this.touchY.end = e.touches[0].screenY;
	}

	onTouchEnd = () => {
		const rate = slope(this.touchX.end - this.touchX.start, this.touchY.end - this.touchY.start, 30);

		if (rate !== -1) {
			return;
		}
		const { start, end } = this.touchX;
		if (start > end && start - end > 100) {
			this.handleNext();
		}
		if (start < end && end - start > 100) {
			this.handleLast();
		}
	}

	onError = (e) => {
		e.target.setAttribute('src', './assets/imgs/error.png');
		e.target.style.zIndex = 6;
		e.target.style.position = 'absolute';
	}

	goHome = () => history.push('/');

	onKey = () => window.document.onkeydown = (e) => {	//对整个页面文档监听
		const keyNum = window.event ? e.keyCode :e.which;		//获取被按下的键值
		if (keyNum === 39) {
			this.handleNext();
		}
		if (keyNum === 37) {
			this.handleLast();
		}
	};

	// 去列表页选择图片
	handleList = (e) => {
		e.preventDefault();
		history.push('list');
	}
    
	constructor(props) {
		super(props);
		this.state = {
			originData: [],
			showlist: [],
			infomation: null,
			num: null,
			timeModal: false
		};
		this.itemWidth = null;
		this.startPos = null;
		this.tranbox = null;
		this.direction = 'next';
		this.touchX = {
			start: null,
			end: null
		};
		this.touchY = {
			start: null,
			end: null
		};
		this.timer = null;
		this.timerout = null;
		this.loadTimer = null;
	}

	componentWillMount () {
		this.itemWidth = window.innerWidth;
		this.startPos = this.itemWidth * -2;
	}

	componentDidMount() {
		this.init();
		window.setTimeout(() => {
			window.wheelzoom(document.getElementsByClassName('zoom'));
		}, 1000);
	}

	componentWillUnmount() {
		window.clearInterval(this.timer);
	}

	render() {
		const {
			time,
			selected
		} = this.props;
		const { showlist, infomation, num } = this.state;
		if (num === 0) {
			window.clearInterval(this.timer);
		}
		const tranboxStyle = {
			width: showlist.length * this.itemWidth,
			// height: `${this.itemWidth}px`,
			'transition-duration': '100ms'
		};
		const itemBox = { width: `${this.itemWidth}px`, height: `100%` };
		return (
			<div className={s.root}>
				{isMB !== true && <div className={s.nav}>
					<i onClick={this.handleLast} className={`${s.navleft} flaticon-back-left-arrow-square-button-outline`} />
					<i onClick={this.handleNext} className={`${s.navright} flaticon-right-arrow-square-button-symbol`} />
				</div>}
				<div
					className={classNames(s.timer, num < 20 ? s.timerred : null)}
					onClick={this.showTimeModal}
				>
					<span className="flaticon-alarm-clock-symbol pdr-2" />{infomation}
				</div>
				<div className={s.slidebox}
					onTouchStart={this.onTouchStart}
					onTouchMove={this.onTouchMove}
					onTouchEnd={this.onTouchEnd}
				>
					<div ref={el => {this.tranbox = el;}} className={`${s.tranbox} clearfix`} style={tranboxStyle}>
						{
							showlist.map((item, index) => {
								const { imgUrl } = item;
								const W = parseInt(imgUrl.split('&')[1], 0);
								const H = parseInt(imgUrl.split('&')[2], 0);
								const WW = window.innerWidth;
								const WH = window.innerHeight;
								const ScaleW = W/H*WH;
								const ScaleH = H/W*WW;

								{/* window.clearTimeout(this.loadTimer);
								this.loadTimer = setTimeout(() => {
									const bigger = new Image();
									bigger.src = `./assets/models/${item.imgUrl}`;
									bigger.onload = () => {
										this.setState({
											bigLoaded: true
										});
									};
								}, 500); */}

								let Width;
								let Height;
								if (ScaleW >= WW) {
									Width = 'auto';
									Height = ScaleH;
								}

								if (ScaleH >= WH) {
									Width = ScaleW;
									Height = 'auto';
								}

								return (
									<div className={s.slideitem} data-index={index} style={itemBox}>
										{(index === 2 || index === 1 || index === 3) ?
											<div
												className={s.imgitembox}
												style={{
													width: Width,
													height: Height
												}}
											>
												<img className="zoom" src={`${this.props.requestPath.imageUrl}/${item.imgUrl}`} />
											</div> : null}
									</div>
								);
							})
						}
					</div>
				</div>
				<span
					className={s.index}
				>
					{`${this.tranbox && (
						(parseInt(this.tranbox.getAttribute('data-index'), 0) + 1)%selected.length === 0 ?
							selected.length :
							(parseInt(this.tranbox.getAttribute('data-index'), 0) + 1)%selected.length
					)}/${selected.length}`}
				</span>
				<div onClick={this.goHome} className={s.backhome}>
					<i className="flaticon-left-arrow-line-symbol" />
				</div>
				<div onClick={this.handleList} className={s.pic}>
					<i className="flaticon-four-rounded-squares-button" />
				</div>
				<Modal
					contentLabel="time"
					isOpen={this.state.timeModal}
					onRequestClose={this.hideTimeModal}
				>
					<h3 className="al-c font-bigger pdt2 pdb2">
						设置速写时间
					</h3>
					<div className={classNames(s.lh3, 'clearfix w9 center pdb3 formBox')}>
						<div className="fl w3 al-r">间隔时间：</div>
						<div className="w4-5 fl border">
							<div
								className="fl w3 al-c font-biggest"
								onClick={this.handleMinus}
							>
								<a href="">
									<i className="icon_minus" />
								</a>
							</div>
							<div className="fl w4">
								<input type="text" value={time} readOnly className="ww al-c" />
							</div>
							<div
								className="fl w3 al-c font-biggest"
								onClick={this.handlePlus}
							>
								<a href="">
									<i className="icon_plus" />
								</a>
							</div>
						</div>
						<div className="fl w2">
							&nbsp;&nbsp;分钟
						</div>
					</div>
					<div className="w9 center pdb1">
						<button className="btngreen font" onClick={this.hideTimeModal}>
							确&nbsp;&nbsp;认
						</button>
					</div>
				</Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(View);
