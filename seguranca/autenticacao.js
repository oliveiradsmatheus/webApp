export default function verificarAutenticacao(requisicao, resposta, next) {
    if (requisicao.session.autenticado)
        next();
    else
        next();
        //resposta.redirect("/login.html");
}