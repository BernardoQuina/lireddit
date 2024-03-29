import { Box } from '@chakra-ui/react'
import { type } from 'os'
import React from 'react'

export type WrapperVariant = 'small' | 'regular'

interface WrapperProps {
  variant?: WrapperVariant
}

export const Wrapper: React.FC<WrapperProps> = ({ children, variant='regular' }) => {
    return (
      <Box
        maxW={variant === 'regular' ? '1000px' : '400px'}
        w='100%'
        mt={8}
        mx='auto'
      >
        {children}
      </Box>
    )
}