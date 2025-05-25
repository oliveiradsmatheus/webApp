const url = "http://localhost:4000/clientes";

const formulario = document.getElementById("formCadCliente");
const botaoCadastro = document.getElementById("botaoCadastro");
const botaoLimpar = document.getElementById("botaoLimpar");

let listaDeClientes = [];

let id = 1;
let idAlt;
let modoEdicao = false;

formulario.onsubmit = manipularSubmissao;
botaoLimpar.onclick = limparForm;

function limparForm() {
    modoEdicao = false;
    formulario.reset();
    botaoCadastro.innerText = "Cadastrar";
}

function manipularSubmissao(evento) {
    if (formulario.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = document.getElementById("cep").value;
        const cliente = {id: id.toString(), nome, cpf, telefone, cidade, uf, cep};
        if (modoEdicao) {
            cliente.id = idAlt.toString(); // Salvando o id como string para evitar problemas durante as verificações
            alterarCliente(cliente);
        } else
            gravarCliente(cliente);
        formulario.reset();
    } else
        formulario.classList.add('was-validated');
    evento.preventDefault(); // Cancelamento do evento
    evento.stopPropagation(); // Impedindo que outros observem esse evento
}

function mostrarTabelaClientes() {
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML = "";

    if (listaDeClientes.length === 0)
        divTabela.innerHTML = '<p class="m-2 text-center alert alert-info" role="alert">Não há clientes cadastrados</p>';
    else {
        const titulo = document.createElement("p");
        titulo.innerHTML = '<h2 class="mt-3 text-center alert alert-secondary">Tabela de Clientes</h2>';
        divTabela.appendChild(titulo);
        const tabela = document.createElement("table");
        tabela.className = "table table-striped table-hover border mt-3";
        const cabecalho = document.createElement("thead");
        const corpo = document.createElement("tbody");
        cabecalho.innerHTML = `
            <tr>
                <th scope="col">#</th>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">CPF</th>
                <th scope="col">Telefone</th>
                <th scope="col">Cidade</th>
                <th scope="col">UF</th>
                <th scope="col">CEP</th>
                <th scope="col">Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i = 0; i < listaDeClientes.length; i++) {
            const linha = document.createElement('tr');
            linha.id = listaDeClientes[i].id;
            linha.innerHTML = `
                <th scope="row">${i + 1}</th>
                <td>${listaDeClientes[i].id}</td>
                <td>${listaDeClientes[i].nome}</td>
                <td>${listaDeClientes[i].cpf}</td>
                <td>${listaDeClientes[i].telefone}</td>
                <td>${listaDeClientes[i].cidade}</td>
                <td>${listaDeClientes[i].uf}</td>
                <td>${listaDeClientes[i].cep}</td>
                <td>
                    <button type="button" class="btn btn-warning" onclick="alterarForm('${listaDeClientes[i].id}')"><i class="bi bi-pencil-square"></i></i></button>
                    <button type="button" class="btn btn-danger" onclick="excluirCliente('${listaDeClientes[i].id}')"><i class="bi bi-trash"></i></i></button>
                </td>
            `
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function alterarForm(id) {
    listaDeClientes.map((cliente) => {
        if (cliente.id === id) {
            document.getElementById("id").value = cliente.id;
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("cpf").value = cliente.cpf;
            document.getElementById("cpf").disabled = true;
            document.getElementById("telefone").value = cliente.telefone;
            document.getElementById("cidade").value = cliente.cidade;
            document.getElementById("uf").value = cliente.uf;
            document.getElementById("cep").value = cliente.cep;
            modoEdicao = true;
            botaoCadastro.innerText = "Alterar";
            idAlt = id;
        }
    });
}

function carregarClientes() {
    const params = {
        method: "GET"
    };

    fetch(url, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((clientes) => {
            listaDeClientes = clientes;
            if (listaDeClientes.length > 0)
                id = parseInt(listaDeClientes[listaDeClientes.length - 1].id) + 1;
            mostrarTabelaClientes();
        })
        .catch((erro) => {
            alert("Erro ao tentar recuperar clientes!")
        });
}

function gravarCliente(cliente) {
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    }

    fetch(url, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((resultado) => {
            console.log(resultado)
            listaDeClientes.push(cliente);
            id++;
            mostrarTabelaClientes();
        })
        .catch((erro) => {
            alert("Erro ao tentar gravar cliente!")
        });
}

function alterarCliente(cliente) {
    const params = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    }
    fetch(url + "/" + cliente.id, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((resultado) => {
            console.log(resultado);
            listaDeClientes = listaDeClientes.map((cli) => {
                return cli.id === cliente.id ? cliente : cli;
            });
            modoEdicao = false;
            botaoCadastro.innerText = "Cadastrar";
            document.getElementById("cpf").disabled = false;
            mostrarTabelaClientes();
        })
        .catch((erro) => {
            alert("Erro ao atualizar cliente!" + erro);
        });
}

function excluirCliente(id) {
    if (confirm("Deseja realmente excluir o cliente " + id + "?")) {
        const params = {
            method: "DELETE"
        }

        fetch(url + "/" + id, params)
            .then((resposta) => {
                if (resposta.ok)
                    return resposta.json();
            })
            .then((resultado) => {
                console.log(resultado);
                listaDeClientes = listaDeClientes.filter((cliente) => {
                    return cliente.id !== id;
                });
                document.getElementById(id).remove();
                mostrarTabelaClientes();
            })
            .catch((erro) => {
                alert("Erro ao excluir cliente!");
            });
    }
}

carregarClientes();