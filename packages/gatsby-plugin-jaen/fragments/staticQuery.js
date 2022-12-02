import {graphql, useStaticQuery} from 'gatsby'

export const useAdminStaticQuery = () => {
  let staticData

  try {
    staticData = useStaticQuery(graphql`
      query StaticQuery {
        jaenInternal {
          finderUrl
        }
        allJaenPage {
          nodes {
            ...JaenPageData
            parent {
              id
            }
            children {
              id
            }
            template
            componentName
          }
        }
        jaenTemplate: allFile(
          filter: {sourceInstanceName: {eq: "jaen-templates"}}
        ) {
          nodes {
            name
            relativePath
          }
        }
      }
    `)
  } catch (e) {
    console.error('useStaticJaenPages', e)
    staticData = {
      jaenInternal: {
        finderUrl: null
      },
      allJaenPage: {
        nodes: []
      },
      jaenTemplate: {
        nodes: []
      }
    }
  }

  return staticData
}