import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button, Link } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import NextLink from 'next/link'

interface registerProps {}

const Login: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [{}, login] = useLoginMutation()

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={ async (values, { setErrors }) => {
          const response = await login(values)
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            // worked
            if (typeof router.query.next === 'string') {
              router.push(router.query.next)
            } else {
              router.push('/')
            }
            
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='usernameOrEmail'
              placeholder='username or email'
              label='Username or Email'
              style={{ borderColor: 'lightgrey' }}
            />
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
                style={{ borderColor: 'lightgrey' }}
              />
            </Box>
            
            <Button
              type='submit'
              isLoading={ isSubmitting }
              mt={2}
              colorScheme='teal'
              shadow='md'
            >
              Login
            </Button>
            <NextLink href='/forgot-password'>
              <Link float='right'>
                forgot password?
              </Link>
            </NextLink>
          </Form>
        )}
      </Formik>
    </Wrapper>
    
  )
}

export default withUrqlClient(createUrqlClient)(Login)