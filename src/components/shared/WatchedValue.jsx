import { useWatch } from "react-hook-form";

export default function WatchedValue({ control,
    name,
    defaultVal,
    formTitle,
    description
}) {
    const watchedVal = useWatch({
        control: control,
        name: name,
        defaultValue: defaultVal
    });

    return <div className={`${formTitle}-form__slider-heading`}>
        {description} {watchedVal}
    </div>
}