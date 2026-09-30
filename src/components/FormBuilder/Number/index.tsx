import type { TextField } from '@/types/content'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
export const Number: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  return (
    <Width width={width}>
      <input
        defaultValue={defaultValue}
        id={name}
        type="number"
        {...register(name, { required })}
        placeholder={label}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
