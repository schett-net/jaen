export {Head} from 'gatsby-plugin-jaen'
export {PhotoProvider} from 'react-photo-view'
export {
  connectBlock,
  connectField,
  connectPage,
  connectPopup,
  connectTemplate,
  connectView
} from './connectors/index.js'
export {Editor} from './Editor.js'
export * from './fields/index.js'
export {usePageManager} from './internal/context/AdminPageManager/AdminPageManager.js'
export {useAuthentication} from './internal/context/AuthenticationContext.js'
export {usePageContext} from './internal/context/PageProvider.js'
export {PageManagerProvider} from './internal/context/PagesManagerContext.js'
export {useSectionBlockContext} from './internal/context/SectionBlockContext.js'
export {generatePageOriginPath} from './internal/helper/path.js'
export {useJaenPageTree} from './internal/hooks/site/useJaenPageTree.js'
export {useStatus} from './internal/hooks/useStatus.js'
export {useWidget} from './internal/hooks/useWidget.js'
export * as internal from './internal/index.js'
export {withJaenMock} from './internal/testing/withJaenMock.js'
export * from './search/index.js'
export {snekResourceId} from './snekResourceId.js'
export type {IJaenPage, PageProps, SiteMetadata} from './types.js'

export const getCookieConsentApi = () => {
  return window.CookieConsentApi
}