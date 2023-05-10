import './new.css';
import Editor from './Pages/Editor';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AiGenerator from './Pages/AiGenerator';
import Signin from "./Pages/Singin"
import Signup from "./Pages/Signup"
import { Toaster } from "react-hot-toast"
import Files from './Pages/Files';
import Forum from './Pages/Forum';
import Post from './Pages/Post';

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
          <Route path='/:username/editor/:id' element={<Editor />} />
          <Route path='/auth/signin' element={<Signin />} />
          <Route path='/auth/signup' element={<Signup />} />
          <Route path='/files' element={<Files />} />
          <Route path='/forum' element={<Forum />} />
          <Route path='/post/:id' element={<Post />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
