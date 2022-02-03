import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  HStack,
} from '@chakra-ui/react'
import AppLayout from 'components/layouts/AppLayout'
import { Formik, Form, Field } from 'formik'
import { getSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import * as Yup from 'yup'

export default function Auth() {
  const [isSigningUp, setIsSigningUp] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/')
      }
    })
  }, [])

  const authSchema = Yup.object().shape({
    email: Yup.string()
      .email('The email must be a valid email')
      .required('The email is required'),
    password: Yup.string().required('The password is required'),
    ...(isSigningUp
      ? {
          confirmPassword: Yup.string()
            .required('Must confirm password')
            .oneOf([Yup.ref('password'), null], "Passwords don't match"),
        }
      : {}),
  })

  async function login(email: string, password: string) {
    const status = await signIn('credentials', {
      email: email,
      password: password,
    })
    if (!status.error) {
      router.replace('/')
    } else {
      alert(status.error)
    }
  }

  return (
    <AppLayout hideSignIn>
      <Flex align={'center'} justify={'center'} mt={20}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>
              {isSigningUp ? 'Sign Up' : 'Sign In'}
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            minW={'400px'}
            maxW="full"
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Formik
              initialValues={{
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={authSchema}
              onSubmit={async (values, helpers) => {
                helpers.setSubmitting(true)
                if (isSigningUp) {
                  const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                  })
                  if (res.ok) {
                    await login(values.email, values.password)
                  } else {
                    const data = await res.json()
                    alert(data.message)
                  }
                } else {
                  await login(values.email, values.password)
                }
              }}
            >
              {(formik) => {
                return (
                  <Form>
                    <Stack spacing={4}>
                      <Field name="email">
                        {({ field, form, meta }) => (
                          <FormControl
                            id="email"
                            isInvalid={meta.touched && meta.error}
                          >
                            <FormLabel>Email address</FormLabel>
                            <Input
                              {...field}
                              type="email"
                              focusBorderColor="green.500"
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="password">
                        {({ field, form, meta }) => (
                          <FormControl
                            id="password"
                            isInvalid={meta.touched && meta.error}
                          >
                            <FormLabel>Password</FormLabel>
                            <Input
                              {...field}
                              type="password"
                              focusBorderColor="green.500"
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      {isSigningUp ? (
                        <Field name="confirmPassword">
                          {({ field, form, meta }) => (
                            <FormControl
                              id="confirmPassword"
                              isInvalid={meta.touched && meta.error}
                            >
                              <FormLabel>Confirm Password</FormLabel>
                              <Input
                                {...field}
                                type="password"
                                focusBorderColor="green.500"
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      ) : null}
                      <Stack spacing={10}>
                        <Stack
                          direction={{ base: 'column', sm: 'row' }}
                          align={'start'}
                          justify={'space-between'}
                        ></Stack>
                        <Stack spacing="4">
                          <Button colorScheme="green" type="submit">
                            {isSigningUp ? 'Sign Up' : 'Sign In'}
                          </Button>
                          <HStack spacing={2} mx="auto">
                            <Text>Already a user?</Text>
                            <Button
                              size="sm"
                              onClick={() => setIsSigningUp((prev) => !prev)}
                            >
                              {isSigningUp ? 'Sign In' : 'Sign Up'}
                            </Button>
                          </HStack>
                        </Stack>
                        {process.env.ENABLE_GOOGLE_SIGN_IN === 'true' ? (
                          <Stack spacing={4}>
                            <Box>
                              <HStack spacing={2} mx="auto">
                                <Box w="full" bg="gray.300" h="1px" />
                                <Text color="gray.400">or</Text>
                                <Box w="full" bg="gray.300" h="1px" />
                              </HStack>
                            </Box>
                            <Button
                              leftIcon={<FaGoogle />}
                              colorScheme="gray"
                              variant="solid"
                              borderColor="gray.400"
                              borderWidth="1px"
                              onClick={() => {
                                signIn('google')
                              }}
                            >
                              Sign in with Google
                            </Button>
                          </Stack>
                        ) : null}
                      </Stack>
                    </Stack>
                  </Form>
                )
              }}
            </Formik>
          </Box>
        </Stack>
      </Flex>
    </AppLayout>
  )
}
