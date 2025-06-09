function carregarProdutos() {
    const url = "http://localhost:4000/produtos";
    const params = {
        method: "GET"
    }

    fetch(url, params)
        .then((resposta) => {
            if(resposta.ok)
                return resposta.json();
        })
        .then((produtos) => {
            const vitrine = document.getElementById("vitrine");
            for (let produto of produtos) {
                const card = document.createElement("div");
                card.innerHTML = `
                    <div class="card m-2 shadow custom-card">
                        <div class="image-container">
                            <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${produto.nome}</h5>
                            <p class="card-text price-text">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                            <a href="#" class="btn btn-primary mt-auto">Veja mais detalhes!</a>
                        </div>
                    </div>
                `
                vitrine.appendChild(card);
            }
        })
        .catch((erro) => {
            alert("Erro ao carregar produtos! " + erro);
        });
}

carregarProdutos();