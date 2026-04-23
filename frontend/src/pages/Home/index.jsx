import './index.css'

function Home() {
    document.title = "Prática com API"

    return (
        <>
        
            <div>
                <h3>Prática de comunicação de API com frontend</h3>

                <hr style={{width: "75%"}} />
                <hr style={{width: "75%"}} />

                <p>
                    Projeto usado para praticar a criação e aplicação de uma API simples local 
                    e usando-o para comunicar com o frontend.
                </p>

                <hr style={{width: "75%"}} />

                <p>
                    Backend: API construida em ExpressJS utilizando JWT para geração de token de autorização 
                    e SQLite3 para testes com banco de dados e comandos SQL.
                </p>
                <p>
                    Frontend: Páginas criadas em ReactJS + Vite usando React Router Dom para criação das rotas,
                    estilização e construção dos elementos usando tanto a aplicação XML built-in do React mais
                    códigos comuns de HTML5 e CSS3
                </p>

                <hr style={{width: "75%"}} />
                <hr style={{width: "75%"}} />

                <h3> Rotas disponíveis para testar a API </h3>
                <p>Certifique que o código server.js em "./backend" esteja rodando constantemente em um terminal.</p>

                <ul>
                    <li>"/clients"</li>
                    <li>"/clients/clientID" <span style={{color: 'gray'}}>(replace client ID with a active client's id)</span></li>
                    <li>"/products"</li>
                    <li>"/products/productID" <span style={{color: 'gray'}}>(replace product ID with a active product's id</span></li>
                    <li>"/users"</li>
                    <li>"/users/userID" <span style={{color: 'gray'}}>(replace user ID with a active user's id</span></li>
                </ul>
            </div>

        
        </>
    )
}

export default Home