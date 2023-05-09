import {ChakraProvider} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import React from 'react'
import {PageProps} from '../types.js'
import {InjectPopups} from './components/atoms/InjectPopups.js'
import {LoadingPage} from './components/templates/LoadingPage/LoadingPage.js'
import {
  AuthenticationProvider,
  useAuthentication
} from './context/AuthenticationContext.js'
import {IncomingBuildChecker} from './context/IncomingBuildChecker/index.js'
import {ModalProvider} from './context/Modals/ModalContext.js'
import SiteProvider from './context/SiteContext.js'
import {useInterceptGatsbyNavigate} from './hooks/useInterceptGatsbyNavigate'
import {ThemeProvider} from './styles/ChakraThemeProvider.js'
import theme from './styles/theme.js'

export interface WrapperProps {
  children: React.ReactNode
  ssr?: boolean
}

export const GatsbyRootWrapper: React.FC<WrapperProps> = ({children}) => {
  useInterceptGatsbyNavigate()

  const MayeLazy: React.FC<{
    children: React.ReactNode
  }> = ({children}) => {
    const {isAuthenticated} = useAuthentication()

    if (!isAuthenticated) {
      return <>{children}</>
    }

    const LazyHighlightProvider = React.lazy(
      () => import('./context/HighlightContext.js')
    )

    return (
      <React.Suspense fallback={<LoadingPage />}>
        <LazyHighlightProvider>{children}</LazyHighlightProvider>
      </React.Suspense>
    )
  }

  return (
    <ChakraProvider cssVarsRoot="#coco" resetCSS theme={theme}>
      <SiteProvider>
        <ModalProvider>
          <IncomingBuildChecker />

          <AuthenticationProvider>
            <MayeLazy>{children}</MayeLazy>
          </AuthenticationProvider>
        </ModalProvider>
      </SiteProvider>
    </ChakraProvider>
  )
}

export interface PageWrapperProps extends WrapperProps {
  pageProps: PageProps
}

export const GatsbyPageWrapper: React.FC<PageWrapperProps> = ({
  children,
  pageProps
}) => {
  const handleActivationButtonClick = () => {
    void navigate('/admin')
  }

  const auth = useAuthentication()

  const Wrapper = () => {
    if (auth.isAuthenticated) {
      const AdminShell = React.lazy(
        () => import('./components/templates/AdminShell/AdminShell.js')
      )

      return (
        <React.Suspense fallback={<LoadingPage />}>
          <AdminShell>{children}</AdminShell>
        </React.Suspense>
      )
    } else {
      if (pageProps.path.includes('/admin')) {
        // For example if the user accesses /admin/login, the ActivationButton should not be rendered
        return <>{children}</>
      }

      const ActivationButton = React.lazy(
        () => import('./components/atoms/ActivationButton/ActivationButton.js')
      )

      return (
        <>
          <React.Suspense fallback={<></>}>
            <ThemeProvider>
              <ActivationButton onClick={handleActivationButtonClick} />
            </ThemeProvider>
          </React.Suspense>

          {children}
        </>
      )
    }
  }

  return (
    <>
      <InjectPopups pageProps={pageProps} />
      <Wrapper />
    </>
  )
}