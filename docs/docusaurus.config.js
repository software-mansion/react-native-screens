// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "React Native Screens",
  favicon: "img/favicon.png",

  url: "https://docs.swmansion.com",

  baseUrl: "/",

  organizationName: "software-mansion",
  projectName: "react-native-screens",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: false,
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsible: false,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/og-image.png",
      navbar: {
        hideOnScroll: true,
        logo: {
          alt: "React Native Screens logo",
          src: "img/logo.svg",
          srcDark:"img/logo-dark.svg"
        },
        items: [
          {
            to: "https://reactnavigation.org/docs/screen",
            activeBasePath: "docs",
            label: "Docs",
            position: "right",
          },
          {
            "href": "https://github.com/software-mansion/react-native-screens/",
            "position": "right",
            "className": "header-github",
            "aria-label": "GitHub repository",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
        ],
        copyright: "All trademarks and copyrights belong to their respective owners.",
      },
    }),
};

module.exports = config;
