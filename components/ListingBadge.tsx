import { Tooltip } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons/lib'

type Props = {
  label: string
  Icon: IconType
}

export default function ListingBadge({ label, Icon }: Props) {
  return (
    <Tooltip label={label} fontSize="md">
      <span>
        <Icon size={26} color="red" />
      </span>
    </Tooltip>
  )
}
