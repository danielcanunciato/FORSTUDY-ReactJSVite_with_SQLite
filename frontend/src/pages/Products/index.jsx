import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Products() {

    document.title = "Products List";

    const [getProds, setProds] = useState([]);
    const { prodID } = useParams();

    useEffect(() => {
        if (!prodID) {
            fetch("http://localhost:4400/products")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProds(data);
            })
            .catch(err => console.error(err));

        } else {
            fetch(`http://localhost:4400/products/prod/${prodID}`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setProds(data);
                }
            })
            .catch(err => console.error(err));
        }

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
                <h3
                    style={{
                        textAlign: "left",
                        width: "75%",
                        marginLeft: "15px"
                    }}
                >
                    Produtos Disponíveis
                </h3>

                {getProds.length > 0 ? (
                    <table
                        style={{
                            width: "90%",
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
                                <th style={{ padding: "12px" }}>Product Name</th>
                                <th style={{ padding: "12px" }}>Product Price</th>
                                <th style={{ padding: "12px" }}>Product Quantity</th>
                                <th style={{ padding: "12px" }}>Client Name</th>
                            </tr>
                        </thead>

                        <tbody>
                            {getProds.map((prod, index) => (
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
                                        ${prod.product_price}
                                    </td>

                                    <td style={{ padding: "12px" }}>
                                        {prod.product_quantity}
                                    </td>

                                    <td style={{ padding: "12px" }}>
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