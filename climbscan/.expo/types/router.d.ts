/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/redux/detectionsSlice`; params?: Router.UnknownInputParams; } | { pathname: `/redux/routesSlice`; params?: Router.UnknownInputParams; } | { pathname: `/redux/store`; params?: Router.UnknownInputParams; } | { pathname: `/pages/RouteMaker`; params?: Router.UnknownInputParams; } | { pathname: `/pages/camera`; params?: Router.UnknownInputParams; } | { pathname: `/pages/result`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/redux/detectionsSlice`; params?: Router.UnknownOutputParams; } | { pathname: `/redux/routesSlice`; params?: Router.UnknownOutputParams; } | { pathname: `/redux/store`; params?: Router.UnknownOutputParams; } | { pathname: `/pages/RouteMaker`; params?: Router.UnknownOutputParams; } | { pathname: `/pages/camera`; params?: Router.UnknownOutputParams; } | { pathname: `/pages/result`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/redux/detectionsSlice${`?${string}` | `#${string}` | ''}` | `/redux/routesSlice${`?${string}` | `#${string}` | ''}` | `/redux/store${`?${string}` | `#${string}` | ''}` | `/pages/RouteMaker${`?${string}` | `#${string}` | ''}` | `/pages/camera${`?${string}` | `#${string}` | ''}` | `/pages/result${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/redux/detectionsSlice`; params?: Router.UnknownInputParams; } | { pathname: `/redux/routesSlice`; params?: Router.UnknownInputParams; } | { pathname: `/redux/store`; params?: Router.UnknownInputParams; } | { pathname: `/pages/RouteMaker`; params?: Router.UnknownInputParams; } | { pathname: `/pages/camera`; params?: Router.UnknownInputParams; } | { pathname: `/pages/result`; params?: Router.UnknownInputParams; };
    }
  }
}
