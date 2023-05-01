import './App.css';
import Editor from './Components/Editor';
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AiGenerator from './Pages/AiGenerator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/ai' element={<AiGenerator />} />
        <Route path='/editor/:lang' element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
