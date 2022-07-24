import React from "react"
import { Route, Routes } from "react-router-dom"

const renderRoutes = (routes: RouteType[], extraProps = {}) =>
  routes ? (
    <Routes>
      {routes.map((route) => {
        if (route.routes) {
          return (
            <Route path={route.path} element={route.element}>
              {route.routes.map((route) => (
                <Route path={route.path} element={route.element} />
              ))}
            </Route>
          )
        }

        if (route.index) {
          return (
            <Route index element={route.element} />
          )
        }

        return (
          <Route path={route.path} element={route.element} />
        )
      })}
    </Routes>
  ) : null

type RouteType = {
  path: string,
  element: React.ReactNode,
  routes?: RouteType[],
  index?: boolean
}

export default renderRoutes