import { useWatch, type Control, type FieldValues } from 'react-hook-form';

export type WatchedValueProps = {
	control: Control<FieldValues>;
	name: string;
	defaultVal?: number;
	formTitle: string;
	description: string;
};

export default function WatchedValue({ control, name, defaultVal, formTitle, description }: WatchedValueProps) {
	const watchedVal = useWatch({
		control: control,
		name: name,
		defaultValue: defaultVal,
	});

	return (
		<div className={`${formTitle}-form__slider-heading`}>
			{description} {watchedVal}
		</div>
	);
}
