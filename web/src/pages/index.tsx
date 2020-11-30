import { withUrqlClient } from 'next-urql'
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10
    }
  })

  if (!fetching && !data) {
    return <div> oops! looks like query failed for some reason  </div>
  }

  return (
    <Layout>
      <Flex>
        <Heading>LiReddit</Heading>
        <NextLink href='/create-post'>
          <Link ml='auto'>
            <Button
              type='button'
              colorScheme='teal'
              shadow='md'
            >
              Create post
            </Button>
          </Link>
        </NextLink>
      </Flex>
      
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8} mb={10}>
          {data!.posts.map(p => (
            <Box key={p.id} p={5} shadow='md' borderRadius='10px' >
              <Heading fontSize='xl'>{p.title}</Heading>
              <Text mt={4}>
                {p.text.length > 100 ? (
                  p.textSnippet + '...'
                ) : (
                  p.text
                )}
                </Text>
            </Box>
          ))}
        </Stack>
      )}
      {data ? (
        <Flex>
          <Button
            isLoading={fetching}
            colorScheme='teal'
            shadow='md'
            m='auto'
            mb={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
