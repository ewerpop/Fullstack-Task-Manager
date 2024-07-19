import "./style.css";
import TaskList from "./TaskList";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Registration from "./Registration";
import { useState } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Registration />
  },
  {
    path: '/tasks',
    element: <TaskList/>
  }
])

function App() {
  return (
    <main>
        <RouterProvider router={router}/>
    </main>
  );
}

export default App;
