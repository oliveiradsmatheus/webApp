const urlCategorias = "http://localhost:4000/categorias"; 

const formularioCategoria = document.getElementById("formCadCategoria"); 
const botaoCadastroCategoria = document.getElementById("botaoCadastroCategoria");
const botaoLimparCategoria = document.getElementById("botaoLimparCategoria");

let listaDeCategorias = []; 

let idCategoria = 1; 
let idAltCategoria;
let modoEdicaoCategoria = false;

formularioCategoria.onsubmit = manipularSubmissaoCategoria;
botaoLimparCategoria.onclick = limparFormCategoria;

function limparFormCategoria() {
    modoEdicaoCategoria = false;
    formularioCategoria.reset();
    botaoCadastroCategoria.innerText = "Cadastrar";
}

function manipularSubmissaoCategoria(evento) {
    if (formularioCategoria.checkValidity()) {
        const nome = document.getElementById("nome").value;
        
        const categoria = {id: idCategoria.toString(), nome};
        
        if (modoEdicaoCategoria) {
            categoria.id = idAltCategoria.toString();
            alterarCategoria(categoria);
        } else {
            gravarCategoria(categoria);
        }
        formularioCategoria.reset();
    } else {
        formularioCategoria.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function alterarFormCategoria(id) {
    const categoriaParaAlterar = listaDeCategorias.find(categoria => categoria.id === id);

    if (categoriaParaAlterar) {
        document.getElementById("id").value = categoriaParaAlterar.id;
        document.getElementById("nome").value = categoriaParaAlterar.nome;
        
        modoEdicaoCategoria = true;
        botaoCadastroCategoria.innerText = "Alterar";
        idAltCategoria = id;
    }
}

function atualizarTabelaCategorias() {
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML = ""; // Limpa o conteúdo atual da tabela

    if (listaDeCategorias.length === 0) {
        divTabela.innerHTML = '<p class="m-2 text-center alert alert-info" role="alert">Não há categorias cadastradas</p>';
    } else {
        const titulo = document.createElement("p");
        titulo.innerHTML = '<h2 class="mt-3 text-center alert alert-secondary">Tabela de Categorias</h2>';
        divTabela.appendChild(titulo);
        
        const tabela = document.createElement("table");
        tabela.className = "table table-striped table-hover border mt-3";
        const cabecalho = document.createElement("thead");
        const corpo = document.createElement("tbody");
        corpo.id = "corpoCategorias";
        
        cabecalho.innerHTML = `
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);

        // Preenche o corpo da tabela com as categorias da lista
        for (let categoria of listaDeCategorias) {
            const linha = document.createElement('tr');
            linha.id = categoria.id;
            linha.innerHTML = `
                <td>${categoria.id}</td>
                <td>${categoria.nome}</td>
                <td>
                    <button type="button" class="btn btn-warning" onclick="alterarFormCategoria('${categoria.id}')"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-danger" onclick="excluirCategoria('${categoria.id}')"><i class="bi bi-trash"></i></button>
                </td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function carregarCategorias() {
    const params = {
        method: "GET"
    };

    fetch(urlCategorias, params)
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((categorias) => {
            listaDeCategorias = categorias;
            if (listaDeCategorias.length > 0) {
                idCategoria = parseInt(listaDeCategorias[listaDeCategorias.length - 1].id) + 1;
            }
            atualizarTabelaCategorias();
        })
        .catch((erro) => {
            alert("Erro ao tentar recuperar categorias: " + erro);
        });
}

function gravarCategoria(categoria) {
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(categoria)
    };

    fetch(urlCategorias, params)
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((resultado) => {
            alert(`Categoria gravada com sucesso! ID: ${resultado.id}`);
            listaDeCategorias.push(categoria);
            idCategoria++;
            atualizarTabelaCategorias();
        })
        .catch((erro) => {
            alert("Erro ao tentar gravar categoria! " + erro);
        });
}

function alterarCategoria(categoria) {
    const params = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(categoria)
    };

    fetch(`${urlCategorias}/${categoria.id}`, params)
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((resultado) => {
            alert(`Categoria alterada com sucesso! ID: ${categoria.id}`);
            
            const index = listaDeCategorias.findIndex(cat => cat.id === categoria.id);
            if (index !== -1) {
                listaDeCategorias[index] = categoria;
            }

            modoEdicaoCategoria = false;
            botaoCadastroCategoria.innerText = "Cadastrar";
            atualizarTabelaCategorias();
        })
        .catch((erro) => {
            alert("Erro ao atualizar categoria!" + erro);
        });
}

function excluirCategoria(id) {
    if (confirm(`Deseja realmente excluir a categoria ${id}?`)) {
        const params = {
            method: "DELETE"
        };

        fetch(`${urlCategorias}/${id}`, params)
            .then((resposta) => {
                if (resposta.ok) {
                    return resposta.json();
                }
            })
            .then((resultado) => {
                alert(`Categoria removida com sucesso! ID: ${id}`);
                listaDeCategorias = listaDeCategorias.filter((categoria) => {
                    return categoria.id !== id;
                });
                atualizarTabelaCategorias();
            })
            .catch((erro) => {
                alert("Erro ao excluir categoria! " + erro);
            });
    }
}

carregarCategorias();