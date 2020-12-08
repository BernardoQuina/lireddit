import { Box, Flex, Heading, Text, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { PostSnippetFragment, useDeletePostMutation, useMeQuery } from '../../generated/graphql'
import { isServer } from '../../utils/isServer'
import { EditDeletePostButtons } from '../EditDeletePostButtons'

interface PostSectionProps {
  post: PostSnippetFragment
}

export const PostSection: React.FC<PostSectionProps> = ({ post }) => {

  const { data } = useMeQuery({
    skip: isServer()
  })

  const [, deletePost] = useDeletePostMutation()

  return (
    <Flex flex={1}>
      <Box>
        <Flex align='baseline'>
          <NextLink href='/post/[id]' as={`/post/${post.id}`}>
            <Link>
              <Heading fontSize='xl'>{post.title}</Heading>
            </Link>
          </NextLink>
          
          
          <Text
            ml={3}
            fontSize='s'
            color='gray.500'
          >
            Posted by {post.creator.username}
          </Text>
        </Flex>
        
        <Text mt={4}>
          {post.textSnippet.length === 100 ? (
            post.textSnippet + '...'
          ) : (
            post.textSnippet
          )}
        </Text>
      </Box>
      <EditDeletePostButtons
        ml='auto'
        creatorId={post.creator.id}
        id={post.id}
      />
    </Flex>
  )
}