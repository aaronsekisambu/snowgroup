import type { TextField } from '@/types/content'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Text: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  return (
    <Width width={width}>
      <input defaultValue={defaultValue} id={name} type="text" {...register(name, { required })} placeholder={label} />
      {name.includes('name') && <i className="fal fa-user"></i>}
      {(name.includes('tel') || name.includes('phone')) && <i className="far fa-mobile"></i>}
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
