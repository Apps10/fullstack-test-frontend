import { Route, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { StorePage } from './pages/StorePage'


function App(){
  return (
    <div>
      <div data-theme='light'>
        <Navbar/>
          <Routes>
            <Route path='/' element={ <StorePage/> } />
          </Routes>
         <Toaster/>
        </div>
     </div>
  )

}

export default App