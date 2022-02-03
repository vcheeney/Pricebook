import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  Flex,
  CloseButton,
  DrawerBody,
  Text,
  useDisclosure,
  Box,
  FormLabel,
  Input,
  Stack,
  Image,
  DrawerFooter,
  Button,
  Square,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { Group } from 'core/group'
import { ListingThumbnail } from 'core/listing'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateGroup } from 'utils/db-hooks'

type Props = {
  isCreatingGroup: boolean
  setCreatingGroup: (val: boolean) => void
  listingsThumbnail: ListingThumbnail[]
}

export default function CreateGroupDrawer({
  isCreatingGroup,
  setCreatingGroup,
  listingsThumbnail,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutate } = useCreateGroup()

  const { register, handleSubmit } = useForm()

  function onSubmit(data) {
    const formData: Partial<Group> = {
      ...data,
      listingsThumbnail,
    }
    mutate(formData)
  }

  useEffect(() => {
    if (isCreatingGroup) onOpen()
  }, [isCreatingGroup])

  function close() {
    onClose()
    setTimeout(() => setCreatingGroup(false), 500)
  }

  return (
    <Drawer onClose={close} isOpen={isOpen} size="md">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>
            <Flex justify="space-between">
              <Text>Create a group</Text>
              <CloseButton onClick={close} />
            </Flex>
          </DrawerHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerBody flexGrow={1}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="name">Nom</FormLabel>
                  <Input ref={register} name="name" placeholder="Group Name" />
                </Box>
                <Box>
                  <FormLabel>Listings</FormLabel>
                  <Wrap spacing={4}>
                    {listingsThumbnail.map((l) => (
                      <WrapItem key={l._id}>
                        <Square size={16}>
                          <Image src={l.image} />
                        </Square>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={close} type="reset">
                Cancel
              </Button>
              <Button colorScheme="green" type="submit">
                Create
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}
