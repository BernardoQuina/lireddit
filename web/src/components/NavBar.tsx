import { AddIcon, ArrowBackIcon} from '@chakra-ui/icons'
import { Box, Button, Flex, Heading, Link, Text } from '@chakra-ui/react'
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

  const isInCreatePost = router.pathname === '/create-post'
  const isInLogin = router.pathname === '/login'
  const isInRegister = router.pathname === '/register'

  const logoutHandler = async () => {
    await logout()
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
          <Link color='white' fontWeight='bold' mr={4}>
            <Button
              hidden={isInLogin && true}
              type='button'
              colorScheme='teal'
              border='1px'
              borderRadius='5px'
              borderColor='gray.300'
              shadow='md'
            >
              <Text color='white'>Login </Text>
            </Button>
          </Link>
        </NextLink>
        <NextLink href='/register'>
          <Link color='white' fontWeight='bold' to='/register'>
            <Button
              hidden={isInRegister && true}
              type='button'
              colorScheme='teal'
              border='1px'
              borderRadius='5px'
              borderColor='gray.300'
              shadow='md'
            >
              <Text color='white'>Register</Text>
            </Button>
          </Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = (
      <Flex alignItems='center'>
        <Box color='white' fontWeight='bold' ml={2} mr={2}>{data.me.username}</Box>
        <Button
          ml={2}
          onClick={logoutHandler}
          isLoading={logoutFetching}
          colorScheme='teal'
          border='1px'
          borderRadius='5px'
          borderColor='gray.300'
          shadow='md'
          type='button'
          >
            <Text color='white'>Logout </Text>
            <ArrowBackIcon color='white' ml={1} v={4} h={4} />
          </Button>
      </Flex>
      
    )
  }

  return (
    <Flex shadow='xl' zIndex={1} position='sticky' top={0} p={4} bg='teal.500'>
      <Flex flex={1} m='auto' align='center' maxW={1000}>
        <NextLink href='/'>
          <Link style={{ textDecoration: 'none' }}>
            <Heading color='white' fontWeight='bold' mr={4}>LiReddit</Heading>
          </Link>
        </NextLink>
        <NextLink href='/create-post'>
            <Button
              style={{ textDecoration: 'none' }}
              as={Link}
              hidden={!data?.me || isInCreatePost ? true : undefined}
              type='button'
              colorScheme='teal'
              border='1px'
              borderRadius='5px'
              borderColor='gray.300'
              shadow='md'
            >
              <Text color='white'>Post </Text>
              <AddIcon color='white' ml={2} v={3} h={3} />
            </Button>
        </NextLink>
        <Box ml={'auto'}>
          {body}
        </Box>
      </Flex>
      
    </Flex>
  )
}