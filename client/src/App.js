import './App.css';
import Editor from './Components/Editor';
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AiGenerator from './Pages/AiGenerator';
import Signin from "./Pages/Singin"
import Signup from "./Pages/Signup"
import { Toaster } from "react-hot-toast"
import Files from './Pages/Files';

function App() {
  return (
    <BrowserRouter>
      <>
        <Toaster
          position="top-center"
          reverseOrder={false}
           
          />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/ai' element={<AiGenerator />} />
          <Route path='/:username/editor/:filename' element={<Editor />} />
          <Route path='/auth/signin' element={<Signin />} />
          <Route path='/auth/signup' element={<Signup />} />
          <Route path='/files' element={<Files />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
