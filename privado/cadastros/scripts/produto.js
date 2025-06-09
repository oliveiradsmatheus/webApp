const urlProdutos = "http://localhost:4000/produtos"; 

const formularioProduto = document.getElementById("formCadProdutos"); 
const btnCadProd = document.getElementById("btnCadProd");
const btnLimparProd = document.getElementById("btnLimparProd");

let listaDeProdutos = []; 

let idProduto = 1; 
let idAltProduto;
let modoEdicaoProduto= false;

formularioProduto.onsubmit = manipularSubmissaoProduto;
btnLimparProd.onclick = limparFormProduto;

function limparFormProduto() {
    modoEdicaoProduto = false;
    formularioProduto.reset();
    btnCadProd.innerText = "Cadastrar";
}

function manipularSubmissaoProduto(evento) {
    if (formularioProduto.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const descricao = document.getElementById("descricao").value;
        const quantidade = document.getElementById("quantidade").value;
        const preco = document.getElementById("preco").value;
        const imagem = document.getElementById("imagem").value;
        const dataFabicacao = document.getElementById("dataFabricacao").value;
        const dataValidade = document.getElementById("dataValidade").value;
        const produtos = {id: idCategoria.toString(), nome,descricao,quantidade,preco,imagem,dataFabicacao,dataValidade};
        
        if (modoEdicaoProduto) {
            produtos.id = idAltProduto.toString();
            alterarProduto(produtos);
        } else {
            gravarProduto(produtos);
        }
        formularioProduto.reset();
    } else {
        formularioProduto.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function alterarFormProduto(id) {
    const produtoAlt = listaDeProdutos.find(produtos => produtos.id === id);

    if (produtoAlt) {
        document.getElementById("idProduto").value = produtoAlt.id;
        document.getElementById("nomeProduto").value = produtoAlt.nome;
        document.getElementById("descricaoProduto").value = produtoAlt.descricao;
        document.getElementById("quantidadeProduto").value = produtoAlt.quantidade;
        document.getElementById("precoProduto").value = produtoAlt.preco;
        document.getElementById("fabricanteProduto").value = produtoAlt.fabricante;
        document.getElementById("dataFabricacaoProduto").value = produtoAlt.dataFabicacao;
        document.getElementById("dataValidadeProduto").value = produtoAlt.dataValidade;
        
        modoEdicaoProduto = true;
        btnCadProd.innerText = "Alterar";
        idAltProduto = id;
    }
}

function atualizarTabelaProdutos() {
    const divTabela = document.getElementById("tabelaProdutos");
    divTabela.innerHTML = ""; // Limpa o conteúdo atual da tabela

    if (listaDeCategorias.length === 0) {
        divTabela.innerHTML = '<p class="m-2 text-center alert alert-info" role="alert">Não há produtos cadastradas</p>';
    } else {
        const titulo = document.createElement("p");
        titulo.innerHTML = '<h2 class="mt-3 text-center alert alert-secondary">Tabela de Produtos</h2>';
        divTabela.appendChild(titulo);
        
        const tabela = document.createElement("table");
        tabela.className = "table table-striped table-hover border mt-3";
        const cabecalho = document.createElement("thead");
        const corpo = document.createElement("tbody");
        corpo.id = "corpoProdutos";
        
        cabecalho.innerHTML = `
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Descricao</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Preco</th>
                <th scope="col">Fabricante</th>
                <th scope="col">DataFabricacao</th>
                <th scope="col">DataValidade</th>
                <th scope="col">Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);

        for (let produto of listaDeProdutos) {
            const linha = document.createElement('tr');
            linha.id = categoria.id;
            linha.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.descricao}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.preco}</td>
                <td>${produto.fabricante}</td>
                <td>${produto.dataFabicacao}</td>
                <td>${produto.dataValidade}</td>
                <td>
                    <button type="button" class="btn btn-warning" onclick="alterarFormProduto('${produto.id}')"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-danger" onclick="excluirProduto('${produto.id}')"><i class="bi bi-trash"></i></button>
                </td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function carregarProdutos() {
    const params = {
        method: "GET"
    };

    fetch(urlProdutos, params)
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((produtos) => {
            listaDeProdutos = produtos;
            if (listaDeProdutos.length > 0) {
                idProduto = parseInt(listaDeProdutos[listaDeProdutos.length - 1].id) + 1;
            }
            atualizarTabelaProdutos();
        })
        .catch((erro) => {
            alert("Erro ao tentar recuperar produtos: " + erro);
        });
}

function gravarProduto(produto) {
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    };

    fetch(urlProdutos, params)
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((resultado) => {
            alert(`Produto gravado com sucesso! ID: ${resultado.id}`);
            listaDeProdutos.push(produto);
            idProduto++;
            atualizarTabelaProdutos();
        })
        .catch((erro) => {
            alert("Erro ao tentar gravar produto! " + erro);
        });
}

function alterarProduto(produto) {
    const params = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    };

    fetch(`${urlProdutos}/${produto.id}`, params)
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((resultado) => {
            alert(`Produto alterado com sucesso! ID: ${produto.id}`);
            
            const index = listaDeProdutos.findIndex(prod => prod.id === produto.id);
            if (index !== -1) {
                listaDeProdutos[index] = produto;
            }

            modoEdicaoProduto = false;
            btnCadProd.innerText = "Cadastrar";
            atualizarTabelaProdutos();
        })
        .catch((erro) => {
            alert("Erro ao atualizar produto!" + erro);
        });
}

function excluirProduto(id) {
    if (confirm(`Deseja realmente excluir o produto ${id}?`)) {
        const params = {
            method: "DELETE"
        };

        fetch(`${urlProdutos}/${id}`, params)
            .then((resposta) => {
                if (resposta.ok) {
                    return resposta.json();
                }
            })
            .then((resultado) => {
                alert(`Produto removido com sucesso! ID: ${id}`);
                listaDeProdutos = listaDeProdutos.filter((produto) => {
                    return produto.id !== id;
                });
                atualizarTabelaProdutos();
            })
            .catch((erro) => {
                alert("Erro ao excluir produto! " + erro);
            });
    }
}

carregarProdutos();