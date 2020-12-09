import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import React from 'react'
import { InputField } from '../components/InputField'
import { Layout } from '../components/Layout'
import { useCreatePostMutation } from '../generated/graphql'
import { useIsAuth } from '../utils/useIsAuth'
import { withApollo } from '../utils/withApollo'


const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter()
  useIsAuth()
  const [createPost] = useCreatePostMutation()

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={ async (values) => {
          const { errors } = await createPost({
            variables:{ input: values },
            update: (cache) => {
              cache.evict({ fieldName: 'posts' })
            }
          })
          if(!errors) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='title'
              placeholder='title'
              label='Title'
              style={{ borderColor: 'lightgrey' }}
            />
            <Box mt={4}>
              <InputField
                textarea
                name='text'
                placeholder='text...'
                label='Body'
                type='text'
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
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withApollo({ ssr: false })(CreatePost)