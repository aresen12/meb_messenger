random_colors = ["#59a83d", "#6495ed", "#fab700", "#ffb28b", "#b37fb3"]


function getCookie(name) {
  let cookie = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
}

// 1 - send by enter 2 - send by ctrl + enter

function set_enter(key) {
    if(key == 2) {
        document.cookie = "enter=2";
        globalThis.enter_flag = false;
    } else {
        globalThis.enter_flag = true;
        document.cookie = "enter=1";
    }
}


function edit(id_mess){
    exit_menu();
    globalThis.edit_flag = true;
    globalThis.edit_id = id_mess;
    var t = document.getElementById("text" + id_mess).textContent.trim();
    document.getElementById("about").value = t;
    var la = document.getElementById("edit-label");
    la.innerHTML = t;
    la.innerHTML += '<button type="button" onclick="close_edit()" class="btn-close edit-btn-close" aria-label="Close">\
    </button>'
    la.style.display = "block";

}


function edit_post(id_mess, text){
var chat_id = document.getElementById("chat_id").value;
globalThis.edit_id = "";
    globalThis .edit_flag = false;
    document.getElementById("edit-label").style.display = "none";
    $.ajax({
    url: '/m/edit_message',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id":id_mess, "new_text": text, "chat_id": chat_id}),
    success: function(json){
        close_edit();
    },
    error: function(err) {
        console.error(err);
    }
});
}


function sing_out_of_chat(){
    $.ajax({
    url: '/chats/sing_out_chat',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"chat_id": document.getElementById("chat_id").value}),
    success: function(json){
        get_chats('email', "set_recipient");
        exit_chat();
    },
    error: function(err) {
        console.error(err);
    }
});
}


function un_pinned(mess_id){
    $.ajax({
    url: '/m/un_pinned',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"mess_id": mess_id, "chat_id": document.getElementById("chat_id").value}),
    success: function(json){},
    error: function(err) {
        console.error(err);
    }
});
}



function set_recipient(id_chat, is_primary, name, status, pinned) {
// пользователь прочитал все сообщения
    var rn = document.getElementById("rn" + id_chat);
    rn.textContent = "";
    rn.style.display = "none";
    document.getElementById("ident").textContent = "";
    document.getElementById("pinned").innerHTML = "";
    document.getElementById("menu_chat_div_all").style.display = "block";
    var st_chat = document.getElementById("chat_id").value;
    if (st_chat){
        leave_chat(st_chat);
    }
    try{
// что то мудрёно надо потом разобраться
        document.getElementById("chat"+ id_chat).style.background =  "#6699cc";
    } catch (error) {
        setTimeout(function() {
        var chat2 = document.getElementById("chat"+ id_chat);
        chat2.style.background =  "#f1f1f1";
        document.getElementById('name_chat').textContent = chat2.innerText;
            }, 3000);
}
    document.getElementById("content").innerHTML = '<h2 class="update">Загрузка...<h2>';
    if (status == 1){
        document.getElementById("form").style.display = "block";
    }else{
        document.getElementById("form").style.display = "none";
    }
    var menu = document.getElementById("menu-chat-ul");
    menu.innerHTML = '<li onclick="block_user()">Заблокировать</li><li onclick="delete_chat()">Удалить чат</li><li onclick="search_text()">Поиск</li>';
    if (!is_primary){
        menu.innerHTML += '<li onclick="sing_out_of_chat()">Покинуть чат</li>';
    };
    if (!pinned) {
        menu.innerHTML += `<li class="" onclick="pin_chat('${id_chat}')">Закрепить</li>`;
    } else {
        menu.innerHTML += `<li onclick="unpin_chat('${id_chat}')">Открепить</li>`;
    }
    document.getElementById("chat_id").value = id_chat;
    document.getElementById('name_chat').textContent = name;
    document.getElementById("icon_c_chat").innerHTML = document.getElementById("icon_chatset_recipient" + id_chat).innerHTML;
    var x = document.getElementById("background-img");
    var y = document.getElementById("email");
    var button = document.getElementById("button");
    window.location.hash = "#";
    show();
    var scrollTop = $(window).scrollTop(),
    elementOffset = $('#content').offset().top,
    distance = (elementOffset - scrollTop);
    globalThis.global_distans = distance;
    document.getElementById('chat_id').innerText = id_chat;
    document.getElementById("btn_down").style.display = 'block';
    console.log(mobile);
    if (mobile){
        document.getElementById("chat_header").style.display = "flex";
        x.style.display = "block";
        var button = document.getElementById("button").style.visibility = 'visible';
        var cont = document.getElementById("container-mess");
        cont.style.display = "block";
        y.style.display = "none";
        document.getElementById("settings_btn").style.display = 'none';
        document.getElementById("plus_btn").style.display = "none";
    }
    let call_btn = document.getElementById("call-btn");
    call_btn.setAttribute("onclick", `send_call(${is_primary})`);
//    call_btn.style.display = "block";
    socket.emit('join', {room: id_chat});

}


function voting(id_voting, i){
     $.ajax({
    url: '/m/voting',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"mess_id": id_voting, "chat_id": document.getElementById("chat_id").value, "i" : i}),
    success: function(json){

    },
    error: function(err) {
        console.error(err);
    }
});
}


setSelectionRange = function(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
};


function go(){
    if (document.getElementById("global_menu_d").style.display == "none"){
        setSelectionRange(document.getElementById("about"), globalThis.position, globalThis.position);
    }
}


function submit_form() {
    var x = document.querySelector('.form2');
    if (edit_flag){
        globalThis.edit_flag = false;
        var about = document.getElementById("about");
        edit_post(edit_id, about.value);
        about.value = "";
        document.getElementById('inputTag').value = "";
        close_edit();
    } else {
        var text = document.getElementById("about").value;
        if ($('form input[type=file]').val() == '' && text.trim() != ""){
            send_io_mess();
            close_edit();
    }else {
        var b = x.submit();
        console.log(b);
    }
     x.reset();
   document.getElementById("imageName").innerHTML = "";
    }

}


function show(path){
    var chat_id = document.getElementById("chat_id").value;
    var request_url =  "/m/get_json_mess";
    if (path){
        request_url =  "/m/get_json_mess_my";
        chat_id = chat_id.slice(2);
    }
      $.ajax({
    url: request_url,
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"chat_id": chat_id}),
    success: function(json_mess){
        var cont = document.getElementById("content");
        var date = "";
        cont.innerHTML = "";
        for (let i = 0; i < json_mess["messages"].length; i++){
            var c_m = json_mess["messages"][i];
            var other = !(id_user == c_m["id_sender"]);
            var file = "";
            if (c_m["file"]){
                file = json_mess["files"][c_m["file"]];
            };
            var time = c_m["time"].split(" ");
            if (date != time[0]){
                var time2 = time[0].split("-");
                date = time[0];
                cont.innerHTML += '<div class="date_k">' + time2[2]+ "." + time2[1] + "." + time2[0] + '</div>';
            };
            if (c_m["type"] == 3){
            gener_sticker(c_m["id"], time[1].split(".")[0], c_m["html_m"], other, c_m['read'], c_m["name_sender"]);
        } else if (c_m["type"] == 2){
            gener_emoji(c_m["id"],  c_m["html_m"], other, c_m["text"]);
        } else if (c_m["type"] == 4){
            gener_voting(c_m["id"], c_m["text"], JSON.parse(c_m["html_m"]), other, c_m['read'], c_m["name_sender"], time[1].split(".")[0]);
        }else {
            gener_html(c_m["id"], c_m["text"], time[1].split(".")[0],
            c_m["html_m"], file, other, c_m['read'], c_m["name_sender"]);
        }
//             console.log(`m${c_m["id"]}`, $(`#m${c_m["id"]}`))
//             $(`#m${c_m["id"]}`).on('contextmenu','div', function(e) {  //Get li under ul and invoke on contextmenu
////        e.preventDefault(); //Prevent defaults
//        alert("test")
//        open_menu_mess(`m${c_m["id"]}`); //alert the id
//});
        }
        for (let i = 0;i < json_mess["pinned_message"].length; i++){
            add_pinned(json_mess["pinned_message"][i]);
        }
        cont.style.height = "100%";
        cont.innerHTML += '<div id="pos"><div id="pos2"></div></div>';
        go();
        set_read(document.getElementById("chat_id").value);
        },
    error: function(err) {
        console.error(err);
    }
});
    }


function notification (text, chat_name) {
    (async () => {
              try {
                const permission = await Notification.requestPermission();
                if (Notification.permission === 'denied') {
                }
                const options = {
                  body: text,
                  icon:
                    "https://raw.githubusercontent.com/aresen12/web_messenger/refs/heads/master/static/img/icon.ico"
                };
                new Notification(chat_name, options);
              } catch (error) {
                console.log(error);
              }
            })();
}


function create_chat(list_members, name, is_primary){
    $.ajax({
    url: '/chats/create_chat',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name":name, "list_members": list_members, "primary":is_primary}),
    success: function(json){
          gener_chat("email", json["chat_id"], json["name"], 1, is_primary, "set_recipient",
          {"time" : "2023-01-01 00:00:00.0"}, 0, json["admin"]);
          document.getElementById("global_menu_d").style.display = 'none';
          set_recipient(json["chat_id"], json["is_primary"], json["name"], 1, 0);
        },
    error: function(err) {
        console.error(err);
    }
});
    }


function send(id){
    exit_menu();
    document.getElementById("global_menu").innerHTML = "";
    get_chats_gl("global_menu", id);
    document.getElementById("global_menu_d").style.display = "block";
}


function post_password() {
    var password_old = document.getElementById("password_old");
    var new_password = document.getElementById("password_new");
    if (password_old.value.trim() != "" && new_password.value.trim() != "") {
        let is_edit = confirm("Вы действительно хотите сменить пароль?");
        if (is_edit){
        $.ajax({
            url: '/edit_password',
            type: 'POST',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({"new_password": new_password.value, "old_password": password_old.value}),
            success: function(html){
                  document.getElementById("global_menu_d").style.display = "none";
                },
            error: function(err) {
                console.error(err);
            }
            });
    }
}
}

function delete_mess(id_mess){
    exit_menu();
      $.ajax({
    url: '/m/delete',
    type: 'DELETE',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id":id_mess, "chat_id": document.getElementById("chat_id").value}),
    error: function(err) {
        console.error(err);
    }
});
    }


function edit_prof_post() {
let is_edit = confirm("Вы действительно хотите отредактировать профиль?");
if (is_edit){
document.getElementById("global_menu_d").style.display = "none";
$.ajax({
    url: '/edit_prof',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name": document.getElementById("name_edit").value,
     "email": document.getElementById("email_edit").value}),
    success: function(json){
            if (json["log"] == "bad username"){
                alert("Неправильное username");
            }
          get_chats('email', "set_recipient");
        },
    error: function(err) {
        console.error(err);
    }
});
}
}



function delete_chat() {
    showdiv1('menu-chat');
    let is_del = confirm("Вы действительно хотите удалить этот чат?");
    if (is_del){
        $.ajax({
            url: '/chats/delete_chat',
            type: 'DELETE',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({"id_chat": document.getElementById("chat_id").value}),
            success: function(html){
                  get_chats('email', "set_recipient");
                  exit_chat();
                },
            error: function(err) {
                console.error(err);
            }
        });
    }
}


function block_user() {
    showdiv1('menu-chat');
    let is_block = confirm("Вы действительно хотите заблокировать чат?");
    if (is_block){
        $.ajax({
            url: '/chats/block_chat',
            type: 'POST',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({"id_chat": document.getElementById("chat_id").value}),
            success: function(html){
                  get_chats('email', "set_recipient");
                  exit_chat();
                },
            error: function(err) {
                console.error(err);
            }
        });
    }
}


function answer(id_mess){
    exit_menu();
    var la = document.getElementById("edit-label");
    var t = document.getElementById("text" + id_mess).textContent.trim();
     if (t == ""){
        t = "файл";
    };
    la.innerHTML = t;
    la.innerHTML += '<button type="button" onclick="close_edit()" class="btn-close edit-btn-close" aria-label="Close"></button>'
    la.style.display = "block";
    document.getElementById("html_m").value = `<button id="answer" class="answer-a"
    onclick="answer_color('m${id_mess}')">${t}</button>`;
}


function show_create_group(){
    var x = document.getElementById("global_menu_d").style.display = "block";
    document.getElementById("how_create").style.display = "none";
    get_users(0);
}


function show_create_primary_chat(){
    document.getElementById('global_menu_d').style.display = "block";
    document.getElementById("how_create").style.display = "none";
    get_users(1);
}


function get_users(primary){
    var global_menu = document.getElementById("global_menu");
    var text = "Создать чат с пользователем";
    if (!primary){
        text = "Создать группу";
    }
    global_menu.innerHTML = `<div class="div-name-menu"><b class="name-menu">${text}</b>
    <button onclick="close_global_menu()" type="button" class="btn-close gl-btn-close"
    aria-label="Close"></button></div>`;
    $.ajax({
        url: '/m/get_users',
        type: 'GET',
        dataType: 'json',
        success: function(json){
        ul = document.createElement("ul");
        ul.classList = "cont-ul";
        if (primary){
            ul.style.height = "78vh";
        } else {
            ul.style.height = "50vh";
        }
        for (let i = 0; i < json["users"].length; i++){
            if (id_user == json["users"][i][2]) continue;
            var li_user = document.createElement("li");
            if (primary){
                li_user.setAttribute("onclick",  `create_chat('${json["users"][i][2]} ${id_user}', '', 1)`);
            } else {
                var my_input = document.createElement("input");
                my_input.type = "checkbox";
                my_input.setAttribute("onclick", `add_chat(${json["users"][i][2]}, 'list_members')`);
                li_user.appendChild(my_input);
            }
            li_user.classList = "list-group-item";
            li_user.innerHTML += json["users"][i][0];
            ul.appendChild(li_user);
        }
        global_menu.appendChild(ul);
        if (!primary){
            var button = document.createElement("button");
            button.classList = "edit-btn";
            button.setAttribute("onclick", "create_group()");
            button.textContent = "Создать";
            var div = document.createElement('div');
            div.classList = "name-new-chat";
            div.id = "name_new_chat_group";
            var label = document.createElement("p");
            label.textContent = "Имя чата";
            var input_name_chat = document.createElement("input");
            input_name_chat.id = "name_new_chat";
            input_name_chat.classList = "form-control";
            var input_members = document.createElement("input");
            input_members.id = "list_members";
            input_members.style.display = "none";
            input_members.value = id_user;
            div.appendChild(label);
            div.appendChild(input_name_chat)
            global_menu.appendChild(button);
            global_menu.appendChild(div);
            global_menu.appendChild(input_members);
        }
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function edit_name_chat(){
    $.ajax({
        url: '/chats/edit_name_chat',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": document.getElementById('chat_id').value, "new_name": document.getElementById('new_chat_name').value}),
        success: function(html){
              get_chats('email', "set_recipient");
            },
        error: function(err) {
            console.error(err);
        }
    });

}


function add_chat(new_mem, name_id){
    var list_mem = document.getElementById(name_id);
    list_mem.value = list_mem.value.trim();
    t_m = list_mem.value.split(" ");
    var delete_fl = true;
    for (i=0; i <= t_m.length; i++){
            if (new_mem == t_m[i]){
                t_m.splice(i, i + 1);
                list_members.value = t_m.join(" ");
                delete_fl = false;
            };
        };
    if (delete_fl) {
        list_mem.value += " " + new_mem;
    }
}


async function hide_menu_and_update_chat_list(json){
    document.getElementById("global_menu_d").style.display = 'none';
    document.getElementById("global_menu").innerHTML = "";
    let x = await get_chats('email', "set_recipient");
     set_recipient(json["chat_id"], json["is_primary"], json["name"], 1);
}


function create_group (){
    var name = document.getElementById("name_new_chat").value;
    var list_members = document.getElementById("list_members").value;
    if (list_members.trim() == ""){
        return "";
    }
    var is_primary = 0;
    if (name.trim() == ""){
        document.getElementById("name_new_chat").value = "Добавьте имя!!!";
        return "";
    }
//    create_chat(name, list_members, is_primary);
      $.ajax({
    url: '/chats/create_chat',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name":name, "list_members": list_members, "primary":is_primary}),
    success: function(json){
          // update chats list
            hide_menu_and_update_chat_list(json);
        },
    error: function(err) {
        console.error(err);
    }
});
}


function submit_new_users(){
    var list_members = document.getElementById("list_of_new_u").value;
    $.ajax({
        url: '/chats/add_in_chat',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id":document.getElementById("chat_id").value, "list_members": list_members}),
        success: function(json){
            show_users();
            },
        error: function(err) {
            console.error(err);
        }
    });

}


function get_read(chat_id){
    $.ajax({
        url: '/m/get_not_read',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id":chat_id}),
        success: function(json){
            if (json["r"]){
                var rn = document.getElementById("rn" + chat_id);
                rn.innerHTML = json["r"];
                rn.style.display = "block";
            }
            },
        error: function(err) {
            console.error(err);
        }
    });

}

function my_send_of(chat_id, id_m){
    $.ajax({
        url: '/m/my_mail',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"mail_id_chat":chat_id, "mess_id":id_m, "chat_id": document.getElementById("chat_id").value}),
        success: function(json){
            document.getElementById("global_menu_d").style.display = "none";
            document.getElementById("global_menu").innerHTML = "";
            set_my_recipient('my' + id_user);
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function send_create_voting(){
    let cnt_item = Number(document.getElementById("cnt_voting_items").value);
    let voting = {};
    for (let i = 1; i <= cnt_item; i++){
        voting[i] = document.getElementById("item_text" + i).value;
    }
    $.ajax({
        url: '/m/create_voting',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": document.getElementById("chat_id").value, "voting": voting,
        "title_voting": document.getElementById("title_voting").value}),
        success: function(json){
            close_global_menu();
        },
        error: function(err) {
            console.error(err);
        }
    });
}

function send_of(chat_id, id_m, name_chat){
    $.ajax({
        url: '/m/mail',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"mail_id_chat":chat_id, "mess_id":id_m, "chat_id": document.getElementById("chat_id").value}),
        success: function(json){
            document.getElementById("global_menu_d").style.display = "none";
            document.getElementById("global_menu").innerHTML = "";
            set_recipient(chat_id, 0, name_chat,  1, 0)
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function get_chats(id_div, command){
    $.ajax({
        url: '/chats/get_chats',
        type: 'GET',
        dataType: 'json',
        success: function(json){
            if (json["chats"].length == 0){
                document.getElementById(id_div).innerHTML = '<h2>Для того чтобы создать чат нажмите на синий плюс.</h2>'
                return 0;
            } else {
                document.getElementById(id_div).innerHTML = "";
            }
           for (let i = 0; i < json["chats"].length; i++){
                if (json["chats"][i]["id"] == "my" + id_user){
                     gener_my_chat(id_div, command, json["chats"][i]["last_message"],
                      json["chats"][i]["id"],  json["chats"][i]["pinned"]);
                } else{
                    gener_chat(id_div, json["chats"][i]["id"], json["chats"][i]["name"],
                     json["chats"][i]["status"], json["chats"][i]["primary_chat"], command,
                      json["chats"][i]["last_message"],  json["chats"][i]["pinned"], json["chats"][i]["admin"]);
                }
            }
            },
        error: function(err) {
            console.error(err);
        }
});
}


function get_black_list(){
    safety_div = document.getElementById("safety");
    if (safety_div.style.display == "none"){
        safety_div.style.display = "block";
    } else {
        safety_div.innerHTML = "";
        safety_div.style.display = "none";
        return 0;
    }
    $.ajax({
        url: '/m/get_black_list',
        type: 'GET',
        dataType: 'json',
        success: function(json_data){
            var user_div = document.createElement("div");
            var btn = document.createElement("button");
            btn.textContent = "Разблокировать";
            btn.classList = "btn btn-danger";
            var label = document.createElement("label");
            label.classList = 'label-block';
            for (let i = 0; i < json_data["black_list"].length; i++){
                btn.setAttribute("onclick", `unblock_user(${json_data["black_list"][i][0]})`)
                user_div.appendChild(btn);
                label.textContent = `${json_data["black_list"][i][1]}(${json_data["black_list"][i][2]})`
                user_div.appendChild(label)
                safety_div.appendChild(user_div);
            }
            if (json_data["black_list"].length == 0){
                safety_div.textContent = "Чёрный список пуст!";
            }
        },
        error: function(err) {
            console.error(err);
        }
    });
}


function get_chats_gl(id_div, id_m){
    var global_menu = document.getElementById(id_div);
    var div = document.createElement("div");
    global_menu.innerHTML += '<b class="name-menu">Переслать</b> <button onclick="close_global_menu()" type="button"\
                    class="btn-close gl-btn-close" aria-label="Close"></button>';
    div.id = "cont_user_send"
    global_menu.appendChild(div);
    get_chats("cont_user_send", id_m);
}


function unblock_user(id_user){
    $.ajax({
        url: '/m/unblock_user',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"id_user":id_user}),
        success: function(json){
         get_black_list();
         get_black_list();
        },
        error: function(err) {
            console.error(err);
        }
    });
}



// отрисовка интерфейса
function add_in_chat_new(){
    var global_menu = document.getElementById("global_menu");
    document.getElementById("users").style.display = "none";
    global_menu.innerHTML += '<ul id="add_new_users" class="list-group"></div>';
    var add_new_users = document.getElementById("add_new_users");
    add_new_users.innerHTML = '<input style="display:none;" id="list_of_new_u">';
    $.ajax({
    url: '/m/get_users',
    type: 'GET',
    dataType: 'json',
    success: function(json){
            var sp = document.getElementById("list_c_u").value.split(" ");
            for (let i = 0; i < json["users"].length; i++){
                if (json["users"][i][2] in sp || id_user == json["users"][i][2]){
                } else{
                add_new_users.innerHTML += '<li class="list-group-item">' + '<input type="checkbox" onclick="add_chat(' + json["users"][i][2]+ ", 'list_of_new_u'" + ')">' + json["users"][i][0] + '</label><br>';
            }
            }
            add_new_users.innerHTML += '<button onclick="submit_new_users()" class="edit-btn">Добавить</button>'
        },
    error: function(err) {
        console.error(err);
    }
});
}


function add_users_label(users, con_users){
    for (let i = 0; i < users.length; i++){
    var ul = document.createElement("ul");
    $.ajax({
        url: '/m/get_user/' + users[i],
        type: 'GET',
        dataType: 'json',
        success: function(json_data){
            var li_user = document.createElement("li");
            li_user.classList = "list-group-item";
            li_user.textContent = `${json_data["user"]}(${json_data["email"]})`;
            ul.appendChild(li_user);
        },
        error: function(err) {
            console.error(err);
        }
    });
    }
    con_users.appendChild(ul);
}


function show_users(){
    var global_menu = document.getElementById("global_menu");
    if (document.getElementById("chat_id").value != ""){
        global_menu.innerHTML = `<div class="div-name-menu"><b class="name-menu">Управление чатом</b>
        <button onclick="close_global_menu()" type="button"
         class="btn-close gl-btn-close" aria-label="Close"></button></div>`;
         document.getElementById("global_menu_d").style.display = "flex";
            var users_div = document.createElement("div");
            users_div.id = "users";
            users_div.classList = "cont-users";
            const con_users = document.createElement("div");
            con_users.id = "con_users";
//            con_users.classList = "list-group";
            const user_btn = document.createElement('button');
            user_btn.textContent = "Участники";
            user_btn.id = "border_btn1";
            user_btn.style.borderBottom = "3px solid #6495ED";
            user_btn.setAttribute("onclick", 'add_border("users", "files",  "border_btn1",  "border_btn2")');
            user_btn.classList = "info-btn";
            const file_btn = document.createElement('button');
                file_btn.textContent = "файлы";
                file_btn.id = "border_btn2";
                file_btn.setAttribute("onclick", 'add_border("users", "files",  "border_btn1",  "border_btn2")');
                file_btn.classList = "info-btn";
                users_div.appendChild(con_users);
                global_menu.appendChild(user_btn);
                global_menu.appendChild(file_btn);
                global_menu.appendChild(users_div);
                files_div = document.createElement("ul");
                files_div.id = "files";
                files_div.classList = "list-group";
                files_div.style.display = 'none';
         global_menu.appendChild(files_div);
         add_files_label(files_div);
         if (Number(document.getElementById("chat_id").value)){
            $.ajax({
            url: '/m/get_chat_user/' + document.getElementById("chat_id").value,
            type: 'GET',
            dataType: 'json',
            success: function(json){
                if (!json["primary_chat"]){
                    var div = document.createElement('div');
                    div.classList = "name-new-chat";
                    div.id = "new_chat_name";
                    var label = document.createElement("p");
                    label.textContent = "Имя чата";
                    var input_name_chat = document.createElement("input");
                    input_name_chat.id = "name_new_chat";
                    input_name_chat.classList = "form-control";
                    input_name_chat.value = document.getElementById("name_chat").innerText;
                    div.appendChild(label);
                    div.appendChild(input_name_chat);
                    div.innerHTML += '<button onclick="edit_name_chat()" class="edit-btn">изменить</button></div>';
                    div.innerHTML += '<input id="list_c_u" value="'+ json["user"].join(" ") + '" style="display:none;">'
                    global_menu.appendChild(div);
                    var btn_add = document.createElement("button");
                    btn_add.classList = "edit-btn";
                    btn_add.textContent = "Добавить участника";
                    btn_add.setAttribute("onclick", "add_in_chat_new()");
                    users_div.appendChild(btn_add);
                }
                add_users_label(json["user"], con_users);
            },
            error: function(err) {
                console.error(err);
            }
        });
        }
    };
}


function copyToClipboard(id_m) {
    var t = document.getElementById("text" + id_m).textContent.trim();
    navigator.clipboard.writeText(t);
    exit_menu();
  }

function delete_answer_voting(){
    alert("В разроботке")
}



function injectEmojisToList(e) {
        document.getElementById("about").value += e.innerHTML;
        globalThis.position = document.getElementById("about").selectionStart;
        go();
    }


function send_img(){
    submit_form();
    document.getElementById("send2_btn").style.display = "none";
    document.getElementById("watch").style.display = "none";

}

function set_read(chat_id){
    $.ajax({
        url: '/m/set_read',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id":chat_id}),
        success: function(json){
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function pinned(id_mess){
    chat_id = document.getElementById("chat_id").value;
    exit_menu();
    $.ajax({
        url: '/m/pinned',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id":chat_id, "mess_id": id_mess}),
        success: function(json){
//                add_pinned(id_mess);
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function submit_username_tg(){
    $.ajax({
        url: '/m/set_username_tg',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"username": document.getElementById("tg_input").value}),
        success: function(json){
            document.getElementById("global_menu_d").style.display = "none";
            },
        error: function(err) {
            console.error(err);
        }
    });
}


// "/get_new_message_id/<id_mess>/<chat_id>"
function get_new_message_id(){
    let mess_id = document.getElementById("last_mess_id").value;
    let chat_id = document.getElementById("chat_id").value;
    if (chat_id){
    $.ajax({
        url: `/m/get_new_message_id/${mess_id}/${chat_id}`,
        type: 'GET',
        dataType: 'json',
        success: function(json){
            for (var j = 0; j < json["message"].length; j++){
                var mess = json["message"][j];
                let other = !(mess["id_sender"] == id_user);
                if (mess["type"] == 4){
//                потом
//                    gener_voting(mess[j], mess["time"], mess["html"], other, 0, mess["name_sender"], 0);
                } else if (mess["type"] == 3){
                    gener_sticker(mess[j], mess["time"], mess["html"], other, 0, mess["name_sender"], 0);
                } else if (mess["type"] == 2){
                    gener_emoji(mess[j],  mess["html"], other, mess["text"]);
                } else {
                    gener_html(mess[j], mess["text"], mess["time"], mess["html"], mess["file"], other);
                }
            }
//id, text, time, html_m, file, other
            },
        error: function(err) {
            console.error(err);
        }
    });
}
}


function unpin_chat(chat_id){
    exit_menu();
    $.ajax({
        url: '/chats/unpin_chat',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": chat_id}),
        success: function(json){
            get_chats('email', "set_recipient");
        },
        error: function(err) {
            console.error(err);
        }
    });
}


function pin_chat(chat_id){
    exit_menu();
    $.ajax({
        url: '/chats/pin_chat',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": chat_id}),
        success: function(json){
            get_chats('email', "set_recipient");
        },
        error: function(err) {
            console.error(err);
        }
    });
}


function set_my_recipient(id_chat){
    document.getElementById("menu-chat-ul").innerHTML = "";
    document.getElementById("pinned").innerHTML = "";
    document.getElementById("ident").textContent = "";
    document.getElementById("menu_chat_div_all").style.display = "block";
    var st_chat = document.getElementById("chat_id").value
    document.getElementById("btn_down").style.display = 'block';
    if (st_chat){
        leave_chat(st_chat);
    }
    try{
        document.getElementById("my_chat"+ id_chat.slice(2)).style.background =  "#6699cc";
    } catch (error) {
        setTimeout(function() {
            var chat2 = document.getElementById("my_chat"+ id_chat);
            chat2.style.background =  "#f1f1f1";
            document.getElementById('name_chat').textContent = chat2.innerText;
        }, 3000);
    }
    document.getElementById('name_chat').textContent = "Избранное";
    document.getElementById("content").innerHTML = '<h2 class="update">Загрузка...<h2>';
    document.getElementById("form").style.display = "block";
    document.getElementById("chat_id").value = id_chat;
    document.getElementById("icon_c_chat").innerHTML = document.getElementById("icon_chatset_recipient" + id_chat).innerHTML;
    var x = document.getElementById("background-img");
    var y = document.getElementById("email");
    var button = document.getElementById("button");
    window.location.hash = "#";
    show(1);
    var scrollTop = $(window).scrollTop(),
    elementOffset = $('#content').offset().top,
    distance = (elementOffset - scrollTop);
    globalThis.global_distans = distance;
    document.getElementById('chat_id').innerText = id_chat;
    if (mobile){
        document.getElementById("chat_header").style.display = "flex";
        x.style.display = "block";
        var button = document.getElementById("button").style.visibility = 'visible';
        var cont = document.getElementById("container-mess");
        cont.style.display = "block";
        y.style.display = "none";
        document.getElementById("settings_btn").style.display = 'none';
    }
    socket.emit('join', {room: id_chat});
}


function compareNumbers(a, b) {
  return b - a;
}


function search_in_message(){
    var chat_id = document.getElementById("chat_id").value;
    text = document.getElementById("search_text").value;
    search_div = document.getElementById("search_text_div");
    $.ajax({
        url: '/api/search_in_chat',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": chat_id, "search_text": text}),
        success: function(json){
            if (!document.getElementById("btn_search_down")){
                var btn_down = document.createElement("button");
                var btn_up = document.createElement("button");
                btn_up.id = "btn_search_up";
                btn_down.id = "btn_search_down";
                btn_up.textContent = "🡅";
                btn_down.textContent = "🡇";
                btn_down.classList = "btn";
                btn_up.classList = "btn";
            } else{
                var btn_down = document.getElementById("btn_search_down");
                var btn_up = document.getElementById("btn_search_up");
            }
            var input = document.getElementById("list_search_id_message");
            if (!input){
                input = document.createElement("input");
                input.id = "list_search_id_message";
                input.style.display = "none";
            }
            input.value = json["list_message"].sort(compareNumbers).join(" ");
            btn_up.setAttribute("onclick", `go_to_message('${json["list_message"][0]}')`);
            btn_down.setAttribute("onclick", `go_to_message('${json["list_message"][0]}')`);
            search_div.appendChild(btn_up);
            search_div.appendChild(input);
            search_div.appendChild(btn_down);
            var cnt = document.getElementById("cnt_search_m");
            if (!cnt){
                cnt = document.createElement('div');
                cnt.id =  "cnt_search_m";
            }
            cnt.textContent = `(${json["list_message"].length})`;
            search_div.appendChild(cnt);
            btn_up.click();
        },
        error: function(err) {
            console.error(err);
        }
    });
}
