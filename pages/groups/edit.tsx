import React from 'react'
import AppLayout from 'components/layouts/AppLayout'
import GroupForm from 'components/GroupForm'
import { useRequireUser } from 'utils/user-context'
import { useGroup, useUpdateGroup } from 'utils/db-hooks'
import { Group } from 'core/group'
import { useRouter } from 'next/router'

export default function EditGroup() {
  useRequireUser()
  const { query } = useRouter()
  const { id } = query

  const { mutateAsync } = useUpdateGroup()
  const { data, isLoading, isError, status } = useGroup(id?.toString())

  async function onFormSubmit(formData: Partial<Group>) {
    return mutateAsync(formData)
  }

  if (!data) return <h1>loading</h1>
  return (
    <AppLayout>
      <GroupForm initialValues={data} onFormSubmit={onFormSubmit} />
    </AppLayout>
  )
}
