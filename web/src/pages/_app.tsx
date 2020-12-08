import { ThemeProvider, CSSReset } from '@chakra-ui/react'
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client'
import theme from '../theme'
import { PaginatedPosts } from '../generated/graphql'

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              console.log('existing: ', existing, 'incoming: ', incoming)
              return {
                ...incoming,
                posts: [...existing?.posts || [], ...incoming.posts]
              }
            }
          }
        }
      }
    }
  }),
  credentials: 'include'
})


function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
    
  )
}

export default MyApp
