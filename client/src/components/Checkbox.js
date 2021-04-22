import {useState} from 'react';
function Checkbox (props) {
	// const { checkStatus,
	// const [checked, setChecked] = useState(true);
	const handleClick = () => {
	// 	// props.setCheckedStatus({
	// 	// 	...props.checkStatus,
	// 	// 	props.
	// 	// })
	// 	setChecked(checked => !checked);
	}
	return (
		<div>
			<input type="checkbox" checked={props.checkStatus} onChange={handleClick}/>{props.text}
		</div>
	)
};
export default Checkbox;
