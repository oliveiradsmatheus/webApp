const url = "http://localhost:4000/fornecedores";

const formulario = document.getElementById("formCadFornecedor");
const botaoCadastro = document.getElementById("botaoCadastro");
const botaoLimpar = document.getElementById("botaoLimpar");

let listaDeFornecedores = [];

let id = 1;
let idAlt;
let modoEdicao = false;

formulario.onsubmit = manipularSubmissao;
botaoLimpar.onclick = limparForm;

function limparForm() {
    modoEdicao = false;
    formulario.reset();
    document.getElementById("cnpj").disabled = false;
    botaoCadastro.innerHTML = "Cadastrar";
}

function manipularSubmissao(evento) {
    if (formulario.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const cnpj = document.getElementById("cnpj").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = document.getElementById("cep").value;
        const fornecedor = {id: id.toString(), nome, cnpj, telefone, cidade, uf, cep};
        if (modoEdicao) {
            fornecedor.id = idAlt.toString();
            alterarFornecedor(fornecedor);
        } else
            gravarFornecedor(fornecedor);
        formulario.reset();
    } else
        formulario.classList.add("was-validated");
    evento.preventDefault();
    evento.stopPropagation();
}

function mostrarTabelaFornecedores() {
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML = "";

    if (listaDeFornecedores.length === 0)
        divTabela.innerHTML = '<p class="m-2 text-center alert alert-info" role="alert">Não há fornecedores cadastrados</p>';
    else {
        const titulo = document.createElement("p");
        titulo.innerHTML = '<h2 class="mt-3 text-center alert alert-secondary">Tabela de Fornecedores</h2>';
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
                <th scope="col">CNPJ</th>
                <th scope="col">Telefone</th>
                <th scope="col">Cidade</th>
                <th scope="col">UF</th>
                <th scope="col">CEP</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let fornecedor of listaDeFornecedores) {
            const linha = adicionarLinha(fornecedor);
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function adicionarLinha(fornecedor) {
    const linha = document.createElement('tr');
    linha.id = fornecedor.id;
    editarLinha(linha, fornecedor);
    return linha;
}

function editarLinha(linha, fornecedor) {
    linha.innerHTML = `
        <td>${fornecedor.id}</td>
        <td>${fornecedor.nome}</td>
        <td>${fornecedor.cnpj}</td>
        <td>${fornecedor.telefone}</td>
        <td>${fornecedor.cidade}</td>
        <td>${fornecedor.uf}</td>
        <td>${fornecedor.cep}</td>
        <td>
            <button type="button" class="btn btn-warning" onclick="alterarForm('${fornecedor.id}')"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-danger" onclick="excluirFornecedor('${fornecedor.id}')"><i class="bi bi-trash"></i></button>
        </td>
    `;
}

function alterarForm(id) {
    listaDeFornecedores.map((fornecedor) => {
        if (fornecedor.id === id) {
            document.getElementById("id").value = fornecedor.id;
            document.getElementById("nome").value = fornecedor.nome;
            document.getElementById("cnpj").value = fornecedor.cnpj;
            document.getElementById("cnpj").disabled = true;
            document.getElementById("telefone").value = fornecedor.telefone;
            document.getElementById("cidade").value = fornecedor.cidade;
            document.getElementById("uf").value = fornecedor.uf;
            document.getElementById("cep").value = fornecedor.cep;
            modoEdicao = true;
            botaoCadastro.innerHTML = "Alterar";
            idAlt = id;
        }
    })
}

function carregarFornecedores() {
    const params = {
        method: "GET"
    };

    fetch(url, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((fornecedores) => {
            listaDeFornecedores = fornecedores;
            if (listaDeFornecedores.length > 0)
                id = parseInt(listaDeFornecedores[listaDeFornecedores.length - 1].id) + 1;
            mostrarTabelaFornecedores();
        })
        .catch((erro) => {
            console.log(erro);
            alert("Erro ao carregar fornecedores! " + erro);
        })
}

function gravarFornecedor(fornecedor) {
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fornecedor)
    }

    fetch(url, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((resultado) => {
            alert(`Fornecedor gravado com sucesso! ID: ${resultado.id}`);
            listaDeFornecedores.push(fornecedor);
            id++;
            const corpo = document.getElementById("corpo");
            const linha = adicionarLinha(fornecedor);
            corpo.appendChild(linha);
        })
        .catch((erro) => {
            alert("Erro ao gravar fornecedor! " + erro);
        });
}

function alterarFornecedor(fornecedor) {
    const params = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fornecedor)
    };

    fetch(`${url}/${fornecedor.id}`, params)
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((resultado) => {
            alert(`Fornecedor alterado com sucesso! ID: ${fornecedor.id}`);
            listaDeFornecedores = listaDeFornecedores.map((forn) => {
                return forn.id === fornecedor.id ? fornecedor : forn;
            });
            modoEdicao = false;
            botaoCadastro.innerText = "Cadastrar";
            document.getElementById("cnpj").disabled = false;
            editarLinha(document.getElementById(fornecedor.id), fornecedor);
        })
        .catch((erro) => {
            alert("Erro ao atualizar fornecedor! " + erro);
        });
}

function excluirFornecedor(id) {
    if (confirm(`Deseja realmente excluir o fornecedor ${id}?`)) {
        const params = {
            method: "DELETE"
        }

        fetch(`${url}/${id}`, params)
            .then((resposta) => {
                if (resposta.ok)
                    return resposta.json();
            })
            .then((resultado) => {
                alert(`Fornecedor removido com sucesso! ID: ${id}`);
                listaDeFornecedores = listaDeFornecedores.filter((fornecedor) => {
                    return fornecedor.id !== id;
                });
                document.getElementById(id).remove();
            })
            .catch((erro) => {
                alert("Erro ao excluir fornecedor! " + erro);
            });
    }
}

carregarFornecedores();