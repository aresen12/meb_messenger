const emoji = ["🔥", "❤️", "👍", "😁", "👎", "❤️‍🔥", "😭", "👌", "😨",  "🍌", "🌭", "💋",
"🤯", "👏", "🍾",  "💘", "🥰",  "🤔", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏",
"🕊️", "🤡", "🥱", "🥴", "😍", "🐳", "🌚", "💯", "😂", "⚡️", "🏆", "💔", "🤨", "😐", "🍓", "🖕",
 "😈", "😴", "🤓", "👻", "👨‍💻", "🙈", "👀", "😇", "🤝", "✍️", "🤗", "🫡", "🎅", "🎄", "⛄️", "💅",
"🤪", "🗿", "🆒", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷", "🤷‍♀️", "🤷‍♂️", "😡"];


function showDiv(Div, div2) {
    var x = document.getElementById(Div);
    var y = document.getElementById(div2)
    if(x.style.display=="none") {
        x.style.display = "block";
        y.style.display = "none";
        return false;
    }
    x.style.display = "none";
    y.style.display = "block";
    return true;
}


function showdiv1(Div) {
    var x = document.getElementById(Div);
    if(x.style.display=="none") {
        x.style.display = "block";
        return false;
    }
    x.style.display = "none";
    return true;
}



function show_emoji_module(){
    var flag = showdiv1("emojis_menu");
//    document.getElementById("emojis_menu").style.display = "block";
    if (mobile){
        if (flag){
            globalThis.menu_id = "emojis_menu";
        } else {
            globalThis.menu_id = "";
        }
    }
}



function add_border(div1, div2, btn1_id, btn2_id){
    var x = document.getElementById(div1);
    var y = document.getElementById(div2);
    if(x.style.display == "none") {
        x.style.display = "block";
        document.getElementById(btn2_id).style.borderBottom = "";
        document.getElementById(btn1_id).style.borderBottom = "3px solid #6495ED";
        y.style.display = "none";
    } else {
        x.style.display = "none";
        document.getElementById(btn1_id).style.borderBottom = "";
        document.getElementById(btn2_id).style.borderBottom = "3px solid #6495ED";
        y.style.display = "block";
    }
}


function show_in_chat(mess_id){
    close_global_menu();
    answer_color("m" + mess_id);
}


if (document.cookie){
    var button = document.getElementById("bg"+  getCookie("bg"));
    button.click();
    var e = getCookie("enter");
    if (e){
        document.getElementById("E" + e).click();
    } else {
        document.cookie = "enter=1";
    }
} else {
    document.cookie = "bg=2";
    document.cookie = "enter=1";
    document.getElementById("bg2").click();
}


function scroll_carousel(number_img){
    var list_Img = document.getElementById("images_list").value.split(" ");
    document.getElementById("watch_img").src = "/static/img/" + list_Img[number_img];
    var right_index = number_img + 1;
    var left_index = number_img - 1;
    if (left_index <= 0) {
        left_index = list_Img.length - 1;
    }
    if (right_index >= list_Img.length){
        right_index = 0;
    }
    document.getElementById("carousel_right").setAttribute("onclick", `scroll_carousel(${right_index})`);
    document.getElementById("carousel_left").setAttribute("onclick", `scroll_carousel(${left_index})`);
}


function showImg(Div, name_img){
    var x = document.getElementById("watch");
    var w_img = document.getElementById("watch_img");
    var download_a = document.getElementById("download-img-a");
    document.getElementById("carousel_left").style.display = "";
    document.getElementById("carousel_right").style.display = "";
    if(x.style.display == "none") {
        x.style.display = "block";
        w_img.src = "/static/img/" + name_img;
        download_a.href = "/static/img/" + name_img;
        download_a.download = name_img;
        var list_Img = document.getElementById("images_list").value.split(" ");
        var right_index = list_Img.indexOf(name_img) + 1;
        var left_index = list_Img.indexOf(name_img) - 1;
        if (left_index <= 0) {
            left_index = list_Img.length - 1;
        }
        if (right_index >= list_Img.length){
            right_index = 0;
        }
        document.getElementById("carousel_right").setAttribute("onclick", `scroll_carousel(${right_index})`);
        document.getElementById("carousel_left").setAttribute("onclick", `scroll_carousel(${left_index})`);
    } else {
        x.style.display = "none";
    }
}


var autoScroll = true;


function scrollToBottom(elementId) {
    var div = document.getElementById(elementId);
    div.scrollTop = div.scrollHeight;
}


function show_more_emoji(id_mess){
    const curr_m = document.getElementById("mm" + id_mess);
    document.getElementById("ul_on_menu" + id_mess).innerHTML = "";
    document.getElementById("emoji" + id_mess).innerHTML = "";
    const emoji_div2 = document.createElement("div");
    for (let i = 0; i < emoji.length; i++){
        var btn_emoji = document.createElement("button");
        btn_emoji.classList = "info-btn emoji-button";
        btn_emoji.textContent = emoji[i];
        btn_emoji.setAttribute("onclick", `set_emoji(${id_mess}, ${i})`);
        emoji_div2.appendChild(btn_emoji);
    }
    curr_m.appendChild(emoji_div2);
}


function set_bg(num) {
    if (mobile){
        document.getElementById("background-img").src = "/static/img/bg/mob_bg" + num + ".jpg";
    } else {
    document.getElementById("background-img").src = "/static/img/bg/bg" + num + ".jpg";
    }
    document.cookie = "bg="+ num;
}


function set_bg_my(num) {
    document.getElementById("background-img").src = "/static/img/bg_users/" + num + ".jpg";
    document.cookie = "bg=5";
}



function scroll(){
     var scrollTop = $(window).scrollTop(),
        elementOffset = $('#content').offset().top,
        distance = (elementOffset - scrollTop);
     if (distance < globalThis.global_distans){
         globalThis.global_distans = distance;
     };
    if (-400 < globalThis.global_distans - distance){
         if (window.location.hash == "#pos"){
                window.location.hash = "#pos2";
         }else{
            window.location.hash = "#pos";
            }
        }
}


function edit_prof_html(){
    var menu = document.getElementById("global_menu");
    document.getElementById("global_menu_d").style.display = "block";
    $.ajax({
        url: '/m/c_get_user',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
            menu.innerHTML = '<h2>Редактировать профиль</h2><button onclick="close_global_menu()" type="button" class="btn-close gl-btn-close" aria-label="Close"></button>';
            var p_group = document.createElement("div");
            let div = document.createElement("div");
            div.innerHTML = `<span class="input-group-text" id="basic-addon1">@</span>`;
            div.classList = "input-group mb-3";
            p_group.id = "p_group";
            p_group.classList = "edit-cont";
            p_group.style.display = "none";
            var edit_cont = document.createElement('div');
            edit_cont.id = "edit_cont";
            edit_cont.classList = "edit-cont";
            var name_edit = document.createElement("input");
            name_edit.id = "name_edit";
            name_edit.value = json["user"]["name"];
            name_edit.classList = "form-control";
            var name_p = document.createElement("p");
            name_p.textContent = "Имя";
            edit_cont.appendChild(name_p);
            edit_cont.appendChild(name_edit);
            var username_p = document.createElement("p");
            username_p.textContent = "Username";
            edit_cont.appendChild(username_p);
            var email_edit = document.createElement("input");
            email_edit.id = "email_edit";
            email_edit.value = json["user"]["email"];
            email_edit.classList = "form-control";
            div.appendChild(email_edit);
            edit_cont.appendChild(div);
            var save_btn = document.createElement("button");
            save_btn.classList = "edit-btn";
            save_btn.textContent = "Сохранить";
            save_btn.setAttribute('onclick', 'edit_prof_post()');
            var password_btn = document.createElement("button");
            password_btn.classList = "edit-btn";
            password_btn.textContent = "Сменить пароль";
            password_btn.setAttribute('onclick', `showDiv('p_group', 'edit_cont')`);
            edit_cont.appendChild(save_btn);
            edit_cont.appendChild(password_btn);
//            <button class= onclick=""></button>\
//            <button class="edit-btn" onclick=""></button>';
            p_group.innerHTML = 'Для смены пародя введите старый пароль<br><input name="password_old" id="password_old"\
             type="password"><br><label for="password_new">Новый пароль</label><br><input name="password_new"\
              id="password_new" type="password">';
            p_group.innerHTML += '<br><button class="edit-btn" onclick="post_password()">Сменить</button>';
            menu.appendChild(p_group);
            menu.appendChild(edit_cont);
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function uploadFile(file) {
  const xhr = new XMLHttpRequest(); // Создаем новый XMLHttpRequest
  const formData = new FormData(); // Используем FormData для отправки файла

  formData.append('file', file); // Добавляем файл в объект FormData

  // Обработчик для отслеживания прогресса загрузки
  xhr.upload.addEventListener('progress', function (event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      document.getElementById('progressBar').value = percentComplete; // Обновляем прогресс-бар
    }
  });

  // Обработчик на случай успешной загрузки
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      document.getElementById('status').textContent = 'Файл успешно загружен!';
      document.getElementById("bg5").click();
    } else {
      document.getElementById('status').textContent = 'Ошибка при загрузке файла.';
    }
  });

  // Обработчик для ошибок
  xhr.addEventListener('error', function () {
    document.getElementById('status').textContent = 'Произошла ошибка при загрузке файла.';
  });

  xhr.open('POST', '/m/users_bg'); // Указываем метод и URL для отправки файла
  xhr.send(formData); // Отправляем данные
}


function show_in_chat_search(){
    answer_color("m"+ mess_id);
}


function add_files_label(files_div){
    $.ajax({
        url: '/m/get_files_menu',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": document.getElementById("chat_id").value}),
        success: function(json_data){
            if (json_data.length == 0){
                files_div.textContent = "Файлы не найдены";
            };
            for (let i = 0; i < json_data.length; i++){
                var file_label = document.createElement('li');
                file_label.textContent = json_data[i]["name"];
                file_label.classList = "list-group-item";
                file_label.setAttribute("onclick", `show_in_chat("${json_data[i]['mess_id']}")`);
                files_div.appendChild(file_label);
           }
                    },
                error: function(err) {
                    console.error(err);
                }
            });
}


function search_text(){
    var cont = document.getElementById("menu-chat");
    document.getElementById("search_text_div").style.display = "block";
    cont.style.display = "block";
    document.getElementById("menu-chat-ul").style.display = "none";
    globalThis.menu_id = "search_text_div";
}


function answer_color (src){
    window.location.hash = "#" + src;
    var mess = document.getElementById(src);
    mess.style.background = "#6666ff";
    setTimeout(function() {
    if (mess.className == "my-message"){
        mess.style.background = "#D1E7DD";
    } else{
        mess.style.background = "#CFF4FC";
    }
}, 2000);
}


function set_username_tg(){
    var global_menu_d = document.getElementById("global_menu_d");
    global_menu_d.style.display = "block";
    var global_menu = document.getElementById("global_menu");
    global_menu.innerHTML = `<button onclick="close_global_menu()" type="button" class="btn-close gl-btn-close" aria-label="Close"></button>`;
    var btn1 = document.createElement("button");
    btn1.textContent = "Добавить/изменить";
    btn1.setAttribute("onclick", "submit_username_tg()");
    btn1.classList = "edit-btn";
    var input_tg = document.createElement("input");
    input_tg.id = "tg_input";
    var h1_tg = document.createElement("p");
    h1_tg.classList = "cont-ul";
    h1_tg.textContent = "Напишите свой username в текстовое поле ниже, а затем напишите нашему тг боту @Kazbek_messenger_bot";
    global_menu.appendChild(h1_tg);
    global_menu.appendChild(input_tg);
    global_menu.appendChild(btn1);
}

function leave_chat(chat_id){
    socket.emit('leave', {room: chat_id});
        if (Number(chat_id)){
            document.getElementById("chat" + chat_id).style.background =  "white";
        } else {
            document.getElementById("my_chat" + id_user).style.background =  "white";
        }
}


function close_edit() {
    globalThis.edit_id = "";
    globalThis.edit_flag = false;
    document.getElementById("edit-label").style.display = "none";
}


function exit_watch_menu(){
    document.getElementById("watch").style.display = "none";
    document.getElementById("carousel_left").style.display = "none";
    document.getElementById("carousel_right").style.display = "none";
}



function open_menu_chat(chat_id){
    exit_menu();
    globalThis.menu_id = "menu_chat" + chat_id;
    if (document.getElementById("menu_chat" + chat_id)){
        document.getElementById("menu_chat" + chat_id).style.display = "block";
    }else {
        var div = document.createElement("div");
        var ul = document.createElement("ul")
        var btn = document.createElement("li")
        div.classList = "context-menu-open";
        div.id = "menu_chat" + chat_id;
        div.style.display = "block";
        if (!document.getElementById("chat_pinned" + chat_id)){
            btn.textContent = "Закрепить";
            btn.setAttribute("onclick", `pin_chat('${chat_id}')`);
        } else {
            btn.textContent = "открепить";
            btn.setAttribute("onclick", `unpin_chat('${chat_id}')`);
        }
        ul.appendChild(btn)
        div.appendChild(ul)
        document.getElementById("n_c" + chat_id).appendChild(div)
    }
}


function exit_menu(){
    if (globalThis.menu_id != ""){
        try{
            document.getElementById(globalThis.menu_id).style.display = "none";
        } catch (error){}
        globalThis.menu_id = "";
    }
}


function exit_chat(){
    var st_chat = document.getElementById("chat_id").value;
    try {
        document.getElementById("menu_chat_div_all").style.display = "none";
        document.getElementById('menu-chat-ul').innerHTML = '';
    } catch(e){}
    document.getElementById("ident").textContent = "";
    document.getElementById("pinned").innerHTML = "";
    document.getElementById("images_list").textContent = "";
    socket.emit('leave', {room: st_chat});
    if (st_chat){
        if (Number(st_chat)){
            document.getElementById("chat" + st_chat).style.background =  "white";
        } else {
            document.getElementById("my_chat" + st_chat.slice(2)).style.background =  "white";
        }
    };
    document.getElementById('icon_c_chat').innerHTML = "";
    document.getElementById("content").innerHTML = "";
    document.getElementById('name_chat').innerText = "";
    document.getElementById('chat_id').value = "";
    document.getElementById('form').style.display = "none";
    document.getElementById("btn_down").style.display = 'none';
    if (globalThis.mobile) {
        document.getElementById("plus_btn").style.display = "block";
        document.getElementById("background-img").style.display = "none";
        document.getElementById("container-mess").style.display = "none";
        document.getElementById("settings_btn").style.display = 'block';
        document.getElementById("button").style.visibility = 'hidden';
        document.getElementById("email").style.display = "block";
    }
}


function close_global_menu(){
    document.getElementById("global_menu_d").style.display = "none";
    document.getElementById("global_menu").innerHTML = "";
}


function add_voting_item(number){
    let cnt_voting_items = document.getElementById("cnt_voting_items");
    cnt_voting_items.value = Number(cnt_voting_items.value) + 1;
    let items_cont = document.getElementById("items_cont");
    let new_item = document.createElement("div");
    let flex_div = document.createElement("div");
    let h4 = document.createElement("h4");
    h4.textContent = "Ответ " + number;
    new_item.id = "voting_item" + number;
    let input = document.createElement("input");
    let delete_btn = document.createElement("button");
    input.id = "item_text" + number;
    input.classList = "form-control";
    delete_btn.textContent = "-";
    delete_btn.classList = "btn btn-danger"
    delete_btn.setAttribute("onclick", `delete_answer_voting(${number + 1})`)
    flex_div.classList = 'voting-item';
    flex_div.appendChild(input);
    flex_div.appendChild(delete_btn);
    new_item.appendChild(h4);
    new_item.appendChild(flex_div);
    items_cont.appendChild(new_item);
    document.getElementById("add_new_item_btn").setAttribute("onclick", `add_voting_item(${number + 1})`);
}


function gener_voting_create(){
    document.getElementById("global_menu_d").style.display = "block";
    let cont = document.getElementById("global_menu");
    cont.innerHTML = `
        <input id="cnt_voting_items" style="display: none;">
        <h1>Опрос</h1>
        <div class="voting-cont">
        <textarea  class="form-control" aria-label="With textarea" placeholder="Вопрос" id="title_voting"></textarea>
        </div>
        <div id="items_cont" class="cont-ul voting-cont">
        </div>
        <div class="voting-cont">
        <button id="add_new_item_btn" class="btn btn-primary" onclick="add_voting_item(2)">добавить ответ</button>
        <button class="btn btn-primary" onclick="send_create_voting()">Отправить</button>
        </div>`;

    add_voting_item(1);
}