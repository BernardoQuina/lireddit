import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import React from 'react'
import { InputField } from '../../../components/InputField'
import { Layout } from '../../../components/Layout'
import { useMeQuery, useUpdatePostMutation } from '../../../generated/graphql'
import { isServer } from '../../../utils/isServer'
import { useGetIntId } from '../../../utils/useGetIntId'
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl'

export const EditPost = ({}) => {
  const router = useRouter()

  const { data: meData } = useMeQuery({ skip: isServer() })

  const { data: postData, loading } = useGetPostFromUrl()
  const intId = useGetIntId()

  const [updatePost] = useUpdatePostMutation()

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    )
  }

  if (!postData?.post) {
    return (
      <Layout>
        <Heading fontWeight='bold'>Could not find post</Heading>
        <Text>The post you are trying to update does not exist</Text>
      </Layout>
    )
  }

  if(meData?.me?.id !== postData?.post?.creator.id) {
    router.push('/')
  }

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: postData.post.title, text: postData.post.text }}
        onSubmit={ async (values) => {
          await updatePost({ variables: { id: intId, ...values } })
          router.push(`/post/${intId}`)
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
              Update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default EditPost