import React from 'react'
import { Store } from 'core/listing'
import { Image, Link, Square } from '@chakra-ui/react'

type Props = {
  store: Store
  width?: number
  link?: string
}

export default function StoreImage({ store, width, link }: Props) {
  return (
    <Link
      _hover={{ textDecor: 'none' }}
      _active={{ shadow: 'none' }}
      href={link}
      target="_blank"
    >
      <Square width={width} cursor={link ? 'pointer' : 'auto'}>
        <Image src={`/logos/${store}.png`} />
      </Square>
    </Link>
  )
}
