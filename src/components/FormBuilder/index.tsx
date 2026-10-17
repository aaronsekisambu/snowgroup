'use client'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { fields } from './fields'
import type { Form as FormType, FormFieldBlock } from '@/types/content'
import AppData from '@/data/app.json'

export type FormBuilderProps = {
  form: FormType
  submitButtonAlign?: string
}

export const FormBuilder: React.FC<FormBuilderProps> = (props) => {
  const {
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    submitButtonAlign,
  } = props

  const formMethods = useForm()
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        // the site's own endpoint delivers to info@snowgroup.ltd; a Formspree address still works if one is set
        const endpoint =
          process.env.NEXT_PUBLIC_FORMSPREE_URL ||
          (AppData as { settings?: { formspreeURL?: string } }).settings?.formspreeURL ||
          '/api/contact'

        try {
          if (!endpoint) {
            throw new Error('Form endpoint is not configured')
          }

          const payload = dataToSend.reduce<Record<string, unknown>>((acc, item) => {
            acc[item.field] = item.value
            return acc
          }, {})

          const req = await fetch(endpoint, {
            body: JSON.stringify(payload),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            const reply = (await req.json().catch(() => ({}))) as { error?: string }
            setIsLoading(false)
            setError({
              message: reply.error || 'We could not send your message. Please try again, or email info@snowgroup.ltd.',
              status: String(req.status),
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect?.url) {
            router.push(redirect.url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'We could not reach the server. Check your connection and try again, or email info@snowgroup.ltd.',
          })
        }
      }

      void submitForm()
    },
    [router, redirect, confirmationType],
  )

  return (
    <FormProvider {...formMethods}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText data={confirmationMessage} className={'form-message'} />
      )}
      {isLoading && !hasSubmitted && <p className="form-loading">Sending…</p>}
      {error && (
        <p className="form-error" role="alert">
          {error.message}
        </p>
      )}
      {!hasSubmitted && (
        <form id={formID} onSubmit={handleSubmit(onSubmit)}>
          {/* left empty by people; bots fill it in */}
          <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="form-honey" {...register('_honey')} />
          <div className="row mil-aic">
            {formFromProps &&
              formFromProps.fields &&
              formFromProps.fields?.map((field: FormFieldBlock, index: number) => {
                const Field = fields?.[field.blockType as keyof typeof fields] as React.ComponentType<
                  FormFieldBlock & {
                    form: FormType
                    control: typeof control
                    errors: typeof errors
                    register: typeof register
                  }
                > | undefined
                if (Field) {
                  return (
                    <Field
                      form={formFromProps}
                      {...field}
                      {...formMethods}
                      control={control}
                      errors={errors}
                      register={register}
                      key={index}
                    />
                  )
                }
                return null
              })}
          </div>
          <div className={`mil-flex-row ${submitButtonAlign !== 'left' ? ' mil-jce' : ''}`}>
            <button form={formID} type="submit" className="mil-btn mil-accent">
              <span>{submitButtonLabel}</span>
              <i className="far fa-arrow-right"></i>
            </button>
          </div>
        </form>
      )}
    </FormProvider>
  )
}
