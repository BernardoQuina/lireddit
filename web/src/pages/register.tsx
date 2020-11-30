import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [{}, register] = useRegisterMutation()

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={ async (values, { setErrors }) => {
          const response = await register({options: values})
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
    </Wrapper>
    
  )
}

export default withUrqlClient(createUrqlClient)(Register)