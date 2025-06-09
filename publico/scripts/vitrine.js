function carregarProdutos() {
    const url = "https://fakestoreapi.com/products";
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
                    <div class="card m-2 shadow" style="width: 18rem;">
                        <img width="200px" height="300px" src="${produto.image}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${produto.title}</h5>
                            <p class="card-text">R$ ${produto.price}</p>
                            <a href="#" class="btn btn-primary">Veja mais detalhes!</a>
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