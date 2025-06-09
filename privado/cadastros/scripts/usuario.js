const urlUsuario= "http://localhost:4000/usuario"; 

const formularioUsuario = document.getElementById("formCadUsuario"); 
const btnCadUsr = document.getElementById("btnCadUsr");
const btnLimparUsr = document.getElementById("btnLimparUsr");

let listaDeUsuarios = []; 

let idUsuario = 1; 
let idAltUsuario;
let modoEdicaoUsuario = false;

formularioUsuario.onsubmit = manipularSubmissaoUsuario;
btnLimparUsr.onclick = limparFormUsuario;

function limparFormUsuario() {
    modoEdicaoUsuario = false;
    formularioUsuario.reset();
    btnCadUsr.innerText = "Cadastrar";
}

function manipularSubmissaoUsuario(evento) {
    if (formularioUsuario.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const usuarios = {id: idUsuario.toString(), nome,email,senha};
        
        if (modoEdicaoUsuario) {
            usuarios.id = idAltUsuario.toString();
            alterarUsuaario(usuarios);
        } else {
            gravarUsuario(usuarios);
        }
        formularioUsuario.reset();
    } else {
        formularioUsuario.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function alterarFormUsuario(id) {
    const usuarioAlt = listaDeUsuarios.find(usuarios => usuarios.id === id);

    if (usuarioAlt) {
        document.getElementById("idUsuario").value = usuarioAlt.id;
        document.getElementById("nomeUsuario").value = usuarioAlt.nome;
        document.getElementById("emailUsuario").value = usuarioAlt.email;
        document.getElementById("senhaUsuario").value = usuarioAlt.senha;
        
        modoEdicaoUsuario = true;
        btnCadUsr.innerText = "Alterar";
        idAltUsuario = id;
    }
}

function atualizarTabelaUsuarios() {
    const divTabela = document.getElementById("tabelaUsuario");
    divTabela.innerHTML = ""; 

    if (listaDeUsuarios.length === 0) {
        divTabela.innerHTML = '<p class="m-2 text-center alert alert-info" role="alert">Não há usuario cadastradas</p>';
    } else {
        const titulo = document.createElement("p");
        titulo.innerHTML = '<h2 class="mt-3 text-center alert alert-secondary">Tabela de Usuario</h2>';
        divTabela.appendChild(titulo);
        
        const tabela = document.createElement("table");
        tabela.className = "table table-striped table-hover border mt-3";
        const cabecalho = document.createElement("thead");
        const corpo = document.createElement("tbody");
        corpo.id = "corpoUsuario";
        
        cabecalho.innerHTML = `
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">E-mail</th>
                <th scope="col">Senha</th>
                <th scope="col">Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);

        for (let usuario of listaDeUsuarios) {
            const linha = document.createElement('tr');
            linha.id = usuario.id;
            linha.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.senha}</td>
                <td>
                    <button type="button" class="btn btn-warning" onclick="alterarFormUsuario('${usuario.id}')"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-danger" onclick="excluirUsuario('${usuario.id}')"><i class="bi bi-trash"></i></button>
                </td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function carregarUsuario() {
    const params = {
        method: "GET"
    };

    fetch(urlUsuario, params)
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((usuarios) => {
            listaDeUsuarios = usuarios;
            if (listaDeUsuarios.length > 0) {
                // Define o próximo ID como o ID do último usuário + 1 (assumindo que a lista está ordenada)
                idUsuario = parseInt(listaDeUsuarios[listaDeUsuarios.length - 1].id) + 1;
            }
            atualizarTabelaUsuarios();
        })
        .catch((erro) => {
            alert("Erro ao tentar recuperar usuarios: " + erro);
        });
}

function gravarUsuario(usuario) {
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    };

    fetch(urlUsuario, params)
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((resultado) => {
            alert(`Usuario gravado com sucesso! ID: ${resultado.id}`);
            listaDeUsuarios.push(usuario);
            idUsuario++;
            atualizarTabelaUsuarios();
        })
        .catch((erro) => {
            alert("Erro ao tentar gravar usuario! " + erro);
        });
}

function alterarUsuaario(usuario) {
    const params = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    };

    fetch(`${urlUsuario}/${usuario.id}`, params)
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((resultado) => {
            alert(`Usuario alterado com sucesso! ID: ${usuario.id}`);
            
            const index = listaDeUsuarios.findIndex(usr => usr.id === usuario.id);
            if (index !== -1) {
                listaDeUsuarios[index] = usuario;
            }

            modoEdicaoUsuario = false;
            btnCadUsr.innerText = "Cadastrar";
            atualizarTabelaUsuarios();
        })
        .catch((erro) => {
            alert("Erro ao atualizar usuario!" + erro);
        });
}

function excluirUsuario(id) {
    if (confirm(`Deseja realmente excluir o usuario ${id}?`)) {
        const params = {
            method: "DELETE"
        };

        fetch(`${urlUsuario}/${id}`, params)
            .then((resposta) => {
                if (resposta.ok) {
                    return resposta.json();
                }
            })
            .then((resultado) => {
                alert(`Usuario removido com sucesso! ID: ${id}`);
                listaDeUsuarios = listaDeUsuarios.filter((usuario) => {
                    return usuario.id !== id;
                });
                atualizarTabelaUsuarios();
            })
            .catch((erro) => {
                alert("Erro ao excluir usuario! " + erro);
            });
    }
}

carregarUsuario();