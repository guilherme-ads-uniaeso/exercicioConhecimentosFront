//Recupera a div que vai exibir o alerta
var divAlert = document.getElementById('divAlert');

//Cria o alerta dentro da div que exibe o alerta
function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div id="divAlertContent" class="alert alert-' + type + ' alert-dismissible" role="alert" id="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    divAlert.append(wrapper);
}

function removeAlert() {
    $("#divAlert").hide();
    $("#divAlert").fadeTo(2000, 500).slideUp(500, function () {
        $('#divAlertContent').remove();
        window.location.reload(true);
    });
}

function montarContato() {
    var nome = document.getElementById('nome').value;
    var sobrenome = document.getElementById('sobrenome').value;
    var data = document.getElementById('data').value;

    var pessoa = new Object();
    pessoa.nome = nome;
    pessoa.sobrenome = sobrenome;
    pessoa.data = data;

    return pessoa;
}

//Função chamada pela tag <form>
async function cadastrarPessoa(event) {
    //Garante que a tela não seja atualizada ao enviar uma requisição.
    event.preventDefault();

    let urlSave = 'http://localhost:8080/exercicioConhecimentos/pessoa/save';
    //let urlUpdate = 'http://localhost:8080/exercicioConhecimentos/pessoa/update';

    //Recupera os valores da tela.
    var pessoa = montarPessoa();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", urlSave, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        if (data.CONFLICT) {
            alert(data.CONFLICT, 'danger');
        }
        if (data.CREATED) {
            alert(data.CREATED, 'success');
        }
    }
    xhr.send(JSON.stringify(pessoa));

    removeAlert();
}