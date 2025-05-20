// npm init e posteriormente adicionar "type": "module" em package.json e o script "start" : "index.js"
// npm install express

import express from 'express'; // "type": "module"
// const express = require("express"); "type": "commonjs"
import session from 'express-session'
import verificarAutenticacao from "./seguranca/autenticacao.js";

const host = "0.0.0.0";
const porta = 3000;
const app = express(); // app web passa a ouvir a porta 3000

// Possibilitando a comunicação com estado (stateful)

app.use(session({
    secret: "M1nH4Ch4v3S3cR3t4",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true
    }
}));

// configurar o express para processar os parâmetros contidos na url
// qs: true - mais poderosa para lidar com parâmetros da requisição
// querystring
app.use(express.urlencoded({extended: true})); // midware
// compartilhando publicamente os arquivos existentes na pasta "publico"
app.use(express.static("publico")); // assets ou conteúdo estático

app.post("/login", (requisicao, resposta) => {
    // desestruturação javascript
    const {usuario, senha} = requisicao.body;
    if (usuario === "admin" && senha === "admin") {
        requisicao.session.autenticado = true;
        resposta.redirect("/menu.html");
    } else {
        let conteudo = `
            <!DOCTYPE html>
            <html lang="pt-br">
    
                <head>
                <meta charset="UTF-8">
                <title>Login</title>
                <link rel="stylesheet" href="css/bootstrap.min.css">
                <link rel="stylesheet" href="css/login.css">
                </head>
    
                <body>
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6 offset-md-3">
                                <h2 class="text-center text-dark mt-5">Bem-vindo</h2>
                                <div class="text-center mb-5 text-dark">Faça o login</div>
                                <div class="card my-5">
                                    <div class="container my-5 px-5 w-100">
                                        <div class="text-center">
                                            <img src="/imagens/login-avatar.webp"
                                            class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                                            width="200px" alt="profile">
                                        </div>
                                        <form class="p-3" action="/login" method="post">
                                            <div class="mb-3 form-group">
                                                <label for="usuario">Usuário</label>
                                                <input type="text" class="form-control" id="usuario" name="usuario" value="${usuario}"   placeholder="Informe o Usuário">
                                            </div>
                                            <div class="mb-3 form-group">
                                                <label for="senha">Senha</label>
                                                <input type="password" class="form-control" id="senha" name="senha" placeholder="Senha">
                                                <small class="form-text text-muted">Nós nunca compartilhos os seus dados com
                                                ninguém.</small>
                                            </div>
                                            <button type="submit" class="w-100 btn btn-primary mt-4">Entrar</button>
                                            <div class="mt-3 alert alert-danger">Usuário ou senha incorretos!</div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
    
            </html>
        `;
        resposta.send(conteudo);
        resposta.end();
    }
});

// compartilhando conteúdo privado mediante autenticação
app.use(verificarAutenticacao, express.static("privado"));
// daqui para baixo, os endpoints só serão acessados mediante autenticação.

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy(); // exclui a sessão de um usuário (aquele que escolheu acessar o endereço)
    resposta.redirect("/login.html"); // lembre-se que esse recurso é público
    resposta.end();
});

app.listen(porta, host, () => {
    console.log(`Servidor em execução em http://${host}:${porta}`);
});
