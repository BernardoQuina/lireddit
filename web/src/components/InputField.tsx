import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react'
import { useField } from 'formik'
import React from 'react'
import { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  textarea?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {

  let InputOrTextarea = Input

  if(textarea) {
    InputOrTextarea = Textarea as any
  }

  const [field, {error}] = useField(props)
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      { error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}