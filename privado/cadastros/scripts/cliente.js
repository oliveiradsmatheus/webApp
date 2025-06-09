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
    document.getElementById("cpf").disabled = false;
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
        corpo.id = "corpo";
        cabecalho.innerHTML = `
            <tr>
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
        for (let cliente of listaDeClientes) {
            const linha = adicionarLinha(cliente);
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function adicionarLinha(cliente) {
    const linha = document.createElement('tr');
    linha.id = cliente.id;
    editarLinha(linha, cliente);
    return linha;
}

function editarLinha(linha, cliente) {
    linha.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nome}</td>
        <td>${cliente.cpf}</td>
        <td>${cliente.telefone}</td>
        <td>${cliente.cidade}</td>
        <td>${cliente.uf}</td>
        <td>${cliente.cep}</td>
        <td>
            <button type="button" class="btn btn-warning" onclick="alterarForm('${cliente.id}')"><i class="bi bi-pencil-square"></i></i></button>
            <button type="button" class="btn btn-danger" onclick="excluirCliente('${cliente.id}')"><i class="bi bi-trash"></i></i></button>
        </td>
    `
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
            alert("Erro ao tentar recuperar clientes: " + erro);
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
            alert(`Cliente gravado com sucesso! ID: ${resultado.id}`);
            listaDeClientes.push(cliente);
            id++;
            const corpo = document.getElementById("corpo");
            const linha = adicionarLinha(cliente);
            corpo.appendChild(linha);
        })
        .catch((erro) => {
            alert("Erro ao tentar gravar cliente! " + erro);
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

    fetch(`${url}/${cliente.id}`, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((resultado) => {
            alert(`Cliente alterado com sucesso! ID: ${cliente.id}`);
            listaDeClientes = listaDeClientes.map((cli) => {
                return cli.id === cliente.id ? cliente : cli;
            });
            modoEdicao = false;
            botaoCadastro.innerText = "Cadastrar";
            document.getElementById("cpf").disabled = false;
            editarLinha(document.getElementById(cliente.id), cliente);
        })
        .catch((erro) => {
            alert("Erro ao atualizar cliente!" + erro);
        });
}

function excluirCliente(id) {
    if (confirm(`Deseja realmente excluir o cliente ${id}?`)) {
        const params = {
            method: "DELETE"
        }

        fetch(`${url}/${id}`, params)
            .then((resposta) => {
                if (resposta.ok)
                    return resposta.json();
            })
            .then((resultado) => {
                alert(`Cliente removido com sucesso! ID: ${id}`);
                listaDeClientes = listaDeClientes.filter((cliente) => {
                    return cliente.id !== id;
                });
                document.getElementById(id)?.remove();
            })
            .catch((erro) => {
                alert("Erro ao excluir cliente! " + erro);
            });
    }
}

carregarClientes();