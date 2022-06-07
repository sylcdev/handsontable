const path = require('path');
const chalk = require('chalk');
const highlight = require('./highlight');
const snippets = require('./containers/snippets');
const examples = require('./containers/examples');
const sourceCodeLink = require('./containers/sourceCodeLink');
const conditionalBlock = require('./containers/conditionalBlock');
const nginxRedirectsPlugin = require('./plugins/generate-nginx-redirects');
const assetsVersioningPlugin = require('./plugins/assets-versioning');
const extendPageDataPlugin = require('./plugins/extend-page-data');
const {
  getDocsBaseUrl,
  getEnvDocsVersion,
  getEnvDocsFramework,
  TMP_DIR_FOR_WATCH,
  createSymlinks,
  isEnvDev,
  getDocsFrameworkedVersions,
  getLatestVersion,
  getIgnoredFilesPatterns,
  FRAMEWORK_SUFFIX,
} = require('./helpers');

const buildMode = process.env.BUILD_MODE;
let versionPartialPath = '';
let frameworkPartialPath = '';

const isLatest = getEnvDocsVersion() === getLatestVersion();
let base = '/docs/';

if (getEnvDocsVersion()) {
  versionPartialPath = `${getEnvDocsVersion()}/`;

  const isFrameworked = getDocsFrameworkedVersions(buildMode).includes(getEnvDocsVersion());

  if ((isFrameworked === false || getEnvDocsFramework()) && isLatest === false) {
    base += versionPartialPath;
  }

  if (getEnvDocsFramework()) {
    frameworkPartialPath = `${getEnvDocsFramework()}${FRAMEWORK_SUFFIX}/`;
    base += frameworkPartialPath;
  }

} else if (getEnvDocsFramework()) {
  versionPartialPath = '**/';
  frameworkPartialPath = `${getEnvDocsFramework()}${FRAMEWORK_SUFFIX}/`;

} else if (isEnvDev()) {
  // eslint-disable-next-line no-console
  console.error(
    `${chalk.red(`\
Stopping the ${chalk.italic('docs:start')} script execution. For performance reasons, the \
${chalk.italic('DOCS_VERSION')} and/or ${chalk.italic('DOCS_FRAMEWORK')} environment variables need to be defined. \
For example, try calling:
${chalk.italic.bold('DOCS_VERSION=next DOCS_FRAMEWORK=javascript npm run docs:start:no-cache')}.
`)}`);
  process.exit(1);
}

const redirectsPlugin = isLatest ?
  [nginxRedirectsPlugin, {
    outputFile: path.resolve(__dirname, '../docker/redirects-autogenerated.conf')
  }] : {};

const environmentHead = buildMode === 'production' ?
  [
    // Google Tag Manager, an extra element within the `ssr.html` file.
    ['script', {}, `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-55L5D3');
    `],
  ]
  : [];

// The `vuepress dev` command needs placing directories in proper place. It's done by creating temporaty directories
// which are watched by the script. It's done before a compilation is starting.
createSymlinks(buildMode);

module.exports = {
  define: {
    GA_ID: 'UA-33932793-7',
  },
  patterns: [
    `${isEnvDev() ? `${TMP_DIR_FOR_WATCH}/` : ''}${versionPartialPath}${isEnvDev() && getEnvDocsFramework() ?
      `${frameworkPartialPath}` : ''}**/*.md`,
    '!README.md', '!README-EDITING.md', '!README-DEPLOYMENT.md',
    ...getIgnoredFilesPatterns(buildMode),
  ],
  description: 'Handsontable',
  base,
  head: [
    ['link', { rel: 'icon', href: `${getDocsBaseUrl()}/static/images/template/ModCommon/favicon-32x32.png` }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    // Cookiebot - cookie consent popup
    ['script', {
      id: 'Cookiebot',
      src: 'https://consent.cookiebot.com/uc.js',
      'data-cbid': 'ef171f1d-a288-433f-b680-3cdbdebd5646'
    }],
    ...environmentHead
  ],
  markdown: {
    toc: {
      includeLevel: [2, 3],
      containerHeaderHtml: '<div class="toc-container-header">Table of contents</div>'
    },
    externalLinks: {
      target: '_blank',
      rel: 'nofollow noopener noreferrer'
    },
  },
  configureWebpack: {
    resolve: {
      symlinks: false,
    }
  },
  plugins: [
    extendPageDataPlugin,
    'tabs',
    ['sitemap', {
      hostname: getDocsBaseUrl(),
      exclude: ['/404.html']
    }],
    ['@vuepress/active-header-links', {
      sidebarLinkSelector: '.table-of-contents a',
      headerAnchorSelector: '.header-anchor'
    }],
    ['container', conditionalBlock],
    ['container', snippets],
    ['container', examples],
    ['container', sourceCodeLink],
    {
      extendMarkdown(md) {
        const render = function(tokens, options, env) {
          let i; let type;
          let result = '';
          const rules = this.rules;

          for (i = 0; i < tokens.length; i++) { // overwritten here
            type = tokens[i].type;

            if (type === 'inline') {
              result += this.renderInline(tokens[i].children, options, env);
            } else if (typeof rules[type] !== 'undefined') {
              result += rules[tokens[i].type](tokens, i, options, env, this);
            } else {
              result += this.renderToken(tokens, i, options, env);
            }
          }

          return result;
        };

        // overwrite markdown `render` function to allow extending tokens array (remove caching before loop).
        md.renderer.render = (tokens, options, env) => render.call(md.renderer, tokens, options, env);
      },
      chainMarkdown(config) {
        // inject custom markdown highlight with our snippet runner
        config
          .options
          .highlight(highlight)
          .end();
      },
      chainWebpack: (config) => {
        config.module
          .rule('md')
          .test(/\.md$/)
          .use(path.resolve(__dirname, 'docs-links'))
          .loader(path.resolve(__dirname, 'docs-links'))
          .end();
      },
    },
    assetsVersioningPlugin,
    redirectsPlugin
  ],
  themeConfig: {
    nextLinks: true,
    prevLinks: true,
    repo: 'handsontable/handsontable',
    docsRepo: 'handsontable/handsontable',
    docsDir: 'docs',
    docsBranch: 'develop',
    editLinks: true,
    editLinkText: 'Suggest edits',
    lastUpdated: true,
    smoothScroll: false,
    nav: [
      // Guide & API Reference has defined in: theme/components/NavLinks.vue
      { text: 'GitHub', link: 'https://github.com/handsontable/handsontable' },
      { text: 'Blog', link: 'https://handsontable.com/blog' },
      { text: 'Support',
        items: [
          { text: 'Contact support', link: 'https://handsontable.com/contact?category=technical_support' },
          { text: 'Report an issue', link: 'https://github.com/handsontable/handsontable/issues/new/choose' },
          { text: 'Forum', link: 'https://forum.handsontable.com' },
        ]
      },
    ],
    displayAllHeaders: true, // collapse other pages
    activeHeaderLinks: true,
    sidebarDepth: 0,
    search: true,
    searchOptions: {
      placeholder: 'Search...',
      guidesMaxSuggestions: 5,
      apiMaxSuggestions: 10,
      fuzzySearchDomains: ['Core', 'Hooks', 'Options'],
      // The list modifies the search results position. When the search phrase matches the pages
      // below, the search suggestions are placed before the rest results. The pages declared in
      // the array at the beginning have the highest display priority.
      apiSearchDomainPriorityList: ['Options'],
      guidesSearchDomainPriorityList: [],
    }
  }
};
