import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Heading, IconButton, Link, Stack, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { PostSection } from '../components/PostSnippet/PostSection'
import { UpdootSection } from '../components/PostSnippet/UpdootSection'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 20, cursor: null as null | string
  })

  const [{ data, fetching }] = usePostsQuery({
    variables
  })

  if (!fetching && !data) {
    return <div> oops! looks like query failed for some reason  </div>
  }

  return (
    <Layout>
      <Flex>
        <NextLink href='/create-post'>
          <Link ml='auto'>
            <Button
              type='button'
              colorScheme='teal'
              shadow='md'
            >
              Post <AddIcon ml={2} v={3} h={3} />
            </Button>
          </Link>
        </NextLink>
      </Flex>
      
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8} mb={10}>
          {data!.posts.posts.map(p => (
            <Flex key={p.id} p={5} shadow='md' borderRadius='10px' >
              <UpdootSection post={p} />
              <PostSection post={p} />
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length -1].createdAt
            })}}
            isLoading={fetching}
            colorScheme='teal'
            shadow='md'
            m='auto'
            mb={8}
          >
            Load more
          </Button>
        </Flex>
      ) : (
        <Flex>
          <Button
            disabled
            colorScheme='gray'
            shadow='md'
            m='auto'
            mb={8}
          >
            No more posts
          </Button>
        </Flex>
      )}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
