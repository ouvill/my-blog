/**
 * Legacy redirect rules migrated from `public/_redirects`.
 *
 * Cloudflare Pages used to process `_redirects` automatically, but Workers
 * Static Assets does not. This module exports the same rules as a typed,
 * readonly data structure so the Worker entry can apply them at the edge.
 *
 * All current rules are 301 (permanent) redirects.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** HTTP status codes used by redirect rules. */
type RedirectStatus = 301 | 302 | 307 | 308

/** A single redirect rule: exact source path → target path + status. */
export interface RedirectRule {
  readonly source: string
  readonly target: string
  readonly status: RedirectStatus
}

// ---------------------------------------------------------------------------
// Rules — transcribed from public/_redirects
// ---------------------------------------------------------------------------

/**
 * All redirect rules as a readonly tuple.
 *
 * Keep this list in sync with `public/_redirects`. Each entry is an
 * exact-match source path, a target path, and an HTTP status code.
 */
export const REDIRECT_RULES: readonly RedirectRule[] = [
  // ── Blog Post Redirects — old VuePress URLs → current blog URLs ──────
  {
    source: "/posts/2019/01/28/discord-rss.html",
    target: "/blog/2019-01-28--discord_rss/discord_rss/",
    status: 301,
  },
  {
    source: "/posts/2019/01/11/set-cmd-chemes.html",
    target: "/blog/2019-01-11--set_cmd_chemes/set_cmd_chemes/",
    status: 301,
  },
  {
    source: "/posts/2019/03/30/make-vuepress-blog.html",
    target: "/blog/2019-03-30--vuepress_blog/make_vuepress_blog/",
    status: 301,
  },
  {
    source: "/posts/2018/12/04/tutanota.html",
    target: "/blog/2018-12-04--tutanota/tutanota/",
    status: 301,
  },
  {
    source: "/posts/2019/04/15/webpack-scss.html",
    target: "/blog/2019-04-15--webpack-scss/webpack-scss/",
    status: 301,
  },
  {
    source: "/posts/2019/04/17/webpack-sass-typescript.html",
    target:
      "/blog/2019-04-17--webpack-sass-typescript/webpack-sass-typescript/",
    status: 301,
  },
  {
    source: "/posts/2019/06/14/cant-install-npm-sharp.html",
    target: "/blog/2019-06-14--npm-sharp/cant-install-npm-sharp/",
    status: 301,
  },
  {
    source: "/posts/2019/04/29/nextjs-with-typescript.html",
    target: "/blog/2019-04-29--nextjs-with-typescript/nextjs-with-typescript/",
    status: 301,
  },
  {
    source: "/posts/2018/11/30/typora.html",
    target: "/blog/2018-11-30--typora/typora/",
    status: 301,
  },
  {
    source: "/posts/2019/05/18/svg-object-move.html",
    target: "/blog/2019-05-18--svg-object-move/svg-object-move/",
    status: 301,
  },
  {
    source: "/posts/2019/03/29/change-blog-system.html",
    target: "/blog/2019-03-29--change_blog_system/change_blog_system/",
    status: 301,
  },
  {
    source: "/posts/2019/04/14/start-react-with-typescript.html",
    target:
      "/blog/2019-04-14--start-react-with-typescript/start-react-with-typescript/",
    status: 301,
  },

  // ── Blog Post Redirects — duplicated Markdown file URLs → canonical ───
  {
    source:
      "/blog/2023-01-10-connect_usb_to_wsl/wsl%E3%81%A7USB%E6%8E%A5%E7%B6%9A/",
    target: "/blog/2023-01-10--connect_usb_to_wsl/",
    status: 301,
  },
  {
    source:
      "/blog/2023-01-16-reboot-microk8s-node/microk8s%E3%81%AE%E3%83%8E%E3%83%BC%E3%83%89%E3%82%92%E5%86%8D%E8%B5%B7%E5%8B%95%E3%81%99%E3%82%8B/",
    target: "/blog/2023-01-16--reboot-microk8s-node/",
    status: 301,
  },
  {
    source:
      "/blog/2023-01-26-build_docker_multi_architecture_with_github_action/GitHub_Action%E3%81%A7ARM64%E3%81%A8AMD64%E3%81%AEDocker%E3%82%A4%E3%83%A1%E3%83%BC%E3%82%B8%E3%82%92%E3%83%93%E3%83%AB%E3%83%89%E3%81%99%E3%82%8B/",
    target:
      "/blog/2023-01-26--build_docker_multi_architecture_with_github_action/",
    status: 301,
  },

  // ── Legacy single-hyphen slug redirects → double-dash canonical URLs ──
  {
    source:
      "/blog/2018-03-10-agreement_github_personal/agreement_github_personal/",
    target:
      "/blog/2018-03-10--agreement_github_personal/agreement_github_personal/",
    status: 301,
  },
  {
    source: "/blog/2018-03-11-simplenote_shortcut/",
    target: "/blog/2018-03-11--simplenote_shortcut/",
    status: 301,
  },
  {
    source: "/blog/2018-03-11-use_google_domains/use_google_domains/",
    target: "/blog/2018-03-11--use_google_domains/use_google_domains/",
    status: 301,
  },
  {
    source: "/blog/2018-05-19-hiyokonitsuduke/hiyokonitsuduke/",
    target: "/blog/2018-05-19--hiyokonitsuduke/hiyokonitsuduke/",
    status: 301,
  },
  {
    source: "/blog/2018-05-19-myskill/myskill/",
    target: "/blog/2018-05-19--myskill/myskill/",
    status: 301,
  },
  {
    source: "/blog/2018-05-20-dont_alone/dont_alone/",
    target: "/blog/2018-05-20--dont_alone/dont_alone/",
    status: 301,
  },
  {
    source: "/blog/2018-05-22-jsonkeytolowercamel/-jsonkeytolowercamel/",
    target: "/blog/2018-05-22--jsonkeytolowercamel/-jsonkeytolowercamel/",
    status: 301,
  },
  {
    source: "/blog/2018-10-23-lets_signal/lets_signal/",
    target: "/blog/2018-10-23--lets_signal/lets_signal/",
    status: 301,
  },
  {
    source: "/blog/2018-11-23-discord-slack/discord-slack/",
    target: "/blog/2018-11-23--discord-slack/discord-slack/",
    status: 301,
  },
  {
    source: "/blog/2018-11-23-start-blog/start-blog/",
    target: "/blog/2018-11-23--start-blog/start-blog/",
    status: 301,
  },
  {
    source: "/blog/2018-11-27-gitlab_gitbook/gitlab_gitbook/",
    target: "/blog/2018-11-27--gitlab_gitbook/gitlab_gitbook/",
    status: 301,
  },
  {
    source: "/blog/2018-11-28-speed_up/speed_up/",
    target: "/blog/2018-11-28--speed_up/speed_up/",
    status: 301,
  },
  {
    source: "/blog/2018-11-29-disable_fb_comment/disable_fb_comment/",
    target: "/blog/2018-11-29--disable_fb_comment/disable_fb_comment/",
    status: 301,
  },
  {
    source: "/blog/2018-11-30-typora/typora/",
    target: "/blog/2018-11-30--typora/typora/",
    status: 301,
  },
  {
    source: "/blog/2018-12-02-vuepress/vuepress/",
    target: "/blog/2018-12-02--vuepress/vuepress/",
    status: 301,
  },
  {
    source: "/blog/2018-12-03-tls_mail/tls_mail/",
    target: "/blog/2018-12-03--tls_mail/tls_mail/",
    status: 301,
  },
  {
    source: "/blog/2018-12-04-tutanota/tutanota/",
    target: "/blog/2018-12-04--tutanota/tutanota/",
    status: 301,
  },
  {
    source: "/blog/2019-01-11-set_cmd_chemes/set_cmd_chemes/",
    target: "/blog/2019-01-11--set_cmd_chemes/set_cmd_chemes/",
    status: 301,
  },
  {
    source: "/blog/2019-01-28-discord_rss/discord_rss/",
    target: "/blog/2019-01-28--discord_rss/discord_rss/",
    status: 301,
  },
  {
    source:
      "/blog/2019-01-29-firefox_send_tresorit_send/firefox_send_tresorit_send/",
    target:
      "/blog/2019-01-29--firefox_send_tresorit_send/firefox_send_tresorit_send/",
    status: 301,
  },
  {
    source: "/blog/2019-03-04-complain_blog_system/complain_blog_system/",
    target: "/blog/2019-03-04--complain_blog_system/complain_blog_system/",
    status: 301,
  },
  {
    source: "/blog/2019-03-29-change_blog_system/change_blog_system/",
    target: "/blog/2019-03-29--change_blog_system/change_blog_system/",
    status: 301,
  },
  {
    source: "/blog/2019-03-30-vuepress_blog/make_vuepress_blog/",
    target: "/blog/2019-03-30--vuepress_blog/make_vuepress_blog/",
    status: 301,
  },
  {
    source: "/blog/2019-04-02-tree_command/tree_command/",
    target: "/blog/2019-04-02--tree_command/tree_command/",
    status: 301,
  },
  {
    source: "/blog/2019-04-04-yubikey_guide/yubikey_guide/",
    target: "/blog/2019-04-04--yubikey_guide/yubikey_guide/",
    status: 301,
  },
  {
    source:
      "/blog/2019-04-10-microk8s-install-error-utils/microk8s-install-error-utils/",
    target:
      "/blog/2019-04-10--microk8s-install-error-utils/microk8s-install-error-utils/",
    status: 301,
  },
  {
    source:
      "/blog/2019-04-14-start-react-with-typescript/start-react-with-typescript/",
    target:
      "/blog/2019-04-14--start-react-with-typescript/start-react-with-typescript/",
    status: 301,
  },
  {
    source: "/blog/2019-04-14-learn-typescript/learn-typescript/",
    target: "/blog/2019-04-14--learn-typescript/learn-typescript/",
    status: 301,
  },
  {
    source:
      "/blog/2019-04-15-create-webpack-environment/create-webpack-environment/",
    target:
      "/blog/2019-04-15--create-webpack-environment/create-webpack-environment/",
    status: 301,
  },
  {
    source: "/blog/2019-04-15-learn-webpack/learn-webpack/",
    target: "/blog/2019-04-15--learn-webpack/learn-webpack/",
    status: 301,
  },
  {
    source: "/blog/2019-04-15-learn-sass/learn-sass/",
    target: "/blog/2019-04-15--learn-sass/learn-sass/",
    status: 301,
  },
  {
    source: "/blog/2019-04-15-webpack-scss/webpack-scss/",
    target: "/blog/2019-04-15--webpack-scss/webpack-scss/",
    status: 301,
  },
  {
    source: "/blog/2019-04-16-learn-react/learn-react/",
    target: "/blog/2019-04-16--learn-react/learn-react/",
    status: 301,
  },
  {
    source: "/blog/2019-04-17-webpack-sass-typescript/webpack-sass-typescript/",
    target:
      "/blog/2019-04-17--webpack-sass-typescript/webpack-sass-typescript/",
    status: 301,
  },
  {
    source: "/blog/2019-04-17-web-design-practice-1/web-design-practice-1/",
    target: "/blog/2019-04-17--web-design-practice-1/web-design-practice-1/",
    status: 301,
  },
  {
    source:
      "/blog/2019-04-19-apple-store-google-store-link/apple-store-google-store-link/",
    target:
      "/blog/2019-04-19--apple-store-google-store-link/apple-store-google-store-link/",
    status: 301,
  },
  {
    source: "/blog/2019-04-29-nextjs-with-typescript/nextjs-with-typescript/",
    target: "/blog/2019-04-29--nextjs-with-typescript/nextjs-with-typescript/",
    status: 301,
  },
  {
    source: "/blog/2019-05-15-kazam-screencaster/kazam-screencaster/",
    target: "/blog/2019-05-15--kazam-screencaster/kazam-screencaster/",
    status: 301,
  },
  {
    source: "/blog/2019-05-18-svg-object-move/svg-object-move/",
    target: "/blog/2019-05-18--svg-object-move/svg-object-move/",
    status: 301,
  },
  {
    source: "/blog/2019-06-06-ubuntu-19-04/ubuntu-19-04/",
    target: "/blog/2019-06-06--ubuntu-19-04/ubuntu-19-04/",
    status: 301,
  },
  {
    source: "/blog/2019-06-14-npm-sharp/cant-install-npm-sharp/",
    target: "/blog/2019-06-14--npm-sharp/cant-install-npm-sharp/",
    status: 301,
  },
  {
    source: "/blog/2019-06-17-gatsbyjs-react-pose/gatsbyjs-react-pose/",
    target: "/blog/2019-06-17--gatsbyjs-react-pose/gatsbyjs-react-pose/",
    status: 301,
  },
  {
    source: "/blog/2019-06-28-change_blog_vewpress_to_gatsbyjs/",
    target: "/blog/2019-06-28--change_blog_vewpress_to_gatsbyjs/",
    status: 301,
  },
  {
    source: "/blog/2020-01-06-start-php/",
    target: "/blog/2020-01-06--start-php/",
    status: 301,
  },
  {
    source: "/blog/2020-01-07-start-php2/",
    target: "/blog/2020-01-07--start-php2/",
    status: 301,
  },
  {
    source: "/blog/2020-01-07-start-php3/",
    target: "/blog/2020-01-07--start-php3/",
    status: 301,
  },
  {
    source: "/blog/2020-01-08-Kubernetes-start/",
    target: "/blog/2020-01-08--Kubernetes-start/",
    status: 301,
  },
  {
    source: "/blog/2020-01-08-start-php4/",
    target: "/blog/2020-01-08--start-php4/",
    status: 301,
  },
  {
    source: "/blog/2020-02-04-ubuntu-switch-window/",
    target: "/blog/2020-02-04--ubuntu-switch-window/",
    status: 301,
  },
  {
    source: "/blog/2020-02-05-change-japanese-shortcut/",
    target: "/blog/2020-02-05--change-japanese-shortcut/",
    status: 301,
  },
  {
    source: "/blog/2020-02-11-design-tools/",
    target: "/blog/2020-02-11--design-tools/",
    status: 301,
  },
  {
    source: "/blog/2021-04-02-use-yubikey-on-wsl/",
    target: "/blog/2021-04-02--use-yubikey-on-wsl/",
    status: 301,
  },
  {
    source: "/blog/2021-04-04-kubernetes--ingress/",
    target: "/blog/2021-04-04--kubernetes--ingress/",
    status: 301,
  },
  {
    source: "/blog/2021-06-13-rename-lvm-volume/",
    target: "/blog/2021-06-13--rename-lvm-volume/",
    status: 301,
  },
  {
    source: "/blog/2021-06-15-flutter-linux-build/",
    target: "/blog/2021-06-15--flutter-linux-build/",
    status: 301,
  },
  {
    source: "/blog/2021-12-22-change-keyboard-swicth-Boba-U4/",
    target: "/blog/2021-12-22--change-keyboard-swicth-Boba-U4/",
    status: 301,
  },
  {
    source: "/blog/2022-05-11-create_microk8s_cluster_on_raspberry_pi/",
    target: "/blog/2022-05-11--create_microk8s_cluster_on_raspberry_pi/",
    status: 301,
  },
  {
    source: "/blog/2022-05-20-react-native-webview/",
    target: "/blog/2022-05-20--react-native-webview/",
    status: 301,
  },
  {
    source: "/blog/2022-07-04-study-for-riss/",
    target: "/blog/2022-07-04--study-for-riss/",
    status: 301,
  },
  {
    source: "/blog/2022-10-13-category-variable/",
    target: "/blog/2022-10-13--category-variable/",
    status: 301,
  },
  {
    source: "/blog/2022-10-18-change_windows_11_taskbar_position/",
    target: "/blog/2022-10-18--change_windows_11_taskbar_position/",
    status: 301,
  },
  {
    source: "/blog/2022-12-20-jetbrains_devcontainer/",
    target: "/blog/2022-12-20--jetbrains_devcontainer/",
    status: 301,
  },

  // ── Additional single-hyphen slug redirects (2023–2025) ───────────────
  {
    source: "/blog/2023-01-10-connect_usb_to_wsl/",
    target: "/blog/2023-01-10--connect_usb_to_wsl/",
    status: 301,
  },
  {
    source: "/blog/2023-01-16-reboot-microk8s-node/",
    target: "/blog/2023-01-16--reboot-microk8s-node/",
    status: 301,
  },
  {
    source:
      "/blog/2023-01-26-build_docker_multi_architecture_with_github_action/",
    target:
      "/blog/2023-01-26--build_docker_multi_architecture_with_github_action/",
    status: 301,
  },
  {
    source: "/blog/2024-08-19-create_tyranoscript_plugin/",
    target: "/blog/2024-08-19--create_tyranoscript_plugin/",
    status: 301,
  },
  {
    source: "/blog/2024-09-04-2024_programming_language/",
    target: "/blog/2024-09-04--2024_programming_language/",
    status: 301,
  },
  {
    source: "/blog/2024-09-06-git-install/",
    target: "/blog/2024-09-06--git-install/",
    status: 301,
  },
  {
    source: "/blog/2025-08-19-make_firefox_use_dolphin/",
    target: "/blog/2025-08-19--make_firefox_use_dolphin/",
    status: 301,
  },
] as const

// ---------------------------------------------------------------------------
// Lookup map — built once at module load for O(1) exact-match checks
// ---------------------------------------------------------------------------

/**
 * Map from source path → redirect rule for O(1) lookup.
 *
 * Built at module load from `REDIRECT_RULES`. If duplicate sources exist,
 * the first rule wins (matches Pages `_redirects` first-match semantics).
 */
const redirectMap: ReadonlyMap<string, RedirectRule> = new Map(
  REDIRECT_RULES.reduce<[string, RedirectRule][]>((acc, rule) => {
    // Only the first occurrence of a source wins (first-match semantics).
    if (!acc.some(([src]) => src === rule.source)) {
      acc.push([rule.source, rule])
    }
    return acc
  }, [])
)

/**
 * Look up a redirect rule by exact source path.
 *
 * Returns the matching `RedirectRule` or `undefined` if no rule applies.
 */
export function findRedirect(pathname: string): RedirectRule | undefined {
  return redirectMap.get(pathname)
}
