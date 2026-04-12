import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Clients() {

    document.title = "Clients List";

    const [getClients, setClients] = useState([]);
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
                            {user.id} : {user.name}
                        </p>
                    ))
                }
            </div>
        </>
    );
}

export default Clients;