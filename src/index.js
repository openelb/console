import React, { Suspense } from 'react';
import { Loading } from '@kube-design/components'
import { createRoot } from 'react-dom/client';
import App from './App';
import request from './utils/request'

window.request = request
window.globals = {}

const Render = (component) => {
  return (
    <Suspense fallback={<Loading className="ks-page-loading" />}>
      {component}
    </Suspense>
  );
}

export default App;


const root = createRoot(document.getElementById('root'));
root.render(
  Render(<App />)
);
