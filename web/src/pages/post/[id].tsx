import { Box, Heading, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { Layout } from '../../components/Layout'
import { useSinglePostQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'


const Post = ({}) => {
  const router = useRouter()
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{data, fetching}] = useSinglePostQuery({
    pause: intId === -1,
    variables: {
      id: intId
    }
  })

  if (fetching) {
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
      <Heading mb={4}>{data.post.title}</Heading>
      <Text>{data.post.text}</Text>
      
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post)