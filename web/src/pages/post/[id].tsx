import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons'
import { Layout } from '../../components/Layout'
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl'


const Post = ({}) => {
  const router = useRouter()
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const {data, loading} = useGetPostFromUrl()

  if (loading) {
    return (
      <Layout>
        <div>
          loading...
        </div>
      </Layout>
    )
  }

  if(!data?.post) {
    return (
      <Layout>
        <Heading>Post not Found</Heading>
        <Text>The post you are trying to find does not exist.</Text>
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex>
        <Flex align='baseline'>
          <Heading mb={4}>{data.post.title}</Heading>
          <Text
            ml={3}
            fontSize='s'
            color='gray.500'
          >
            Posted by {data.post.creator.username}
          </Text>
        </Flex>
        
        <EditDeletePostButtons
          ml='auto'
          creatorId={data.post.creator.id}
          id={data.post.id}
        />
      </Flex>

      <Text>{data.post.text}</Text>
    </Layout>
  )
}

export default Post