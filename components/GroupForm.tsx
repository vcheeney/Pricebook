import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Select,
  useDisclosure,
  Text,
  IconButton,
  Container,
  VStack,
  HStack,
  Flex,
} from '@chakra-ui/react'
import { Group } from 'core/group'
import { comparisonSizes, writeSize } from 'core/size'
import { Field, FieldArray, Form, Formik } from 'formik'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import ListingsDrawer from './drawers/ListingsDrawer'
import ListingListItem from './ListingListItem'
import PersoContainer from './layouts/Container'
import { useRouter } from 'next/router'
import * as Yup from 'yup'

type Props = {
  initialValues: Partial<Group>
  onFormSubmit: (data: Partial<Group>) => Promise<Group>
}

export default function GroupForm({ initialValues, onFormSubmit }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onFormSubmit(values).then((...args) => {
          router.replace('/groups')
        })
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .min(2, 'The name must be at least 2 characters')
          .max(50, 'The name must be at most 50 characters')
          .required('The name is required'),
        defaultComparisonSize: Yup.string().required(
          'The Default Comparison Unit is required'
        ),
        listingsThumbnail: Yup.array().min(
          2,
          'At least 2 listings must be selected'
        ),
      })}
      onReset={() => {
        router.replace('/groups')
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form>
          <Container maxW="xl">
            <VStack spacing={6} pb={24}>
              <Field name="name">
                {({ field, meta: { touched, error } }) => (
                  <FormControl id="name" isInvalid={error && touched}>
                    <FormLabel htmlFor="name">Group Name</FormLabel>
                    <Input
                      {...field}
                      placeholder="Group Name"
                      backgroundColor="white"
                      focusBorderColor="green.500"
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="defaultComparisonSize">
                {({ field, meta: { touched, error } }) => {
                  return (
                    <FormControl
                      id="defaultComparisonSize"
                      isInvalid={error && touched}
                    >
                      <FormLabel htmlFor="defaultComparisonSize">
                        Default Comparison Unit
                      </FormLabel>
                      <Select
                        {...field}
                        placeholder="Default Comparison Unit"
                        bgColor="white"
                        focusBorderColor="green.500"
                      >
                        {comparisonSizes.map((s) => (
                          <option key={writeSize(s)}>{writeSize(s)}</option>
                        ))}
                      </Select>
                      <FormErrorMessage>{error}</FormErrorMessage>
                    </FormControl>
                  )
                }}
              </Field>
              <FieldArray name="listingsThumbnail">
                {({ remove, push }) => {
                  return (
                    <FormControl
                      id="listingsThumbnail"
                      // isInvalid={
                      //   touched.listingsThumbnail && !!errors.listingsThumbnail
                      // }
                    >
                      <FormLabel htmlFor="listingsThumbnail">
                        Listings
                      </FormLabel>
                      <Box>
                        {values.listingsThumbnail.length > 0 ? (
                          values.listingsThumbnail.map((l, index) => (
                            <ListingListItem
                              key={l._id}
                              listing={l}
                              actions={[
                                <IconButton
                                  key="remove"
                                  variant="ghost"
                                  borderRadius="full"
                                  colorScheme="gray"
                                  color="gray.600"
                                  aria-label="Send email"
                                  icon={<FaTrash />}
                                  size="sm"
                                  onClick={() =>
                                    remove(
                                      values.listingsThumbnail.findIndex(
                                        (sl) => sl._id === l._id
                                      )
                                    )
                                  }
                                />,
                              ]}
                            />
                          ))
                        ) : (
                          <Text>No listings selected</Text>
                        )}
                        <Button onClick={() => onOpen()}>Add Listings</Button>
                        <ListingsDrawer
                          onClose={onClose}
                          isOpen={isOpen}
                          selectedListingsThumbnail={values.listingsThumbnail}
                          insert={push}
                          remove={remove}
                        />
                      </Box>
                      <FormErrorMessage>
                        {errors.listingsThumbnail}
                      </FormErrorMessage>
                    </FormControl>
                  )
                }}
              </FieldArray>
            </VStack>
          </Container>
          <Box
            bgColor="white"
            position="fixed"
            bottom={0}
            right={0}
            left={0}
            overflowY="scroll"
          >
            <PersoContainer>
              <Container maxW="xl">
                <Flex justify="space-between" alignItems="center">
                  <Text>It's a cool group! 😊</Text>
                  <HStack py={4}>
                    <Button colorScheme="gray" variant="ghost" type="reset">
                      Cancel
                    </Button>
                    <Button
                      colorScheme="green"
                      isLoading={isSubmitting}
                      type="submit"
                    >
                      Create
                    </Button>
                  </HStack>
                </Flex>
              </Container>
            </PersoContainer>
          </Box>
        </Form>
      )}
    </Formik>
  )
}
