import type { RedshiftDataSource } from '@briefer/database'
import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Toggle from '../Toggle'
import FormError from './formError'
import { GATEWAY_IP } from '@/utils/info'
import Spin from '../Spin'
import { readFile } from '@/utils/file'
import FileUploadInput from './FileUploadInput'

export type RedshiftDataSourceInput = RedshiftDataSource & {
  password: string
  additionalInfo?: string
}

type RedshiftDataSourceFormValues = Omit<RedshiftDataSourceInput, ''> & {}

type RedshiftFormProps = {
  onSubmit: (values: RedshiftDataSourceInput) => Promise<void>
  redshiftDataSource?: RedshiftDataSource | null
  additionalContext?: string | null
  workspaceId: string
}

export default function RedshiftForm({
  redshiftDataSource,
  onSubmit,
  workspaceId,
  additionalContext,
}: RedshiftFormProps) {
  const isEditing = Boolean(redshiftDataSource)

  const { register, handleSubmit, formState, reset, control } =
    useForm<RedshiftDataSourceFormValues>({
      mode: 'onChange',
      defaultValues: { readOnly: true, notes: '' },
    })

  useEffect(() => {
    if (redshiftDataSource) {
      reset({
        ...redshiftDataSource,
        additionalInfo: additionalContext ?? undefined,
      })
    }
  }, [redshiftDataSource, reset, additionalContext])

  const onSubmitHandler = handleSubmit(async (data) => {
    onSubmit({
      ...data,
    })
  })

  return (
    <form className="px-4 sm:p-6 lg:p-12" onSubmit={onSubmitHandler} noValidate>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-8">
          <h2 className="text-lg font-semibold leading-7 text-gray-900">
            {redshiftDataSource ? 'Edit' : 'New'} Redshift data source
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            {redshiftDataSource ? 'Edit' : 'Add'} a Redshift database for
            Briefer to pull data from. Our fixed IP address is{' '}
            <code className="bg-gray-100 px-1 py-0.5 rounded-md text-red-500 text-xs">
              {GATEWAY_IP()}
            </code>
            .
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="col-span-5">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Display name
              </label>
              <div className="mt-2">
                <input
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'Display name is required.',
                    },
                  })}
                  type="text"
                  name="name"
                  placeholder="My Redshift database"
                  required
                  className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ceramic-200/70 sm:text-md sm:leading-6"
                />
                <FormError msg={formState.errors.name?.message} />
              </div>
            </div>
            <div className="col-span-1">
              <Toggle
                label="Read-only connection"
                control={control}
                {...register('readOnly')}
              />
            </div>

            <div className="col-span-5">
              <label
                htmlFor="host"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Host
              </label>
              <div className="mt-2">
                <input
                  {...register('host', {
                    required: { value: true, message: 'Host is required.' },
                  })}
                  type="text"
                  name="host"
                  placeholder="example.com"
                  required
                  className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ceramic-200/70 sm:text-md sm:leading-6"
                />
                <FormError msg={formState.errors.host?.message} />
              </div>
            </div>

            <div className="col-span-1">
              <label
                htmlFor="port"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Port
              </label>
              <div className="mt-2">
                <input
                  {...register('port', {
                    required: { value: true, message: 'Port is required.' },
                    validate: (v: any) => {
                      v = parseInt(v)
                      if (isNaN(v)) return 'Port must be a number.'
                      return true
                    },
                  })}
                  type="number"
                  name="port"
                  placeholder="5432"
                  required
                  className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ceramic-200/70 sm:text-md sm:leading-6"
                />
                <FormError msg={formState.errors.port?.message} />
              </div>
            </div>

            <div className="col-span-6">
              <label
                htmlFor="database"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Database name
              </label>
              <div className="mt-2">
                <input
                  {...register('database', {
                    required: {
                      value: true,
                      message: 'Database is required.',
                    },
                  })}
                  type="text"
                  name="database"
                  placeholder="db"
                  required
                  className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ceramic-200/70 sm:text-md sm:leading-6"
                />
                <FormError msg={formState.errors.database?.message} />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  {...register('username', {
                    required: {
                      value: true,
                      message: 'Username is required.',
                    },
                  })}
                  type="text"
                  name="username"
                  placeholder="postgres"
                  required
                  className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ceramic-200/70 sm:text-md sm:leading-6"
                />
                <FormError msg={formState.errors.username?.message} />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  {...register('password', {
                    required: {
                      value: !isEditing,
                      message: 'Password is required.',
                    },
                  })}
                  type="password"
                  name="password"
                  required={!isEditing}
                  className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ceramic-200/70 sm:text-md sm:leading-6"
                />
                {isEditing && !Boolean(formState.errors.password) && (
                  <span className="block text-sm text-gray-900 empty:before:content-['\200b'] pt-1 pb-1">
                    Leave empty to keep previous password
                  </span>
                )}
                <FormError msg={formState.errors.password?.message} />
              </div>
            </div>

            <div className="col-span-full pt-8">
              <label
                htmlFor="additionalInfo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                AI Additional Context{' '}
                <span className="pl-1 text-gray-500">(optional)</span>
              </label>
              <div className="mt-2">
                <textarea
                  {...register('additionalInfo')}
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={5}
                  placeholder="Enter additional context for the AI assistant (examples, descriptions, etc.)"
                  className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ceramic-200/70 sm:text-md sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-4">
        <Link
          href={`/workspaces/${workspaceId}/data-sources`}
          className="text-sm font-semibold leading-6 text-gray-600 border border-gray-400 px-6 py-1.5 rounded-sm shadow-sm hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="flex items-center justify-center gap-x-2 rounded-sm shadow-sm bg-primary-200 px-6 py-2.5 text-sm font-semibold hover:bg-primary-300 border-stone-950 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? (
            <>
              <Spin /> Validating
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </form>
  )
}
