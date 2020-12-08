import { useRouter } from 'next/router'
import { useSinglePostQuery } from '../generated/graphql'
import { useGetIntId } from './useGetIntId'

export const useGetPostFromUrl = () => {
  const router = useRouter()

  const intId = useGetIntId()

  return useSinglePostQuery({
    skip: intId === -1,
    variables: {
      id: intId
    }
  })
}