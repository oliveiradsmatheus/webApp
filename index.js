// npm init e posteriormente adicionar "type": "module" em package.json e o script "start" : "index.js"
// npm install express

// Para lidar com permissões na hora da instalação de pacotes npm no windows, executar o comando: set-ExecutionPolicy unrestricted no PowerShell e selecione [A]
// Iniciando o JSON-Server: json-server -p 4000 ./db/dados.js

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
    if (1 || usuario === "admin" && senha === "admin") {
        requisicao.session.autenticado = true;
        resposta.redirect("/menu.html");
    } else {
        let conteudo = `
            <!DOCTYPE html>
            <html lang="pt-br">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Login</title>
                <link rel="stylesheet" href="css/bootstrap.min.css">
                <link rel="stylesheet" href="css/login.css">
            </head>
            
            <body class="bg-body-secondary">
                <div class="container shadow border bg-body-tertiary rounded my-5 p-3 w-50">
                    <h1 class="text-center text-dark">Bem-vindo</h1>
                    <div class="text-center text-dark">Faça o login</div>
                    <div class="border card shadow my-3">
                        <div class="container my-5 px-5 w-100">
                            <form class="p-3" action="/login" method="post">
                                <div class="mb-3 form-group">
                                    <label for="usuario">Usuário</label>
                                    <input type="text" class="form-control" id="usuario" name="usuario" value="${usuario}"
                                           placeholder="Informe o Usuário">
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
