import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Clients() {
    document.title = "Clients List";

    const { id } = useParams();

    const [clients, setClients] = useState([]);
    const [clientProducts, setClientProducts] = useState([]);
    const [clientExists, setClientExists] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // NO ID → fetch all clients
                if (!id) {
                    const response = await fetch("http://localhost:4400/clients");

                    if (!response.ok) {
                        throw new Error("Error fetching clients");
                    }

                    const data = await response.json();
                    setClients(data);
                    return;
                }

                // WITH ID → fetch single client
                const clientResponse = await fetch(
                    `http://localhost:4400/clients/${id}`
                );

                if (clientResponse.status === 404) {
                    setClientExists(false);
                    setClients([]);
                    setClientProducts([]);
                    return;
                }

                if (!clientResponse.ok) {
                    throw new Error("Error fetching client");
                }

                const clientData = await clientResponse.json();

                setClients([clientData]);
                setClientExists(true);

                // fetch products from that client
                const productsResponse = await fetch(
                    `http://localhost:4400/products/${id}`
                );

                if (productsResponse.status === 404) {
                    setClientProducts([]);
                    return;
                }

                if (!productsResponse.ok) {
                    throw new Error("Error fetching client products");
                }

                const productsData = await productsResponse.json();
                setClientProducts(productsData);

            } catch (error) {
                console.error(error);
                setClients([]);
                setClientProducts([]);
                setClientExists(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <>
            <div style={{ marginTop: "16px" }}>
                <h1>Clients</h1>
                <p>
                    Experimento com listagem de clientes ativos
                    imaginários para fins de estudo com ReactJS+Vite & SQLite3.
                </p>
            </div>

            <div>
                {/* CLIENT SECTION */}
                <div>
                    <h3
                        style={{
                            textAlign: "left",
                            width: "75%",
                            marginLeft: "15px"
                        }}
                    >
                        Clientes Ativos
                    </h3>

                    {!id ? (
                        clients.length > 0 ? (
                            <table
                                style={{
                                    width: "100%",
                                    margin: "20px auto",
                                    borderCollapse: "collapse",
                                    textAlign: "center"
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            backgroundColor: "#111",
                                            color: "white"
                                        }}
                                    >
                                        <th style={{ padding: "12px" }}>ID</th>
                                        <th style={{ padding: "12px" }}>Nome</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {clients.map((client, index) => (
                                        <tr
                                            key={client.id}
                                            style={{
                                                backgroundColor:
                                                    index % 2 === 0
                                                        ? "#1a1a1a"
                                                        : "#2a2a2a"
                                            }}
                                        >
                                            <td style={{ padding: "12px" }}>
                                                {client.id}
                                            </td>

                                            <td style={{ padding: "12px" }}>
                                                {client.name}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Sem clientes ativos.</p>
                        )
                    ) : clientExists ? (
                        <h2>
                            <b>Cliente: </b>
                            {clients[0]?.name}
                        </h2>
                    ) : (
                        <h2>
                            <span style={{ color: "red" }}>
                                Cliente Inexistente
                            </span>
                        </h2>
                    )}
                </div>

                <hr style={{ marginTop: "30px" }} />

                {/* PRODUCTS SECTION */}
                {id && clientExists && (
                    <div>
                        {clientProducts.length > 0 ? (
                            <table
                                style={{
                                    width: "100%",
                                    margin: "20px auto",
                                    borderCollapse: "collapse",
                                    textAlign: "center"
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            backgroundColor: "#111",
                                            color: "white"
                                        }}
                                    >
                                        <th style={{ padding: "12px" }}>ID</th>
                                        <th style={{ padding: "12px" }}>
                                            Produto
                                        </th>
                                        <th style={{ padding: "12px" }}>
                                            Preço
                                        </th>
                                        <th style={{ padding: "12px" }}>
                                            Quantidade
                                        </th>
                                        <th style={{ padding: "12px" }}>
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {clientProducts.map((prod, index) => (
                                        <tr
                                            key={prod.product_id}
                                            style={{
                                                backgroundColor:
                                                    index % 2 === 0
                                                        ? "#1a1a1a"
                                                        : "#2a2a2a"
                                            }}
                                        >
                                            <td style={{ padding: "12px" }}>
                                                {prod.product_id}
                                            </td>

                                            <td style={{ padding: "12px" }}>
                                                {prod.product_name}
                                            </td>

                                            <td style={{ padding: "12px" }}>
                                                R$
                                                {Number(
                                                    prod.product_price
                                                ).toFixed(2)}
                                            </td>

                                            <td style={{ padding: "12px" }}>
                                                {prod.product_quantity}
                                            </td>

                                            <td style={{ padding: "12px" }}>
                                                {prod.product_status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Este cliente não possui produtos.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default Clients;