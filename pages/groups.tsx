import { Box, Button, SimpleGrid, Image, Text, Stack } from '@chakra-ui/react'
import FullPageSpinner from 'components/FullPageSpinner'
import GroupCard from 'components/GroupCard'
import AppLayout from 'components/layouts/AppLayout'
import { Group } from 'core/group'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useUserGroups } from 'utils/db-hooks'
import { useRequireUser } from 'utils/user-context'

export default function groups() {
  const { user, loading } = useRequireUser()
  const { data, isLoading } = useUserGroups()
  const [selectedGroup, setSelectedGroup] = useState<Group>()
  const router = useRouter()

  if (isLoading) return <FullPageSpinner />

  return (
    <>
      <AppLayout>
        <Box>
          {data.length ? (
            <SimpleGrid gap={4} columns={[1, 1, 2, 2, 3]}>
              {data.map((group) => (
                <GroupCard
                  group={group}
                  key={group._id}
                  onClick={() => setSelectedGroup(group)}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Stack spacing="2">
              <Image src="images/empty.svg" maxW="300px" />
              <Text fontSize="xl">
                There are no groups. Create one by clicking the button bellow.
              </Text>
            </Stack>
          )}
          <Button
            size="lg"
            colorScheme="green"
            mt={8}
            onClick={() => {
              router.push('/groups/create')
            }}
          >
            Create a group
          </Button>
        </Box>
      </AppLayout>
      {}
    </>
  )
}
