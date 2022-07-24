import { BrowserRouter } from "react-router-dom"
import routes from "./routes"
import renderRoutes from "../utils/router-config"
import "@kube-design/components/esm/styles/index.css"
import "../scss/main.scss"

function App() {
  return (
    <div>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </div>
  )
}

export default App
