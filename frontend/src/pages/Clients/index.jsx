import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Clients() {

    document.title = "Clients List";

    const [getClients, setClients] = useState([]);
    const [getClientProds, setClientProds] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            fetch("http://localhost:4400/users")
            .then(res => res.json())
            .then(data => {
                setClients(data);
            })
            .catch(err => console.error(err));

        } else {
            fetch(`http://localhost:4400/users/${id}`)
            .then(res => res.json())
            .then(data => {
                setClients([data]);
            })
            .catch(err => console.error(err));

            fetch(`http://localhost:4400/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setClientProds(data);
                console.log(data);
            })
            .catch(err => console.error(err));
        }
    }, []);

    return (
        <>
            <div style={{ marginTop: '16px' }}>
                <h1>Clients</h1>
                <p>
                    Experimento com listagem de clientes ativos
                    imaginários para fins de estudo com ReactJS+Vite & SQLite3.
                </p>
            </div>

            <div>

                <div>

                    <h3 style={{ textAlign: 'left', width: '75%', marginLeft: '15px' }}>
                        Clientes Ativos
                    </h3>

                    {
                        getClients.map(user => (
                            <p
                                style={{
                                    textAlign: 'left',
                                    backgroundColor: user.id % 2 === 0 ? '#0f0f0f' : '#050505'
                                }}
                                key={user.id}
                            >
                                <b>{user.id}</b> :: <b>{user.name}</b>
                            </p>
                        ))
                    }

                </div>

                <hr style={{marginTop: '30px'}} />

                <div>

                    { id && 
                        (
                            <div>
                                <h3 style={{ textAlign: 'left', width: '75%', marginLeft: '15px' }}>
                                    Produtos atrelados a este id
                                </h3>

                                {
                                    getClientProds.map(clientprod => (
                                        <p
                                            style={{
                                                textAlign: 'left',
                                                backgroundColor: clientprod.product_id % 2 === 0 ? '#0f0f0f' : '#050505'
                                            }}
                                            key={clientprod.product_id}
                                        >
                                            <b>{clientprod.product_id}</b> :: <b>{clientprod.product_name}</b>
                                        </p>
                                    ))
                                }
                            </div>
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default Clients;