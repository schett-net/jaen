import {
  Box,
  CloseButton,
  Flex,
  SlideFade,
  Stack,
  useDisclosure
} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import * as React from 'react'
import {Outlet, Route, Routes, useNavigate} from 'react-router-dom'

import {isSSR} from '../../../../utils/isSSR.js'
import {useAuthentication} from '../../../context/AuthenticationContext.js'
import {SnekFinder} from '../../../context/SnekFinder/SnekFinder.js'
import {withRedux} from '../../../redux/index.js'
import {ThemeProvider} from '../../../styles/ChakraThemeProvider.js'
import {NavGroup, NavItem} from '../../molecules/index.js'
import {
  AdminSecondaryToolbar,
  ToolbarActionProvider
} from '../../organisms/index.js'
import {AdminShell} from '../AdminShell/AdminShell.js'
import {LoadingPage} from '../LoadingPage/LoadingPage.js'
import {BuiltViews} from './buildItemAndRoutesFromViews.js'
import {withAdminPageWrapper} from './withAdminPageWrapper.js'

export interface AdminPageProps {
  items: BuiltViews['items']
  activePath: string | null
  children: React.ReactNode
  onNavigate: (path: string) => void
}
const AdminPage: React.FC<AdminPageProps> = withRedux(
  ({items, activePath, children, onNavigate}) => {
    const leftRef = React.useRef<HTMLDivElement>(null)

    const navSliderDisclosure = useDisclosure()

    return (
      <AdminShell
        contentOffset="6.5rem"
        withoutAdminToolbarShadow
        beforeAdminShell={
          <AdminSecondaryToolbar
            isSidebarOpen={navSliderDisclosure.isOpen}
            onToggleSidebar={navSliderDisclosure.onToggle}
          />
        }>
        <ThemeProvider>
          <Flex
            flex="1"
            position="relative"
            onClick={e => {
              // check if the click was inside the leftRef or rightRef
              // if it was, don't close the slider

              if (
                leftRef.current?.contains(e.target as Node) &&
                navSliderDisclosure.isOpen
              ) {
                return
              }

              if (navSliderDisclosure.isOpen) {
                navSliderDisclosure.onClose()
              }
            }}>
            <SlideFade
              in={navSliderDisclosure.isOpen}
              offsetY="0"
              style={{
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 2,
                pointerEvents: navSliderDisclosure.isOpen ? 'all' : 'none'
              }}>
              <Box position="fixed" h="full" w="80">
                <Box
                  borderY="1px"
                  borderColor="gray.200"
                  h="full"
                  w="64"
                  p="8"
                  borderRightRadius="md"
                  shadow="md"
                  bg="white"
                  ref={leftRef}>
                  {/* <Lorem count={1} /> */}
                  <Stack spacing="8" flex="1">
                    <Stack spacing="4">
                      {items.ungrouped.map(item => (
                        <NavItem
                          active={item.path === activePath}
                          key={item.path}
                          Icon={item.Icon}
                          label={item.label}
                          onClick={() => {
                            onNavigate(item.path)
                            navSliderDisclosure.onClose()
                          }}
                        />
                      ))}
                    </Stack>

                    {Object.entries(items.grouped).map(([key, group]) => (
                      <NavGroup key={key} label={group.label}>
                        {group.items.map(item => (
                          <NavItem
                            active={item.path === activePath}
                            key={item.path}
                            Icon={item.Icon}
                            label={item.label}
                            onClick={() => {
                              onNavigate(item.path)
                              navSliderDisclosure.onClose()
                            }}
                          />
                        ))}
                      </NavGroup>
                    ))}
                  </Stack>
                </Box>
                <Box position="absolute" right="0" top="2">
                  <CloseButton
                    bg="blackAlpha.100"
                    onClick={navSliderDisclosure.onClose}
                  />
                </Box>
              </Box>
            </SlideFade>

            <Box boxSize="full" zIndex="1" bg="white">
              {children}
            </Box>
          </Flex>
        </ThemeProvider>
      </AdminShell>
    )
  }
)

export default withAdminPageWrapper(({routes, items}) => {
  const activePath = !isSSR() ? window.location.hash.replace('#', '') : null

  const routerNavigate = useNavigate()

  const onNavigate = React.useCallback((path: string) => {
    routerNavigate(path)

    window.scrollTo(0, 0)
  }, [])

  const {isLoading, isAuthenticated} = useAuthentication()

  const [isNavigating, setIsNavigating] = React.useState(false)

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const nav = async () => {
        setIsNavigating(true)
        await navigate('/admin/login')
        setIsNavigating(false)
      }

      void nav()
    }

    window.scrollTo(0, 0)
  }, [isLoading, isAuthenticated])

  const shouldRedirectToLogin = !isAuthenticated && !isLoading

  return (
    <ThemeProvider>
      <SnekFinder>
        <ToolbarActionProvider>
          <Routes>
            <Route
              element={
                isNavigating || shouldRedirectToLogin ? (
                  <LoadingPage />
                ) : (
                  <AdminPage
                    items={items}
                    activePath={activePath}
                    onNavigate={onNavigate}>
                    <Outlet />
                  </AdminPage>
                )
              }>
              {Object.entries(routes).map(([path, {Component, hasRoutes}]) => {
                if (hasRoutes) {
                  path = `${path}/*`
                }

                return <Route key={path} path={path} element={<Component />} />
              })}

              <Route
                key="404"
                path="*"
                element={<p>There&apos;s nothing here: 404!</p>}
              />
            </Route>
          </Routes>
        </ToolbarActionProvider>
      </SnekFinder>
    </ThemeProvider>
  )
})
