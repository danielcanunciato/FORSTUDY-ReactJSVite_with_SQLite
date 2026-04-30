import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Products() {
    document.title = "Products List";

    const [getProds, setProds] = useState([]);
    const [productExist, setProdExist] = useState(false);
    const { prodID } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let response;

                // if there is no prodID → get all products
                if (!prodID) {
                    response = await fetch("http://localhost:4400/products");
                }
                // if there is prodID → get single product
                else {
                    response = await fetch(
                        `http://localhost:4400/products/${prodID}`
                    );
                }

                // no product found
                if (response.status === 404) {
                    setProdExist(false);
                    setProds([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Error fetching products");
                }

                const data = await response.json();

                const normalizedData = Array.isArray(data) ? data : [data];

                setProds(normalizedData);
                setProdExist(normalizedData.length > 0);

            } catch (err) {
                console.error(err);
                setProdExist(false);
                setProds([]);
            }
        };

        fetchProducts();
    }, [prodID]);

    return (
        <>
            <div style={{ marginTop: "16px" }}>
                <h1>Produtos</h1>
                <p>
                    Experimento com listagem de produtos
                    imaginários para fins de estudo com ReactJS+Vite & SQLite3.
                </p>
            </div>

            <div>
                <h3
                    style={{
                        textAlign: "left",
                        width: "75%",
                        marginLeft: "15px"
                    }}
                >
                    Produtos Disponíveis
                </h3>

                {productExist ? (
                    <table
                        style={{
                            width: "100%",
                            margin: "20px auto",
                            borderCollapse: "collapse",
                            textAlign: "left"
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
                                <th style={{ padding: "12px" }}>Preço</th>
                                <th style={{ padding: "12px" }}>Quantidade</th>
                                <th style={{ padding: "12px" }}>Status</th>
                                <th style={{ padding: "12px" }}>#ID Cliente</th>
                            </tr>
                        </thead>

                        <tbody>
                            {getProds.map((prod, index) => (
                                <tr
                                    key={prod.product_prodID}
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

                                    <td style={{ padding: "12px" }}>
                                        <b>
                                            #
                                            {prod.clientid || prod.client_id}
                                        </b>{" "}
                                        {prod.client_name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>
                        <p>Sem produtos existentes.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Products;