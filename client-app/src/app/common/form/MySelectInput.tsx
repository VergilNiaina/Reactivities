import { useField } from "formik";
import { Label, Select } from "semantic-ui-react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";

interface Props{
    placeholder: string,
    name: string,
    label?: string,
    options : any
}
export default function MySelectInput(props :Props) {
  // helpers will help to manually set a value and touch status 
  const [field, meta, helpers] = useField(props.name);
  console.log()
  return (
    <Form.Field error={meta.touched && !!meta.error}>
        <label>{props.label}</label>
        <Select clearable
                options={props.options}
                value={field.value || null}
                onChange={(e, d)=>{
                  helpers.setValue(d.value)
                } }
                onBlur={()=> helpers.setTouched(true)}
                placeholder={props.placeholder}/>
        {/* if we don't have an error we juste pass null */}
        {meta.touched && meta.error ?(
            <Label basic color='red'>{meta.error}</Label>
        ) : null}
    </Form.Field>
  )
}
