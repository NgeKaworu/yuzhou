import { restful } from 'edk/src/utils/http';


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js');

    navigator?.serviceWorker?.ready?.then(function (reg) {
      // There's an active SW, but no controller for this tab.
      if (reg?.active && !navigator.serviceWorker.controller) {
        // Perform a soft reload to load everything from the SW and get
        // a consistent set of resources.
        window.location.reload();
      }
    });
  });
}
if (window.navigator.userAgent.toLowerCase().includes('chrome')) {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    //   e.prompt();
    // Wait for the user to respond to the prompt
    e.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
    });
  });
}

interface App {
  name: string; //	子应用唯一 id
  entry: string | { script: string[]; styles: [] }; //	子应用 html 地址
  credentials?: boolean; //	拉取 entry 时是否需要携带cookie，详见
  props?: object; //	主应用传递给子应用的数据
}

export const qiankun = restful
  .get<{ data: App[] }, { data: App[] }>('user-center/micro-app')
  .then(({ data: apps }) => ({
    // 注册子应用信息
    apps,
    // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
    lifeCycles: {},
    // 支持更多的其他配置，详细看这里 https://qiankun.umijs.org/zh/api/#start-opts
  }));

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * @deprecated Only supported on Chrome and Android Webview.
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
