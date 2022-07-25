import React from "react"
import { Route, Routes } from "react-router-dom"

const renderRoutes = (routes: RouteType[], extraProps = {}) =>
  routes ? (
    <Routes>
      {routes.map((route, i) => {
        if (route.routes) {
          return (
            <Route path={route.path} element={route.element} key={i}>
              {route.routes.map((route, j) => (
                <Route path={route.path} element={route.element} key={j} />
              ))}
            </Route>
          )
        }

        if (route.index) {
          return (
            <Route index element={route.element} key={i} />
          )
        }

        return (
          <Route path={route.path} element={route.element} key={i} />
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