import React from 'react'
import { useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import { Box, HStack, IconButton, Input, SimpleGrid } from '@chakra-ui/react'
import { SearchParams } from 'lib/db'

type Props = {
  searchParams: SearchParams
  setSearchParams: (params: SearchParams) => void
}

export default function ListingsSearch({
  searchParams,
  setSearchParams,
}: Props) {
  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => {
    setSearchParams({ ...searchParams, ...data, page: 0 })
  }

  return (
    <Box flexBasis="28rem" p={4} borderRadius="lg" bgColor="white" mb={4}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          handleSubmit(onSubmit)()
        }}
      >
        <HStack spacing={4}>
          <Input
            name="query"
            placeholder="Search"
            ref={register}
            focusBorderColor="green.500"
          />
          <IconButton
            aria-label="Search listings"
            colorScheme="green"
            type="submit"
            icon={<FaSearch />}
          />
        </HStack>
      </form>
    </Box>
  )
}
