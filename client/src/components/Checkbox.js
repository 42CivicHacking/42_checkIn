import '../styles/Checkbox.css';

function Checkbox (props) {
	const {name, text, checkStatus, setCheckStatus} = props;

	const handleChange = () => {
		const checked = checkStatus[name];
		setCheckStatus([
			...checkStatus.slice(0,name),
			!checked,
			...checkStatus.slice(name+1)
		])
	}
	return (
		<div>
		<label htmlFor={name} className="checkbox-text">
			<input id={name} className="checkbox" type="checkbox" checked={checkStatus[name]} onChange={handleChange} />
			{text}
		</label>
		</div>
	)
};
export default Checkbox;
