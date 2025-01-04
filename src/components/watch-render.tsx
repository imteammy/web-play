import React from 'react';
import { Control, DeepPartialSkipArrayKey, FieldPath, FieldPathValue, FieldPathValues, FieldValues, useWatch } from 'react-hook-form';


export function WatchRender<TFieldValues extends FieldValues = FieldValues>(props: {
    defaultValue?: DeepPartialSkipArrayKey<TFieldValues>;
    control?: Control<TFieldValues>;
    disabled?: boolean;
    exact?: boolean;
    name?: undefined
    render: (values: DeepPartialSkipArrayKey<TFieldValues>) => React.ReactNode
}): React.ReactNode;

export function WatchRender<TFieldValues extends FieldValues = FieldValues, TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: {
    name: TFieldName;
    defaultValue?: FieldPathValue<TFieldValues, TFieldName>;
    control?: Control<TFieldValues>;
    disabled?: boolean;
    exact?: boolean;
    render: (values: FieldPathValue<TFieldValues, TFieldName>) => React.ReactNode

}): React.ReactNode;

export function WatchRender<TFieldValues extends FieldValues = FieldValues, TFieldNames extends readonly FieldPath<TFieldValues>[] = readonly FieldPath<TFieldValues>[]>(props: {
    name: readonly [...TFieldNames];
    defaultValue?: DeepPartialSkipArrayKey<TFieldValues>;
    control?: Control<TFieldValues>;
    disabled?: boolean;
    exact?: boolean;
    render: (values: FieldPathValues<TFieldValues, TFieldNames>) => React.ReactNode

}): React.ReactNode;

export function WatchRender(props: any): React.ReactNode {

    const values = useWatch({
        control: props.control,
        name: props.name,
        defaultValue: props.defaultValue,
        disabled: props.disabled,
        exact: props.exact,
    });
    return props.render(values);
}

