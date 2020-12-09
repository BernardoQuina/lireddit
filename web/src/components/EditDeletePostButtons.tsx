import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { Flex, IconButton, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'
import { useRouter } from 'next/router'

interface EditDeletePostButtonsProps {
  id: number,
  creatorId: number,
  ml?: any
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
  ml
}) => {
  const router = useRouter()

  const { data } = useMeQuery({ skip: isServer() })

  const [deletePost] = useDeletePostMutation()

  if(data?.me?.id !== creatorId) {
    return null
  }

  return (
    <Flex ml={ml}>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
        <IconButton
          icon={<EditIcon boxSize='0.8em' />}
          as={Link}
          h={6}
          shadow='md'
          aria-label='Edit Post'
          border='none'
          colorScheme='teal'
          variant='outline'
          opacity={0.8}
        />
      </NextLink>
      
      <IconButton
        icon={<DeleteIcon boxSize='0.8em' />}
        h={6}
        ml='0.8em'
        shadow='md'
        aria-label='Delete Post'
        border='none'
        colorScheme='red'
        variant='outline'
        opacity={0.8}
        onClick={() => {
          deletePost({ variables: { id }, update: (cache) => {
            cache.evict({id: 'Post:' + id})
          } })
          if(router.pathname !== '/') {
            router.back()
          }
        }}
      />
    </Flex>
  )
}