import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { DateTimePicker } from 'react-widgets';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<any, HTMLElement>, FormFieldProps {}

const DateInput: React.FC<IProps> = ({
    input, width, placeholder, date= false, time = false, id=null, meta: { touched, error },
    ...rest
}) => {
    return (
        <Form.Field width={width} error={touched && !!error}>
            <DateTimePicker
                date={ date }
                time={ time }
                placeholder={placeholder}
                value={input.value || null}
                onChange={input.onChange}
                {...rest}
            />
            { touched && error && (
                <Label basic color="red">{error}</Label>
            )}
        </Form.Field>
    )
}

export default DateInput;
