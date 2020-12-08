import { Box, Button, Flex, Heading, IconButton, Link, Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { PostSection } from '../components/PostSnippet/PostSection'
import { UpdootSection } from '../components/PostSnippet/UpdootSection'
import { PostsQuery, usePostsQuery } from '../generated/graphql'

const Index = () => {

  const { data, loading, error, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 20,
      cursor: null as null | string
    },
    notifyOnNetworkStatusChange: true
  })

  if(error) {
    return <Text>{error.message}</Text>
  }

  if (!loading && !data) {
    return <div> oops! looks like query failed for some reason  </div>
  }

  return (
    <Layout>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8} mb={10}>
          {data!.posts.posts.map(p => !p ? null : (
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
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor: data.posts.posts[data.posts.posts.length -1].createdAt
                },
                // updateQuery: (
                //   previousValue, 
                //   {fetchMoreResult}
                // ): PostsQuery => {
                //   if (!fetchMoreResult) {
                //     return previousValue as PostsQuery
                //   }

                //   return {
                //     __typename: 'Query',
                //     posts: {
                //       __typename: 'PaginatedPosts',
                //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                //       posts: [
                //         ...(previousValue as PostsQuery).posts.posts,
                //         ...(fetchMoreResult as PostsQuery).posts.posts
                //       ]
                //     },

                //   }
                // }
              })
            }}
            isLoading={loading}
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

export default Index
