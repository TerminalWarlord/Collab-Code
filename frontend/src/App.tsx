import './App.css'
import LoginForm from './components/auth/LoginForm';
import EditorArea from './components/EditorPage'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: 'login',
    element: <LoginForm />
  },
  {
    index: true,
    element: <EditorArea />
  }
])
function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
