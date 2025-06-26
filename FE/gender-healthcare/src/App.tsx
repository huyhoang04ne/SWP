import React from 'react';
import { RouterProvider } from 'react-router-dom';
import routers from './routers/router';


const App: React.FC = () => {
  return (
    <div className="App bg-gray-50 min-h-screen">
      <RouterProvider router={routers} />
    </div>
  );
};

export default App;