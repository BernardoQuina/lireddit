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
          <Link color='white' fontWeight='bold' mr={4}>login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link color='white' fontWeight='bold' to='/register'>register</Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box color='white' fontWeight='bold' mr={2}>{data.me.username}</Box>
        <Button
          ml={2}
          onClick={logoutHandler}
          isLoading={logoutFetching}
          color='white'
          variant='link'>logout</Button>
      </Flex>
      
    )
  }

  return (
    <Flex zIndex={1} position='sticky' top={0} p={4} bg='teal.500'>
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  )
}