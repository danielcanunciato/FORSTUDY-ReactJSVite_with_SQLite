import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Clients() {

    document.title = "Clients List";

    const [getClients, setClients] = useState([]);
    const [getClientProds, setClientProds] = useState([]);
    const { id } = useParams();

    const [getUsrExist, setUsrExist] = useState(false);

    useEffect(() => {
        if (!id) {
            fetch("http://localhost:4400/clients")
            .then(res => res.json())
            .then(data => {
                setClients(data);
            })
            .catch(err => console.error(err));

        } else {
            fetch(`http://localhost:4400/clients/${id}`)
            .then(res => {
                if (res.status === 404) {
                    return [];
                }

                if (!res.ok) {
                    throw new Error("Error fetching client");
                }

                setUsrExist(true);
                return res.json();
            })
            .then(data => {
                setClients([data]);
            })
            .catch(err => console.error(err));

            fetch(`http://localhost:4400/products/${id}`)
            .then(res => {
                if (res.status === 404) {
                    return [];
                }

                if (!res.ok) {
                    throw new Error("Error fetching clients products");
                }

                return res.json();
            })
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
                        (id) ? (
                            getUsrExist ? (
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
                            ) : (
                                <p
                                    style={{
                                        textAlign: 'left',
                                        backgroundColor: '#050505'
                                    }}
                                >
                                    <b>Não existe um cliente com este id.</b>
                                </p>
                            )
                        ) : (
                            getClients.length > 0 ? (
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
                            ) : (
                                <p
                                    style={{
                                        textAlign: 'left',
                                        backgroundColor: '#050505'
                                    }}
                                >
                                    <b>Não há clientes ativos.</b>
                                </p>
                            )
                        )
                    }

                </div>

                <hr style={{marginTop: '30px'}} />

                <div>

                    { (id && getUsrExist) &&
                        (
                            (getClientProds.length > 0) ? (
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
                            ) : (
                                <div>
                                    <h3 style={{ textAlign: 'left', width: '75%', marginLeft: '15px' }}>
                                        Este cliente não possui produtos.
                                    </h3>
                                </div>
                            )
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default Clients;