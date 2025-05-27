const url = "http://localhost:4000/entregadores"

const formulario = document.getElementById("formCadEntregador");
const botaoCadastro = document.getElementById("botaoCadastro");
const botaoLimpar = document.getElementById("botaoLimpar");

let listaDeEntregadores = [];

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
        const cnh = document.getElementById("cnh").value;
        const telefone = document.getElementById("telefone").value;
        const veiculo = document.getElementById("veiculo").value;
        const ano = document.getElementById("ano").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = document.getElementById("cep").value;
        const entregador = {id: id.toString(), nome, cpf, cnh, telefone, veiculo, ano, cidade, uf, cep};
        if (modoEdicao) {
            entregador.id = idAlt.toString();
            alterarEntregador(entregador);
        } else
            gravarEntregador(entregador)
        formulario.reset();
    } else
        formulario.classList.add("was-validated");
    evento.preventDefault();
    evento.stopPropagation();
}

function mostrarTabelaEntregadores() {
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML = "";

    if (listaDeEntregadores.length === 0)
        divTabela.innerHTML = '<p class="m-2 text-center alert alert-info" role="alert">Não há entregadores cadastrados</p>';
    else {
        const titulo = document.createElement("p");
        titulo.innerHTML = '<h2 class="mt-3 text-center alert alert-secondary">Tabela de Entregadores</h2>';
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
                <th scope="col">CNH</th>
                <th scope="col">Telefone</th>
                <th scope="col">Veículo</th>
                <th scope="col">Ano</th>
                <th scope="col">Cidade</th>
                <th scope="col">UF</th>
                <th scope="col">CEP</th>
                <th scope="col">Ações</th>
            </tr>
        `
        tabela.appendChild(cabecalho);
        for (let entregador of listaDeEntregadores) {
            const linha = adicionarLinha(entregador);
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }

}

function adicionarLinha(entregador) {
    const linha = document.createElement('tr');
    linha.id = entregador.id;
    linha.innerHTML = `
        <td>${entregador.id}</td>
        <td>${entregador.nome}</td>
        <td>${entregador.cpf}</td>
        <td>${entregador.cnh}</td>
        <td>${entregador.telefone}</td>
        <td>${entregador.veiculo}</td>
        <td>${entregador.ano}</td>
        <td>${entregador.cidade}</td>
        <td>${entregador.uf}</td>
        <td>${entregador.cep}</td>
        <td>
            <button type="button" class="btn btn-warning" onclick="alterarForm('${entregador.id}')"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-danger" onclick="excluirEntregador('${entregador.id}')"><i class="bi bi-trash"></i></button>
        </td>
    `;
    return linha;
}

function alterarLinha(linha, entregador) {
    linha.innerHTML = `
        <td>${entregador.id}</td>
        <td>${entregador.nome}</td>
        <td>${entregador.cpf}</td>
        <td>${entregador.cnh}</td>
        <td>${entregador.telefone}</td>
        <td>${entregador.veiculo}</td>
        <td>${entregador.ano}</td>
        <td>${entregador.cidade}</td>
        <td>${entregador.uf}</td>
        <td>${entregador.cep}</td>
        <td>
            <button type="button" class="btn btn-warning" onclick="alterarForm('${entregador.id}')"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-danger" onclick="excluirEntregador('${entregador.id}')"><i class="bi bi-trash"></i></button>
        </td>
    `;
}

function alterarForm(id) {
    listaDeEntregadores.map((entregador) => {
        if (entregador.id === id) {
            document.getElementById("id").value = entregador.id;
            document.getElementById("nome").value = entregador.nome;
            document.getElementById("cpf").value = entregador.cpf;
            document.getElementById("cpf").disabled = true;
            document.getElementById("cnh").value = entregador.cnh;
            document.getElementById("telefone").value = entregador.telefone;
            document.getElementById("veiculo").value = entregador.veiculo;
            document.getElementById("ano").value = entregador.ano;
            document.getElementById("cidade").value = entregador.cidade;
            document.getElementById("uf").value = entregador.uf;
            document.getElementById("cep").value = entregador.cep;
            modoEdicao = true;
            botaoCadastro.innerHTML = "Alterar";
            idAlt = id;
        }
    });
}

function carregarEntregadores() {
    const params = {
        method: "GET"
    }

    fetch(url, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((entregadores) => {
            listaDeEntregadores = entregadores;
            if (listaDeEntregadores.length > 0)
                id = parseInt(listaDeEntregadores[listaDeEntregadores.length - 1].id) + 1;
            mostrarTabelaEntregadores();
        })
        .catch((erro) => {
            alert("Erro ao carregar entregadores: " + erro);
        });
}

function gravarEntregador(entregador) {
    params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(entregador)
    }

    fetch(url, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((resultado) => {
            alert(`Entregador gravado com sucesso! ID: ${resultado.id}`);
            listaDeEntregadores.push(entregador);
            id++;
            const corpo = document.getElementById("corpo");
            const linha = adicionarLinha(entregador);
            corpo.appendChild(linha);
        })
        .catch((erro) => {
            alert("Erro ao gravar entregador: " + erro);
        });
}

function alterarEntregador(entregador) {
    const params = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(entregador)
    }

    fetch(`${url}/${entregador.id}`, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((resultado) => {
            alert(`Entregador alterado com sucesso! ID: ${entregador.id}`);
            listaDeEntregadores = listaDeEntregadores.map((ent) => {
                return ent.id === entregador.id ? entregador : ent;
            });
            modoEdicao = false;
            botaoCadastro.innerText = "Cadastrar";
            document.getElementById("cpf").disabled = false;
            const linha = document.getElementById(entregador.id);
            alterarLinha(linha, entregador);
        })
        .catch((erro) => {
            alert("Erro ao atualizar entregador!" + erro);
        });
}

function excluirEntregador(id) {
    if (window.confirm(`Deseja realmente excluir o entregador ${id}?`)) {
        const params = {
            method: "DELETE"
        }

        fetch(`${url}/${id}`, params)
            .then((resposta) => {
                if (resposta.ok)
                    return resposta.json();
            })
            .then((resultado) => {
                alert(`Entregador removido com sucesso! ID: ${id}`);
                listaDeEntregadores = listaDeEntregadores.filter((entregador) => {
                    return entregador.id !== id;
                });
                document.getElementById(id).remove();
                mostrarTabelaEntregadores();
            })
            .catch((erro) => {
                alert("Erro ao excluir entregador: " + erro);
            });
    }
}

carregarEntregadores();