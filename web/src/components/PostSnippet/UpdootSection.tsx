import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, IconButton, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../../generated/graphql'

interface UpdootSectionProps {
  post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [upVariant, setUpVariant] = useState('outline') as any
  const [downVariant, setDownVariant] = useState('outline') as any
  const [, vote] = useVoteMutation()

  return (
    <Flex direction='column' alignItems='center' justifyContent='center' mr={4}>
      <IconButton
        aria-label='upVote'
        colorScheme='teal'
        variant={upVariant}
        shadow='md'
        w={1}
        h={6}
        padding={0}
        icon={<ChevronUpIcon w={6} h={6} />}
        onClick={() => {
          vote({ postId: post.id, value: 1 })
          setUpVariant(null)
          setDownVariant('outline')
        }}
      />
      
      <Text color='gray.600' mt={0} mb={0}>{post.points}</Text>

      <IconButton
        aria-label='downVote'
        colorScheme='teal'
        variant= {downVariant}
        shadow='md'
        w={1}
        h={6}
        padding={0}
        icon={<ChevronDownIcon w={6} h={6} />}
        onClick={async () => {
          await vote({ postId: post.id, value: -1 })
          setDownVariant(null)
          setUpVariant('outline')
        }}
      />
    </Flex>
  )
}