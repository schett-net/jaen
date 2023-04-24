import {GatsbyConfig as GatsbyConfigType} from 'gatsby'

import {JaenSource} from 'jaen-utils'

const GatsbyConfig: GatsbyConfigType = {
  jsxRuntime: 'automatic',
  jsxImportSource: '@emotion/react',
  siteMetadata: JaenSource.jaenData.internal?.site.siteMetadata
}

GatsbyConfig.plugins = [
  `@chakra-ui/gatsby-plugin`,
  `gatsby-plugin-emotion`,
  {
    resolve: `gatsby-plugin-sharp`,
    options: {
      defaults: {
        formats: [`auto`, `webp`],
        placeholder: `dominantColor`,
        quality: 50,
        breakpoints: [750, 1080, 1366, 1920],
        backgroundColor: `transparent`,
        tracedSVGOptions: {},
        blurredOptions: {},
        jpgOptions: {},
        pngOptions: {},
        webpOptions: {},
        avifOptions: {}
      }
    }
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-image`,
  {
    resolve: `gatsby-plugin-nprogress`,
    options: {
      // Setting a color is optional.
      // color: `tomato`,
      // Disable the loading spinner.
      showSpinner: false,
      trickle: false,
      minimum: 0.4
    }
  }
]

const addSourcePluginIfPathExists = (
  plugins: GatsbyConfigType['plugins'] = [],
  options: {
    name: string
    path: string | null
  }
) => {
  if (options.path) {
    plugins.push({
      resolve: 'gatsby-source-filesystem',
      options: {
        name: options.name,
        path: options.path,
        ignore: [`**/.gitkeep`]
      }
    })
  }
}

addSourcePluginIfPathExists(GatsbyConfig.plugins, {
  name: 'jaen-pages',
  path: JaenSource.sourcePagesPath
})

addSourcePluginIfPathExists(GatsbyConfig.plugins, {
  name: 'jaen-templates',
  path: JaenSource.sourceTemplatesPath
})

addSourcePluginIfPathExists(GatsbyConfig.plugins, {
  name: 'jaen-views',
  path: JaenSource.sourceViewsPath
})

addSourcePluginIfPathExists(GatsbyConfig.plugins, {
  name: 'jaen-popups',
  path: JaenSource.sourcePopupsPath
})

export default GatsbyConfig
