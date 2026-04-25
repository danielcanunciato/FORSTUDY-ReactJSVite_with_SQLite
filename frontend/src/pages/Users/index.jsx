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

                    
                    {
                        (!id) ? (
                            getUsers.length > 0 ? (
                                getUsers.map(user => (
                                    <p
                                        style={{
                                            textAlign: 'left',
                                            backgroundColor: user.id % 2 === 0 ? '#0f0f0f' : '#050505'
                                        }}
                                        key={user.id}
                                    >
                                        <b>{user.id}</b> :: <b>{user.username}</b> :: <b>{
                                            user.username === "DEVTEST" ? (
                                                "SYSTEM"
                                            ) : (
                                                user.role === "mst" ? ( "MASTER" ) :
                                                user.role === "adm" ? ( "ADMIN" ) :
                                                ("USER")
                                            )
                                        }</b>
                                    </p>
                                ))
                            ) : (
                                <p
                                    style={{
                                        textAlign: 'left',
                                        backgroundColor: '#050505'
                                    }}
                                >
                                    <b>Não existe usuários ativos.</b>
                                </p>
                            )
                        ) : (
                            getUsrExist ? (
                                getUsers.map(user => (
                                    <p
                                        style={{
                                            textAlign: 'left',
                                            backgroundColor: user.id % 2 === 0 ? '#0f0f0f' : '#050505'
                                        }}
                                        key={user.id}
                                    >
                                        <b>{user.id}</b> :: <b>{user.username}</b> :: <b>{
                                            user.username === "DEVTEST" ? (
                                                "SYSTEM"
                                            ) : (
                                                user.role === "mst" ? ( "MASTER" ) :
                                                user.role === "adm" ? ( "ADMIN" ) :
                                                ("USER")
                                            )
                                        }</b>
                                    </p>
                                ))
                            ) : (
                                <p
                                    style={{
                                        textAlign: 'left',
                                        backgroundColor: '#050505'
                                    }}
                                >
                                    <b>Não existe um usuário com este id.</b>
                                </p>
                            )
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default Users;