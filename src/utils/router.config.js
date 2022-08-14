import React from 'react'
import { Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router'
import { isString, isObject, get } from 'lodash'

export const renderRoutes = (routes, extraProps = {}, switchProps = {}) =>
  routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => {
        const key = route.key || i

        if (route.redirect) {
          const { redirect } = route

          if (isString(redirect)) return <Redirect key={key} to={redirect} />

          if (isObject(redirect)) {
            return <Redirect key={key} {...redirect} />
          }
        }

        return (
          <Route
            key={key}
            exact={route.exact}
            path={route.path}
            render={props => {
              if (route.render) {
                return route.render(props)
              }
              return (
                <route.component {...props} {...extraProps} route={route} />
              )
            }}
            strict={route.strict}
          />
        )
      })}
    </Switch>
  ) : null

export const getIndexRoute = ({ path, to, ...rest }) => ({
  path,
  redirect: {
    from: path,
    to,
    ...rest,
  },
})

export const getChildRoutes = (routes, path) => {
  const newRoutes = routes.map(route => ({
    ...route,
    path: `${path}/${route.name}`,
  }))

  newRoutes.push(
    getIndexRoute({ path, to: get(newRoutes[0], 'path'), exact: true }),
    getIndexRoute({ path: '*', to: '/404', exact: true })
  )

  return newRoutes
}