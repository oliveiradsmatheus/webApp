const formulario = document.getElementById("formCadCliente");
let listaDeClientes = [];

if (localStorage.getItem("clientes"))
    listaDeClientes = JSON.parse(localStorage.getItem("clientes")); // Recuperando do armazenamento local

formulario.onsubmit = manipularSubmissao;

function manipularSubmissao(evento) {
    if (formulario.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = document.getElementById("cep").value;
        const cliente = {nome, cpf, telefone, cidade, uf, cep};
        listaDeClientes.push(cliente);
        localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
        formulario.reset();
        mostrarTabelaClientes();
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
            linha.id = listaDeClientes[i].cpf;
            linha.innerHTML = `
                <th scope="row">${i + 1}</th>
                <td>${listaDeClientes[i].nome}</td>
                <td>${listaDeClientes[i].cpf}</td>
                <td>${listaDeClientes[i].telefone}</td>
                <td>${listaDeClientes[i].cidade}</td>
                <td>${listaDeClientes[i].uf}</td>
                <td>${listaDeClientes[i].cep}</td>
                <td>
                    <button type="button" class="btn btn-danger" onclick="excluirCliente('${listaDeClientes[i].cpf}')"><i class="bi bi-recycle"></i></i></button>
                    <button type="button" class="btn btn-warning" onclick="alterarCliente('${listaDeClientes[i].cpf}')"><i class="bi bi-pencil-square"></i></i></button>
                </td>
            `
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirCliente(cpf) {
    if (confirm("Deseja realmente excluir o cliente " + cpf + "?")) {
        listaDeClientes = listaDeClientes.filter((cliente) => {
            return cliente.cpf !== cpf;
        });
        document.getElementById(cpf).remove();
    }
    localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
}

function alterarCliente(cpf) {

}

mostrarTabelaClientes();