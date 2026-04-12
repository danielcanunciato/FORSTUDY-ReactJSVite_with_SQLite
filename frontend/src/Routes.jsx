import { Routes, Route } from 'react-router-dom'

// pages
import Products from './pages/Products'
import Clients from './pages/Clients'

function WebRoutes() {
    return (
        <>
        
            <Routes>

                <Route path="/products" element={<Products />}></Route>
                <Route path="/users" element={<Clients />}></Route>

            </Routes>
        
        </>
    )
}

export default WebRoutes