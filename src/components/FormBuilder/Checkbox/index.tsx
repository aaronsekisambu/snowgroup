import type { CheckboxField } from '@/types/content'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name = '', defaultValue, errors, label, register, required, width }) => {
  const props = register(name, { required: Boolean(required) })

  return (
    <Width width={width ?? undefined}>
      <div>
        <input
          type="checkbox"
          defaultChecked={Boolean(defaultValue)}
          id={name}
          {...props}
        />
        <label htmlFor={name}>
          {required && (
            <span className="required">
              *{" "}<span className="sr-only">(required)</span>
            </span>
          )}
          {label}
        </label>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
