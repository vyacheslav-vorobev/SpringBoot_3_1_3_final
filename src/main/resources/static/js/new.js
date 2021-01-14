//Заполнение модального окна Edit
let jsonUser;
let rolesString
let id
jQuery(document.body).on('click', '.edit',(async function () {
    id = await $(this).attr('content')
    let promise = await fetch('http://localhost:8080/admin/' + id)
    jsonUser = await promise.json()

    let edit = $("#modalEdit");
    let login = jsonUser['login']
    let password = jsonUser['password']
    let firstName = jsonUser['firstName']
    let lastName = jsonUser['lastName']
    rolesString = jsonUser['rolesString']
    let age = jsonUser['age']
    let growth = jsonUser['growth']

    await $.ajax('http://localhost:8080/admin', {
        method: "get",
        dataType: "text",
        success: function (msg) {
            edit.find('#login').attr('value', login);
            edit.find('#password').attr('value', password);
            edit.find('#firstName').attr('value', firstName);
            edit.find('#lastName').attr('value', lastName);
            edit.find('#age').attr('value', age);
            edit.find('#growth').attr('value', growth);
            $('#formEdit').attr('action', '/admin/' + id)
            $('#goEdit').attr('content', id)
        }
    })
    $('#modalEdit').modal('show')

    jQuery(document.body).on('click', "#goEdit", function() {
        let form =  $('form').serializeArray()
        let jsonEdit = {
            id:id,
            login: form[7].value,
            password: form[8].value,
            firstName: form[9].value,
            lastName: form[10].value,
            age: form[11].value,
            growth: form[12].value,
            rolesString: form[13].value
        }
        $.ajax("http://localhost:8080/admin", {
            method: "put",
            data: jsonEdit,
            dataType: "text",
            success: function (msg) {
                $('#modalEdit').modal('hide')
            }
        })

        //Внесение изменений в таблицу
        $("#login" + id).text(form[7].value)
        $("#firstname" + id).text(form[9].value)
        $("#lastname" + id).text(form[10].value)
        $("#age" + id).text(form[11].value)
        $("#growth" + id).text(form[12].value)
        if((form[13].value)==='ADMIN'){
            $("#roles" + id).text('[ROLE_USER, ROLE_ADMIN]')
        } else {
            $("#roles" + id).text('[ROLE_USER]')
        }
    })
}))
//Создание юзера
$('#newUser').click(async function (){
    let form = $('form').serializeArray()
    let jsonNew = {
        login: form[0].value,
        password: form[1].value,
        firstName: form[2].value,
        lastName: form[3].value,
        age: form[4].value,
        growth: form[5].value,
        rolesString: form[6].value,
        role: ""
    }
    let user = await $.ajax("http://localhost:8080/admin", {
        method: "post",
        data: jsonNew,
        dataType: "json",
    })

    //Прорисовка только что созданного Юзера в таблицу
    let delId = "#del" + user['id']

    $("<tr class=\"tab-content\" id = \"del"+user['id']+"\">").appendTo($("#tbody"))
    $("<th scope=\"row\" id = \"id" + user['id']+"\">").appendTo($(delId))
    $("<td id = \"login" + user['id']+"\">").appendTo($(delId))
    $("<td id = \"firstname" + user['id']+"\">").appendTo($(delId))
    $("<td id = \"lastname" + user['id']+"\">").appendTo($(delId))
    $("<td id = \"roles" + user['id']+"\">").appendTo($(delId))
    $("<td id = \"age" + user['id']+"\">").appendTo($(delId))
    $("<td id = \"growth" + user['id']+"\">").appendTo($(delId))

    $("<a></a>").text(user['id']).appendTo($("#id"+ user['id']))
    $("<a></a>").text(user['login']).appendTo($("#login"+ user['id']))
    $("<a></a>").text(user['firstName']).appendTo($("#firstname"+ user['id']))
    $("<a></a>").text(user['lastName']).appendTo($("#lastname"+ user['id']))
    $("<a></a>").text(user['rolesString']).appendTo($("#roles"+ user['id']))
    $("<a></a>").text(user['age']).appendTo($("#age"+ user['id']))
    $("<a></a>").text(user['growth']).appendTo($("#growth"+ user['id']))

    $("<button type=\"button\" class=\"btn btn-primary edit\"></button>").text("Edit").attr('content', user['id'])
        .appendTo($("<td class = \"tdDel\"></td>").appendTo($(delId)))

    $("<button type=\"button\" class=\"btn btn-danger del\" id = \"buttonDelete\" " +
        "data-target = \"#modalDelete\" data-toggle = \"modal\"\"></button>")
        .text("Delete").attr('content', user['id'])
        .appendTo($("<td></td>").appendTo($(delId)))

    $("#new_user").attr('class',"tab-pane fade")
    $("#user_table").attr('class',"tab-pane fade active show")
    $("#navLinkTable").attr('class',"nav-link active")
    $("#navLinkNew").attr('class',"nav-link")
})

// Заполнение модального окна Delete
let d;
jQuery(document.body).on('click', '.del', (async function () {

    let id = await $(this).attr('content')
    let promise = await fetch('http://localhost:8080/admin/' + id)
    let json = await promise.json()
    let login = json['login']
    let password = json['password']
    let firstName = json['firstName']
    let lastName = json['lastName']
    let rolesString = json['rolesString']
    let age = json['age']
    let growth = json['growth']
    let idModalDelete = $("#modalDelete")

    $.ajax('http://localhost:8080/admin', {
        method: "get",
        dataType: "text",
        success: function (msg) {
            idModalDelete.find('#loginD').attr('value', login);
            idModalDelete.find('#passwordD').attr('value', password);
            idModalDelete.find('#firstNameD').attr('value', firstName);
            idModalDelete.find('#lastNameD').attr('value', lastName);
            idModalDelete.find('#ageD').attr('value', age);
            idModalDelete.find('#growthD').attr('value', growth);
            idModalDelete.find('#roleD').attr('value', rolesString);
            d = 'admin/delete/' + id
        }
    })
    $('#modalDelete').modal('show')
}))

//удаление из таблицы без перезагрузки
$('#delete').click(async function(){
    let promise = await fetch(d, {
        method: "delete",
    } )
    let idDelete = await promise.text()
    $('#modalDelete').modal('hide')
    $("#del"+idDelete).hide()
    console.log("Сработал метод 3")
})

// Заполнение таблицы
$(async function () {
    let promise = await fetch('http://localhost:8080/loadingUser')
    let json = await promise.json()

    //Часть таблицы Админа
    $("<a></a>").text(json['id']).appendTo($("#actualUserId"))
    $("<a></a>").text(json['login']).appendTo($("#actualLogin"))
    $("<a></a>").text(json['firstName']).appendTo($("#actualFirstName"))
    $("<a></a>").text(json['lastName']).appendTo($("#actualLastName"))
    $("<a></a>").text(json['rolesString']).appendTo($("#actualRoles"))
    $("<a></a>").text(json['age']).appendTo($("#actualAge"))
    $("<a></a>").text(json['growth']).appendTo($("#actualGrowth"))
    $("#actualEdit").attr('content', json['id'])
    $("#actualDelete").attr('content', json['id'])

    //Таблица юзера
    $("<a></a>").text(json['id']).appendTo($("#panelUserId"))
    $("<a></a>").text(json['login']).appendTo($("#panelLogin"))
    $("<a></a>").text(json['firstName']).appendTo($("#panelFirstName"))
    $("<a></a>").text(json['lastName']).appendTo($("#panelLastName"))
    $("<a></a>").text(json['rolesString']).appendTo($("#panelRoles"))
    $("<a></a>").text(json['age']).appendTo($("#panelAge"))
    $("<a></a>").text(json['growth']).appendTo($("#panelGrowth"))
})
$(async function () {
    let promise = await fetch('http://localhost:8080/users')
    let json = await promise.json()
    for (let key in json){
        let id = json[key]['id']
        let login = json[key]['login']
        let firstName = json[key]['firstName']
        let lastName = json[key]['lastName']
        let rolesString = json[key]['rolesString']
        let age = json[key]['age']
        let growth = json[key]['growth']

        $("<a></a>").text(id).appendTo($("#id" + id))
        $("<a></a>").text(login).appendTo($("#login" + id))
        $("<a></a>").text(firstName).appendTo($("#firstname" + id))
        $("<a></a>").text(lastName).appendTo($("#lastname" + id))
        $("<a></a>").text(rolesString).appendTo($("#roles" + id))
        $("<a></a>").text(age).appendTo($("#age" + id))
        $("<a></a>").text(growth).appendTo($("#growth" + id))
    }
})
