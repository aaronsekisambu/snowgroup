import type { StateField } from '@/types/content'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'
import { stateOptions } from './options'

export const State: React.FC<
  StateField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, required, width }) => {
  return (
    <Width width={width}>
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange: _onChange, value } }) => {
          const controlledValue = stateOptions.find((t) => t.value === value)

          return (
            <select defaultValue={controlledValue?.value} id={name}>
              <option disabled>{label}</option>
              {stateOptions.map(({ label, value }) => {
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
