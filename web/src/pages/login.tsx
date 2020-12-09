import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button, Link } from '@chakra-ui/react'
import { InputField } from '../components/InputField'
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Layout } from '../components/Layout'
import { withApollo } from '../utils/withApollo'

interface registerProps {}

const Login: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [login] = useLoginMutation()

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={ async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, {data}) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.login.user
                }
              })
              cache.evict({fieldName: 'posts'})
            }
          })

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
    </Layout>
  )
}

export default withApollo({ ssr: false })(Login)