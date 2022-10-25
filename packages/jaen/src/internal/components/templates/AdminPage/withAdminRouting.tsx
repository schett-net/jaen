import {HashRouter} from 'react-router-dom'
import {buildFromViews, BuiltViews, View} from './buildItemAndRoutesFromViews'

export interface WithAdminRoutingProps {
  routes: BuiltViews['routes']
  items: BuiltViews['items']
}

export function withAdminRouting<P>(
  // Then we need to type the incoming component.
  // This creates a union type of whatever the component
  // already accepts AND our extraInfo prop
  WrappedComponent: React.ComponentType<P & WithAdminRoutingProps>
) {
  const loadedViews = [
    {
      path: '/users',
      label: 'Users',
      Icon: null,
      Component: () => <div>Users</div>,
      group: 'Users'
    }
  ] as View[]

  const ComponentWithExtraInfo = ({
    views: optionViews,
    ...props
  }: P & {
    views: View[]
  }) => {
    // At this point, the props being passed in are the original props the component expects.

    const views = [...optionViews, ...loadedViews]

    const builtViews = buildFromViews(views)

    return (
      <HashRouter>
        {
          <WrappedComponent
            {...props as P}
            routes={builtViews.routes}
            items={builtViews.items}
          />
        }
      </HashRouter>
    )
  }
  return ComponentWithExtraInfo
}