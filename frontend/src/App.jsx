import "./style.css";
import TaskList from "./TaskList";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Registration from "./Registration";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Registration />
  },
  {
    path: '/',
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
