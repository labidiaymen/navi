import * as React from 'react'
import { Route } from 'navi'
import { NavContext } from './NavContext'


export function useCurrentRoute() {
  let { steadyRoute, busyRoute } = React.useContext(NavContext)
  return steadyRoute || busyRoute
}


export interface NavRouteProps {
  /**
   * A render function that can be used to access the current route.
   */
  children: (route: Route) => React.ReactNode
}

export namespace NavRoute {
  export type Props = NavRouteProps
}

export function NavRoute(props: NavRouteProps) {
  return (
    <NavContext.Consumer>
      {context => props.children((context.steadyRoute || context.busyRoute)!)}
    </NavContext.Consumer>
  )
}
