import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { signOut } from 'next-auth/client'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa'
import { useUser } from 'utils/user-context'

export default function Navbar({ hideSignIn = false }) {
  const { user } = useUser()
  const router = useRouter()

  return (
    <Flex py={2} justifyContent="space-between" alignItems="center" mb={4}>
      <Flex flex={1}>
        <NextLink href="/" passHref>
          <Link _hover={{ textDecor: 'none' }} _active={{ shadow: 'none' }}>
            <HStack color="green.500" spacing={4}>
              <FaShoppingCart size={24} />
              <Text fontWeight="bold" fontSize="2xl" color="gray.800">
                Pricebook
              </Text>
            </HStack>
          </Link>
        </NextLink>
      </Flex>
      {user ? (
        <HStack spacing={4}>
          <NavbarItem to="/listings">Listings</NavbarItem>
          <NavbarItem to="/groups">Groups</NavbarItem>
          <Box>
            <Menu
              placement="bottom-end"
              preventOverflow={true}
              offset={[5, 10]}
            >
              <MenuButton>
                <Avatar size="sm" boxShadow="xl" src={user.image} />
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<FaSignOutAlt size={16} />}
                  onClick={() => signOut()}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      ) : hideSignIn ? null : (
        <Button
          onClick={() => {
            router.push('/auth')
          }}
          bgColor="gray.200"
        >
          Sign In
        </Button>
      )}
    </Flex>
  )
}

function NavbarItem({ to, children }) {
  const { asPath } = useRouter()
  return (
    <NextLink href={to} passHref>
      <Link
        p={2}
        borderBottomColor={to === asPath ? 'green.500' : 'transparent'}
        borderBottomWidth={4}
        textDecor="none"
        _hover={{
          textDecor: 'none',
        }}
        fontWeight="bold"
      >
        {children}
      </Link>
    </NextLink>
  )
}
