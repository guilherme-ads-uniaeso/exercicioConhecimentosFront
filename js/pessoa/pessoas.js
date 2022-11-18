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

function createRowDisciplinas(pessoa) {
    //Cria os componentes da tabela
    let tr = document.createElement("tr");
    let tdNome = document.createElement("td");
    let tdCodigo = document.createElement("td");
    let tdDataNascimento = document.createElement("td");
    let tdAcoes = document.createElement("td");
    let buttonEdit = document.createElement("button");
    let buttonDelete = document.createElement("button");
    let spanEdit = document.createElement("span");
    let spanDelete = document.createElement("span");

    //Adiciona os atributos de cada componente
    buttonEdit.setAttribute('type', 'button');
    buttonEdit.setAttribute('class', 'btn btn-warning bg-warning');
    buttonEdit.setAttribute('id', `${pessoa.idPessoa}`);
    buttonEdit.setAttribute('onClick', 'editPessoa(this.id)');
    buttonDelete.setAttribute('class', 'btn btn-danger bg-danger');
    buttonDelete.setAttribute('style', 'margin-left: 5px');
    buttonDelete.setAttribute('id', `${pessoa.idPessoa}`);
    buttonDelete.setAttribute('onClick', 'deletePessoa(this.id)');
    spanEdit.setAttribute('class', 'material-icons');
    spanDelete.setAttribute('class', 'material-icons');
    tdNome.setAttribute('class', 'col-3');
    tdCodigo.setAttribute('class', 'col-3');    
    tdDataNascimento.setAttribute('class', 'col-3');
    tdAcoes.setAttribute('class', 'col-3');

    //Seta os valores nos componentes
    tdNome.innerHTML = `${pessoa.nome}`;
    tdCodigo.innerHTML = `${pessoa.sobrenome}`;
    tdDataNascimento.innerHTML = `${pessoa.dataNascimento}`;
    spanEdit.innerHTML = 'brush';
    spanDelete.innerHTML = 'delete';

    //Associa os componentes filhos dentro dos componentes pai
    buttonEdit.appendChild(spanEdit);
    buttonDelete.appendChild(spanDelete);
    tdAcoes.appendChild(buttonEdit);
    tdAcoes.appendChild(buttonDelete);
    tr.appendChild(tdNome);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdDataNascimento);
    tr.appendChild(tdAcoes);

    //Retorna a linha da tabela com todos os componentes criados
    return tr;
}

var idEdit;

function montarPessoa() {
    var nome = document.getElementById('nome').value;
    var sobrenome = document.getElementById('sobrenome').value;

    var dataNascimento = document.getElementById("myInputDate").valueAsDate;

    console.log(nome + sobrenome + dataNascimento)
    var pessoa = new Object();
    pessoa.nome = nome;
    pessoa.sobrenome = sobrenome;
    if(dataNascimento !== null) {
        pessoa.dataNascimento = new Date(dataNascimento.valueOf());
    } else {
        pessoa.dataNascimento = null;
    }

    console.log(pessoa);

    return pessoa;
}

//Função chamada pela tag <form>
async function cadastrarPessoa(event) {
    //Garante que a tela não seja atualizada ao enviar uma requisição.
    event.preventDefault();

    let urlSave = 'http://localhost:8080/exercicioconhecimentos/pessoa/save';
    let urlUpdate = 'http://localhost:8080/exercicioconhecimentos/pessoa/update';

    //Recupera os valores da tela.
    var pessoa = montarPessoa();

    if (idEdit === undefined) {
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
    } else {

        pessoa.idPessoa = idEdit;

        var xhr = new XMLHttpRequest();
        xhr.open("PUT", urlUpdate, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = () => {
            var data = JSON.parse(xhr.responseText);
            if (data.NOT_FOUND) {
                alert(data.NOT_FOUND, 'warning');
                removeAlert(false);
            }
            if (data.ACCEPTED) {
                alert(data.ACCEPTED, 'success');
                removeAlert(true);
            }
        }
        xhr.send(JSON.stringify(pessoa));
    }

}

function deletePessoa(idPessoa) {
    const url = 'http://localhost:8080/exercicioconhecimentos/pessoa/delete/';

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url + idPessoa, true);
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        if (data.NOT_FOUND) {
            alert(data.NOT_FOUND, 'warning');
            removeAlert(false);
        }
        if (data.CONFLICT) {
            alert(data.CONFLICT, 'danger');
            removeAlert(false);
        }
        if (data.ACCEPTED) {
            alert(data.ACCEPTED, 'success');
            removeAlert(true);
        }
    }
    xhr.send(null);
}

function editPessoa(idPessoa) {
    const url = 'http://localhost:8080/exercicioconhecimentos/pessoa/find/';

    var xhr = new XMLHttpRequest()
    xhr.open('GET', url + idPessoa, true)
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        if (data.NOT_FOUND) {
            alert(data.NOT_FOUND, 'warning');
            removeAlert(false);
        } else {
            document.getElementById('btnCadastrar').innerText = 'Alterar';
            idEdit = idPessoa;
            document.getElementById('nome').value = data.nome;
            document.getElementById('sobrenome').value = data.sobrenome;
            //document.getElementById('dataNascimento').valueAsDate = data.dataNascimento;
        }
    }
    xhr.send(null);
}

function findAll() {
    const url = "http://localhost:8080/exercicioconhecimentos/pessoa/find/all";
    var tBody = document.getElementById('tBodyDisciplinas');
    var tr;

    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        data.forEach(pessoa => {
            tr = createRowDisciplinas(pessoa);
            tBody.appendChild(tr);
        });
    }
    xhr.send(null);
}

findAll();
   

