import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import { PostSnippetFragment, useVoteMutation } from '../../generated/graphql'

interface UpdootSectionProps {
  post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [vote] = useVoteMutation()

  return (
    <Flex direction='column' alignItems='center' justifyContent='center' mr={4}>
      <IconButton
        aria-label='upVote'
        colorScheme='teal'
        variant={post.voteStatus === 1 ? null as any : 'outline'}
        border='none'
        shadow='md'
        w={1}
        h={6}
        padding={0}
        icon={<ChevronUpIcon w={6} h={6} />}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return
          }
          await vote({ variables: { postId: post.id, value: 1 }})
        }}
      />
      
      <Text color='gray.600' mt={0} mb={0}>{post.points}</Text>

      <IconButton
        aria-label='downVote'
        colorScheme='teal'
        variant= {post.voteStatus === -1 ? null as any : 'outline'}
        border='none'
        shadow='md'
        w={1}
        h={6}
        padding={0}
        icon={<ChevronDownIcon w={6} h={6} />}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return
          }
          await vote({ variables: { postId: post.id, value: -1 } })
        }}
      />
    </Flex>
  )
}