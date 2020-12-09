import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import { PostSnippetFragment, useVoteMutation, VoteMutation } from '../../generated/graphql'
import gql from 'graphql-tag'
import { ApolloCache } from '@apollo/client'

interface UpdootSectionProps {
  post: PostSnippetFragment
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: 'Post:' + postId,
    fragment: gql `
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `
  })

  if (data) {
    if (data.voteStatus === value) {
      return
    }
    const newPoints = (
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value
    )
    
    cache.writeFragment({
      id: 'Post:' + postId,
      fragment: gql`
        fragment _ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value }
    })
  }
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
          await vote({
            variables: { postId: post.id, value: 1 },
            update: (cache) => updateAfterVote(1, post.id, cache)
          })
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
          await vote({
            variables: { postId: post.id, value: -1 },
            update: (cache) => updateAfterVote(-1, post.id, cache) 
          })
        }}
      />
    </Flex>
  )
}