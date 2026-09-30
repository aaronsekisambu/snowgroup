import type { TextField } from '@/types/content'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Textarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({ name, defaultValue, errors, label, register, required, rows = 3, width }) => {
  return (
    <Width width={width}>
      <textarea
        defaultValue={defaultValue}
        id={name}
        rows={rows}
        {...register(name, { required: required })}
        placeholder={label}
      />
      {name.includes('message') && <i className="fal fa-envelope"></i>}
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
