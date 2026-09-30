import type { SelectField } from '@/types/content'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, options = [], required, width, defaultValue }) => {
  return (
    <Width width={width}>
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange: _onChange, value } }) => {
          const controlledValue = options.find((t) => t.value === value)

          return (
            <select defaultValue={controlledValue?.value} id={name}>
              <option disabled>{label}</option>
              {options.map(({ label, value }) => {
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              })}
            </select>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
