import { Box, Button, Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useMeQuery, useLogoutMutation } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter()
  const [{fetching: logoutFetching}, logout] = useLogoutMutation()
  const [{data, fetching}] = useMeQuery({
    pause: isServer()
  })

  const logoutHandler = () => {
    logout()
    router.push('/login')
  }

  let body = null
  

  // data is loading
  if (fetching) {

    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link to='/register'>register</Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={logoutHandler}
          isLoading={logoutFetching}
          variant='link'>logout</Button>
      </Flex>
      
    )
  }

  return (
    <Flex p={4} bg='tan'>
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  )
}