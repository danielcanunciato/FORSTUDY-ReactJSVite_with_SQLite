import { useState, useEffect } from "react";

function Products() {

    document.title = "Products List";

    const [getProds, setProds] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4400/products")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProds(data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <>
            <div style={{ marginTop: '16px' }}>
                <h1>Produtos</h1>
                <p>
                    Experimento com listagem de produtos
                    imaginários para fins de estudo com ReactJS+Vite & SQLite3.
                </p>
            </div>

            <div>
                <h3 style={{ textAlign: 'left', width: '75%', marginLeft: '15px' }}>
                    Produtos Disponíveis
                </h3>

                {
                    getProds.map(prod => (
                        <p
                            style={{
                                textAlign: 'left',
                                backgroundColor: prod.id % 2 === 0 ? '#0f0f0f' : '#050505'
                            }}
                            key={prod.id}
                        >
                            {prod.name}
                        </p>
                    ))
                }
            </div>
        </>
    );
}

export default Products;