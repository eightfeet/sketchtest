import { h, Component, PropTypes } from 'preact';
import { Link } from 'preact-router';
import history from '~/core/history';
import s from './HeaderBar.scss';

class HeaderBar extends Component {
	constructor() {
		super();
		this.state = {
			isSearch: false,
			isSubMenu: false
		};
	}

	handleLeftIcon = (e) => {
		const { onClickLeft } = this.props;
		if (onClickLeft && typeof onClickLeft === 'function') {
			onClickLeft(e);
		}
		else {
			history.goBack();
		}
	}

	handleRightIcon = (e) => {
		const { onClickRight } = this.props;
		if (onClickRight && typeof onClickRight === 'function') {
			onClickRight(e);
		}
		else {
			history.goBack();
		}
	}

	render() {
		const { title, leftIcon, onClickLeft, onClickRight, rightIcon, selectimg } = this.props;
		return (
			<header>
				<div className={`${s.heardbar} clearfix`}>
					<h3 className="center al-c w3 pr txt_cut">
						{title}
						{selectimg ? <span style={{
							background: '#00b67b',
							borderRadius: '3rem',
							padding: '0.1rem 0.5rem',
							marginLeft: '0.2rem',
							fontSize: '1rem',
							fontWeight: 'normal',
							color: '#fff'
						}}
						             >{selectimg}</span> : null}
					</h3>
					{onClickLeft ? (<div className={`${s.fixleft} ${s.headerbarIcon}`} onClick={this.handleLeftIcon}>
						<a href="" onClick={e => {e.preventDefault();}} className={this.props.leftIconClass}>
							<span className={`${leftIcon ? leftIcon : 'icon_chevron_left'} ${s.bannerico}`} />
						</a>
					</div>) : null}
					{
						onClickRight && typeof onClickRight === 'function' ?
							(<div className={`${s.fixright} ${s.headerbarIcon}`} onClick={onClickRight}>
								<a href="" onClick={e => {e.preventDefault();}} className={this.props.rightIconClass}>
									<span className={`${rightIcon ? rightIcon : 'icon_circle'} ${s.bannerico}`} />
								</a>
							</div>) : null
					}
				</div>
			</header>
		);
	}
}

export default HeaderBar;
