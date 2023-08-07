import {Flex, GlobalStyle, ThemeProvider} from '@chakra-ui/react'
import {
  JaenPage,
  PageConfig,
  PageProvider,
  useAuthenticationContext,
  withAuthentication
} from '@snek-at/jaen'
import {withRedux} from '@snek-at/jaen/src/redux'
import {GatsbyBrowser, navigate, PageProps, Slice} from 'gatsby'
import React, {useMemo} from 'react'

import userTheme from '../theme/theme'
import {DynamicPageRenderer} from './DynamicPageRenderer'
import {useJaenPagePaths} from './jaen-page-paths'
import Layout from './Layout'

// Import other necessary components here

interface PageContext {
  pageConfig?: PageConfig
  jaenPageId?: string
}

interface CustomPageElementProps {
  pageProps: PageProps<
    {
      jaenPage?: JaenPage
      allJaenPage?: {
        nodes: Array<JaenPage>
      }
    },
    PageContext
  >

  children: React.ReactNode
}

const CustomPageElement: React.FC<CustomPageElementProps> = ({
  children,
  pageProps
}) => {
  const AuthenticatedPage = useMemo(
    () =>
      withAuthentication<{
        children: React.ReactNode
      }>(
        ({children}) => {
          return <Layout pageProps={pageProps}>{children}</Layout>
        },
        pageProps.pageContext?.pageConfig,
        {
          onRedirectToLogin: () => {
            navigate('/login')
          }
        }
      ),
    [pageProps.pageContext?.pageConfig]
  )

  const withoutJaenFrame = pageProps.pageContext?.pageConfig?.withoutJaenFrame

  const AuthenticatedJaenFrame = useMemo(
    () =>
      withAuthentication(
        () => (
          <Slice
            alias="jaen-frame"
            jaenPageId={pageProps.pageContext?.jaenPageId}
            pageConfig={pageProps.pageContext?.pageConfig as any}
          />
        ),
        pageProps.pageContext?.pageConfig,
        {
          forceAuth: true,
          onRedirectToLogin: () => {
            navigate('/login')
          }
        }
      ),
    [pageProps.pageContext?.jaenPageId, pageProps.pageContext?.pageConfig]
  )

  const authentication = useAuthenticationContext()

  if (!withoutJaenFrame) {
    return (
      <Flex
        pos="relative"
        flexDirection="column"
        visibility={
          pageProps.pageContext?.pageConfig?.auth?.isRequired &&
          !authentication.isAuthenticated
            ? 'hidden'
            : 'visible'
        }>
        <AuthenticatedJaenFrame />

        <AuthenticatedPage>{children}</AuthenticatedPage>
      </Flex>
    )
  }

  return <AuthenticatedPage>{children}</AuthenticatedPage>
}

export interface WithJaenPageProviderProps {
  pageProps: PageProps<
    {
      jaenPage?: JaenPage
      allJaenPage?: {
        nodes: Array<JaenPage>
      }
    },
    PageContext
  >
}

const withJaenPageProvider = <P extends WithJaenPageProviderProps>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return props => {
    return <DynamicPageRenderer {...props} Component={Component} />
  }
}

const JaenPageElement = withJaenPageProvider(CustomPageElement)

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = (
  {element, props},
  plugins
) => {
  console.log('wrapPageElement', props, plugins)

  return <JaenPageElement pageProps={props}>{element}</JaenPageElement>
}

export interface UseTemplateReturn {}
