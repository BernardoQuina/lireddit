import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { InputField } from '../../components/InputField'
import { Wrapper } from '../../components/Wrapper'
import { MeDocument, MeQuery, useChangePasswordMutation } from '../../generated/graphql'
import { toErrorMap } from '../../utils/toErrorMap'
import NextLink from 'next/link'
import { withApollo } from '../../utils/withApollo'

const ChangePassword: NextPage = () => {
  const router = useRouter()
  const [changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={ async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token: typeof router.query.token === 'string'
                ? router.query.token
                : ''
            },
            update: (cache, {data}) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.changePassword.user
                }
              })
              cache.evict({fieldName: 'posts'})
            }
          })
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)
            if ('token' in errorMap) {
              setTokenError(errorMap.token)
            }
            setErrors(errorMap)
          } else if (response.data?.changePassword.user) {
            // worked
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='newPassword'
              placeholder='new password'
              label='New Password'
              type='password'
              style={{ borderColor: 'lightgrey' }}
            />
            {tokenError ? (
              <Flex>
                <Box mr={4} style={{color: 'red'}}>
                  {tokenError}
                </Box>
                <NextLink href='/forgot-password'>
                  <Link ml='auto'>
                    <Button
                      size='sm'
                      type='button'
                      mt={2}
                      colorScheme='teal'
                      shadow='md'
                    >
                      click here to get new one
                    </Button>
                  </Link>
                </NextLink>
                
              </Flex>
              
            ) : (
              null
            )}
            <Button
              type='submit'
              isLoading={ isSubmitting }
              mt={4}
              colorScheme='teal'
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withApollo({ ssr: false })(ChangePassword)