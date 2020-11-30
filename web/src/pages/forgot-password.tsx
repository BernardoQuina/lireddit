import { Box, Button, Link } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import React, { useState } from 'react'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'
import login from './login'

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false)
  const [, forgotPassword] = useForgotPasswordMutation()

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={ async (values) => {
          await forgotPassword(values)
          setComplete(true)
        }}
      >
        {({ isSubmitting }) => complete ? (
          <Box style={{ color: 'limegreen' }}>
            if an account with that email exists, we sent you an email
          </Box>
        ) : (
          <Form>
            <Box mt={4}>
              <InputField
                name='email'
                placeholder='enter your email here'
                label='Email'
                type='email'
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
              Request Password Reset
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)