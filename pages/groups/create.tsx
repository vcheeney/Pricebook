import React from 'react'
import AppLayout from 'components/layouts/AppLayout'
import GroupForm from 'components/GroupForm'
import { useRequireUser } from 'utils/user-context'
import { useCreateGroup } from 'utils/db-hooks'
import { Group } from 'core/group'
import { Per100g } from 'core/size'

export default function CreateGroup() {
  useRequireUser()

  const { mutateAsync } = useCreateGroup()

  const data: Partial<Group> = {
    name: '',
    defaultComparisonSize: Per100g,
    listingsThumbnail: [],
  }

  async function onFormSubmit(formData: Partial<Group>) {
    return mutateAsync(formData)
  }

  return (
    <AppLayout>
      <GroupForm initialValues={data} onFormSubmit={onFormSubmit} />
    </AppLayout>
  )
}
