import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/react'
import { InputField } from '../components/InputField'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { Layout } from '../components/Layout'
import { withApollo } from '../utils/withApollo'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [register] = useRegisterMutation()

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={ async (values, { setErrors }) => {
          const response = await register({ variables: { options: values } })
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors))
          } else if (response.data?.register.user) {
            // worked
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>

            <InputField
              name='username'
              placeholder='username'
              label='Username'
              style={{ borderColor: 'lightgrey' }}
            />
            <Box mt={4}>
              <InputField
                name='email'
                placeholder='email'
                label='Email'
                type='email'
                style={{ borderColor: 'lightgrey' }}
              />
            </Box>
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
              mt={4}
              colorScheme='teal'
              shadow='md'
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
    
  )
}

export default withApollo({ ssr: false })(Register)