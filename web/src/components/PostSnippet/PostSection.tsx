import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { PostSnippetFragment } from '../../generated/graphql'

interface PostSectionProps {
  post: PostSnippetFragment
}

export const PostSection: React.FC<PostSectionProps> = ({ post }) => {
  return (
    <Box>
      <Flex align='baseline'>
        <Heading fontSize='xl'>{post.title}</Heading>
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
  )
}