import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

function Users() {

    document.title = "Users List";

    const [searchParams] = useSearchParams();
    const getRole = searchParams.get("role");

    const [getUsers, setUsers] = useState([]);
    const { id } = useParams();
    
    const [getUsrExist, setUsrExist] = useState(false);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:4400/users/${id}`)
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
                setUsers([data]);
            })
            .catch(err => console.error(err));

        } else if (getRole) {
            fetch(`http://localhost:4400/users?role=${getRole}`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));

        } else {
            fetch("http://localhost:4400/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data);
            })
            .catch(err => console.error(err));
        }
    }, []);

    return (
        <>
            <div style={{ marginTop: '16px' }}>
                <h1>Usuários</h1>
                <p>
                    Experimento com listagem de usuários ativos
                    imaginários para fins de estudo com ReactJS+Vite & SQLite3.
                </p>
            </div>

            <div>

                <div>

                    <h3 style={{ textAlign: 'left', width: '75%', marginLeft: '15px' }}>
                        Usuários Ativos
                    </h3>

                    
                    {getUsers.length > 0 ? (
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
                                    <th style={{ padding: "12px" }}>Name</th>
                                    <th style={{ padding: "12px" }}>Is Active</th>
                                    <th style={{ padding: "12px" }}>Role</th>
                                    <th style={{ padding: "12px" }}>Joined At</th>
                                    <th style={{ padding: "12px" }}>Updated At</th>
                                </tr>
                            </thead>

                            <tbody>
                                {getUsers.map((client, index) => (
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
                                            {client.username}
                                        </td>

                                        <td style={{ padding: "12px" }}>
                                            {client.is_active == true ? ("✅") : ("❌")}
                                        </td>

                                        <td style={{ padding: "12px" }}>
                                            {
                                                client.role === "mst" ? ("MASTER") :
                                                client.role === "adm" ? ("ADMIN") :
                                                ("USER")
                                            }
                                        </td>

                                        <td style={{ padding: "12px" }}>
                                            {client.created_at}
                                        </td>

                                        <td style={{ padding: "12px" }}>
                                            {client.updated_at}
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
            </div>
        </>
    );
}

export default Users;