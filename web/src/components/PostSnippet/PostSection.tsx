import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Text, Link, IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { PostSnippetFragment, useDeletePostMutation, useMeQuery } from '../../generated/graphql'
import { isServer } from '../../utils/isServer'

interface PostSectionProps {
  post: PostSnippetFragment
}

export const PostSection: React.FC<PostSectionProps> = ({ post }) => {

  const [{ data }] = useMeQuery({
    pause: isServer()
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
      
      <Flex ml='auto'>
        <IconButton
          hidden={data?.me?.id !== post.creator.id}
          icon={<DeleteIcon />}
          h={9}
          shadow='md'
          aria-label='Delete Post'
          colorScheme='red'
          variant='outline'
          opacity={0.8}
          onClick={() => deletePost({ id: post.id })}
        />
      </Flex>
      
    </Flex>
  )
}