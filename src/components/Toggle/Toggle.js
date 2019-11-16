import { h, Component } from 'preact';
import classNames from 'classnames';
import s from './Toggle.scss';

export default class Toggle extends Component {
	constructor(props) {
		const { checked, defaultChecked } = props;
		super(props);

		this.state = {
			toggle: checked !== undefined ? checked : defaultChecked
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.checked !== undefined
      && nextProps.checked !== this.state.toggle) {
			this.setState({
				toggle: nextProps.checked
			});
		}
	}

	onChange = () => {
		const { checked, disabled, readOnly, onChange } = this.props;
		const { toggle } = this.state;

		if (checked !== undefined) return;
		if (disabled === true) return;
		if (readOnly === true) return;

		this.setState({
			toggle: !toggle
		});

		if (typeof onChange === 'function') {
			onChange(!toggle);
		}
	}

	render() {
		const { disabled, innerRef, textOn, textOff, twoWays, style, className } = this.props;
		const { toggle } = this.state;

		const elementClass = classNames({
			[s.root]: true,
			[s.disabled]: disabled
		}, className);

		const toggleClass = classNames({
			[s.toggle]: true,
			[s.on]: toggle,
			[s.off]: !toggle,
			[s.twowaysoff]: twoWays
		});

		const textOnClass = classNames({
			[s.text]: true,
			[s.visiable]: toggle
		});

		const textOffClass = classNames({
			[s.text]: true,
			[s.visiable]: !toggle
		});

		return (
      <label className={elementClass} style={style}>
        <input
          ref={innerRef}
          type="checkbox"
          className={s.input}
          checked={toggle}
          onChange={this.onChange}
          value={toggle}
          readOnly
        />
        <div className={toggleClass}>
          <span className={textOnClass}>{textOn}</span>
          <span className={textOffClass}>{textOff}</span>
        </div>
      </label>
		);
	}
}
