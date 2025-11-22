import './App.css'
import LoginForm from './components/auth/LoginForm';
import EditorArea from './components/EditorPage'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from './components/ui/sonner';

const router = createBrowserRouter([
  {
    path: 'login',
    element: <><LoginForm /><Toaster /></>
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
