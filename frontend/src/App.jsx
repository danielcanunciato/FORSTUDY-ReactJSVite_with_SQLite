import { useState } from 'react';
import './App.css'

function App() {
  
  const [getProds, setProds] = useState([])

  const mocProds = [
    {id: 1, name: 'Product #1', price: 15},
    {id: 2, name: 'Product #2', price: 85.55}
  ]

  return (
    <>

      <div style={{marginTop: '16px'}}>

        <h1>Produtos</h1>
        <p> 
          
          Experimento com listagem de produtos 
          imaginários para fins de estudo com ReactJS+Vite & SQLite3.

        </p>

      </div>

      <div>

        <h3 style={{textAlign: 'left', width: '75%', marginLeft: '15px'}}>Produtos Disponíveis</h3>
        
        {
          mocProds.map(prod=>(

            <p 
              style={{textAlign: 'left', backgroundColor: prod.id % 2 === 0 ? '#0f0f0f' : '#050505'}} 
              key={prod.id}
            >    
                {prod.name}
            </p>

          ))
        }

      </div>
      
    </>
  )
}

export default App
