import { Routes, Route } from 'react-router-dom'

// pages
import Products from './pages/Products'
import Clients from './pages/Clients'
import Users from './pages/Users'
import Home from './pages/Home'

function WebRoutes() {
    return (
        <>
        
            <Routes>

                <Route path="/products" element={<Products />}></Route>
                <Route path="/products/:clientID" element={<Products />}></Route>

                <Route path="/clients" element={<Clients />}></Route>
                <Route path="/clients/:id" element={<Clients />}></Route>

                <Route path="/users" element={<Users />}></Route>
                <Route path="/users/:id" element={<Users />}></Route>

                <Route path="/" element={<Home />}></Route>

            </Routes>
        
        </>
    )
}

export default WebRoutes