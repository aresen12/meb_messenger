function update_read_message(id_mess){
    let div = document.getElementById("mr" + id_mess);
    div.textContent = 'ᨒ';
    div.setAttribute("title", "прочитано");
}


function add_pinned(id_mess, first=false){
    const pin_div = document.getElementById("pinned");
    if (pin_div.innerHTML == ""){
        btn = document.createElement("button");
        btn.textContent += document.getElementById("text" + id_mess).textContent.trim()
        btn.id = "pin_btn";
        btn.classList = "info-btn pinned-btn";
        btn.setAttribute("onclick", `go_pin('${id_mess}')`);
        pin_div.appendChild(btn);
        var btn_close = document.createElement("button");
        btn_close.classList = "btn-close";
        btn_close.setAttribute("aria-label", "Close");
        btn_close.setAttribute("onclick", `un_pinned("${id_mess}")`);
        btn_close.id = "close_pin";
        document.getElementById("list_pin").value = id_mess;
        pin_div.appendChild(btn_close);
    } else {
        if (first){
            let list_pin = document.getElementById("list_pin");
            let v = list_pin.value;
            list_pin.value = id_mess + " " + v;
            btn = document.getElementById("pin_btn");
            btn.textContent = document.getElementById("text" + id_mess).textContent.trim();
            let btn_close = document.getElementById("close_pin");
            btn_close.setAttribute("onclick", `un_pinned("${id_mess}")`);
            btn.setAttribute("onclick", `go_pin('${id_mess}')`);
        } else{
            document.getElementById("list_pin").value += " " + id_mess;
        }

    }
}


function delete_pin_message(mess_id){
    var list_pin = document.getElementById("list_pin").value.trim().split(" ");
    if (list_pin.length == 1){
        document.getElementById("pinned").innerHTML = "";
    } else {
        go_pin(mess_id);
        list_pin.splice(list_pin.indexOf(mess_id), 1);
        document.getElementById("list_pin").value = list_pin.join(" ");
    }
}


function unset_emoji(id_message){
    delete_mess(id_message);
}


function gener_emoji(id_mess, html_m, other, id_emoji){
    var em_div = document.getElementById("em" + html_m);
//    em_div.classList = "emoji";
    if (document.getElementById(html_m + "emoji_btn_id" + id_emoji)){
        var btn = document.getElementById(html_m + "emoji_btn_id" + id_emoji);
        if (btn.textContent.length  && Number(btn.textContent.split(" ")[1])){
            btn.textContent = `${emoji[id_emoji]} ${(Number(btn.textContent.split(" ")[1]) + 1)}`;
        } else {
              btn.textContent = emoji[id_emoji] + " 2";
        }
    } else {
        var btn = document.createElement("button");
        btn.textContent = emoji[id_emoji];
        btn.classList = "info-btn emoji";
        btn.id = html_m + "emoji_btn_id" + id_emoji;
        em_div.appendChild(btn);
    }
    if (!other){
            btn.style.background = "#3574e8";
             btn.setAttribute("onclick", `unset_emoji(${id_mess})`);
    } else {
        if (btn.style.background != "#3574e8") {
            btn.setAttribute("onclick", `set_emoji(${html_m}, ${id_emoji})`);
        }
    }
}


function open_menu_mess(id_mess){
    if (document.getElementById("watch").style.display == "block"){
        return 200;
    }
    var chat_id = document.getElementById("chat_id").value;
    var name_functions = ["answer", "send", "pinned", "delete_mess", "copyToClipboard"];
    var titles = ["ответить", "переслать", "закрепить", "удалить", "скопировать"];
    var ul = document.createElement("ul");
    ul.id = "ul_on_menu"  + id_mess.slice(1);
    const curr_m = document.getElementById("m" + id_mess);
    if (mobile && curr_m.style.display == "block") {
        return 200;
    }
    if (globalThis.menu_id != ""){
        try{
        exit_menu();
        } catch(err) {}
    };
    for (let i = 0; i < name_functions.length; i++){
        var li = document.createElement("li");
        li.textContent = titles[i];
        li.setAttribute("onclick", `${name_functions[i]}(${id_mess.slice(1)}, "${chat_id}")`);
        ul.appendChild(li);
    }
    if (document.getElementById(id_mess).className == "my-message") {
        var li = document.createElement("li");
        li.textContent = "редактировать";
        li.setAttribute("onclick", `edit(${id_mess.slice(1)})`);
        ul.appendChild(li);
    }
    const emoji_div2 = document.createElement("div");
    emoji_div2.id = "emoji" + id_mess.slice(1);
    for (let i = 0; i < 4; i++){
        var btn_emoji = document.createElement("button");
        btn_emoji.classList = "info-btn emoji-button";
        btn_emoji.textContent = emoji[i];
        btn_emoji.setAttribute("onclick", `set_emoji(${id_mess.slice(1)}, ${i})`);
        emoji_div2.appendChild(btn_emoji);
    }
    var btn_emoji = document.createElement("button");
        btn_emoji.classList = "info-btn emoji-button";
        btn_emoji.textContent = "⋁";
        btn_emoji.setAttribute("onclick", `show_more_emoji(${id_mess.slice(1)})`);
        emoji_div2.appendChild(btn_emoji);
    //⋎∨⋁
    if (id_mess[0] == "e"){
        id_mess = id_mess.substring(1, id_mess.length);
    }
    curr_m.innerHTML = "";
    curr_m.appendChild(emoji_div2);
    curr_m.appendChild(ul);
    globalThis.menu_id = "m" + id_mess;
    showdiv1("m" + id_mess);
    window.location.hash = "#m" + id_mess;
}


function gener_sticker(id_m, time, html_m, other, read, name_sender){
     if (other && !read && !vis){
                notification("стикер", document.getElementById('name_chat').innerText);
            }
     const messagesDiv = document.getElementById('content');
     const messageItem = document.createElement('div');
    if (other) {
        messageItem.classList = 'message-other';
    } else{
        messageItem.classList = 'my-message';
    };
    const message_text = document.createElement('p');
    message_text.classList = "text-in-mess";
    message_text.id = 'text' + id_m;
    const html_text = document.createElement('div');
    html_text.innerHTML = html_m;
    var em_div = document.createElement("div");
    em_div.id = "em" + id_m;
    messageItem.appendChild(html_text);
    messageItem.appendChild(message_text);
    messageItem.appendChild(em_div);
    messageItem.role = "alert";
    var onclick = "";
    if (mobile){
        messageItem.setAttribute("onclick", `open_menu_mess('m${id_m}')`);
    }
     const time_div = document.createElement('p');
     time_div.classList = "time-mess";
     if (other){
        time_div.textContent = time + " " + name_sender;
     }else{
        time_div.textContent = time;
     }
     messageItem.appendChild(time_div);
    if (read){
        time_div.innerHTML += '<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="прочитано">ᨒ</button>';
    } else{
        time_div.innerHTML += '<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="доставлено">ᨈ</button>';
    }
    const menu_con = document.createElement("div");
    menu_con.style.display = "none";
    menu_con.classList.add("context-menu-open");
    menu_con.id = "mm" + id_m;
    messageItem.appendChild(menu_con);
    messageItem.id = 'm' + id_m;
    messageItem.style.background = "none";
    messageItem.style.color = "white";
    messagesDiv.appendChild(messageItem);
     scrollToBottom("content");
}


function go_to_message(id_mess){
    var mess = document.getElementById('m' + id_mess);
    mess.style.background = "#6666ff";
    setTimeout(function() {
        if (mess.className == "my-message"){
            mess.style.background = "#D1E7DD";
        } else{
            mess.style.background = "#CFF4FC";
        }
    }, 2000);
    window.location.hash = "#m" + id_mess;
    var list_pin = document.getElementById("list_search_id_message").value.trim().split(" ");
    for (let i = 0; i < list_pin.length; i++){
        if (list_pin[i] == id_mess){
            document.getElementById("cnt_search_m").textContent = `${i + 1} из (${list_pin.length})`;
            const btn_up = document.getElementById('btn_search_up');
            var btn_down = document.getElementById("btn_search_down");
            if (0 <= i - 1 && i + 1 < list_pin.length){
                btn_down.setAttribute('onclick', `go_to_message('${list_pin[i - 1]}')`);
                btn_up.setAttribute('onclick', `go_to_message('${list_pin[i + 1]}')`);
            } else if (0 > i - 1){
                   btn_up.setAttribute('onclick', `go_to_message('${list_pin[1]}')`);
                btn_down.setAttribute('onclick', `go_to_message('${list_pin[list_pin.length - 1]}')`);
            } else {
                btn_up.setAttribute('onclick', `go_to_message('${list_pin[0]}')`);
                btn_down.setAttribute('onclick', `go_to_message('${list_pin[0]}')`);
            }
        }
    }
}


function gener_html(id_m, text, time, html_m, file_, other, read, name_sender, pinned) {
    document.getElementById("last_mess_id").value = id_m;
     if (other && !read && !vis){
                notification(text, document.getElementById('name_chat').innerText);
            }
     const messagesDiv = document.getElementById('content');
     const messageItem = document.createElement('div');
    images = ["bmp", "jpg", "png", "svg", "webp", "jpeg"]
    audio = ["mp3", "flac", "m4a"]
    video = ["mp4", "mov"]
    if (other) {
        messageItem.classList = 'message-other';
    } else{
        messageItem.classList = 'my-message';
    };
    const message_text = document.createElement('p');
    message_text.textContent = text;
    message_text.classList = "text-in-mess";
    message_text.id = 'text' + id_m;
    const html_text = document.createElement('div');
    if (html_m != ""){
        html_text.innerHTML = html_m;
    }
    var em_div = document.createElement("div");
    em_div.id = "em" + id_m;
    messageItem.appendChild(html_text);
    messageItem.appendChild(message_text);
    messageItem.appendChild(em_div);
    messageItem.role = "alert";
    var onclick = "";
    if (mobile){
        messageItem.setAttribute("onclick", `open_menu_mess('m${id_m}')`);
    }
    if (file_){
        var ras = file_[1].split(".");
        ras = ras[ras.length - 1];
        if (images.includes(ras)){
            var images_list = document.getElementById("images_list");
            if (images_list.value == ""){
                images_list.value = file_[1];
            } else {
                images_list.value += " " + file_[1];
            }
            const button = document.createElement('button');
            button.classList = "info-btn";
            button.setAttribute("onclick", `showImg('m${id_m}', '${file_[1]}')`);
            const img_elem = document.createElement('img');
            img_elem.classList = "mess-img";
            img_elem.src = "/static/img/" + file_[1];
            button.appendChild(img_elem);
            messageItem.appendChild(button);
        } else {
             if (audio.includes(ras)){
                 var w = window.innerWidth * 0.187;
                 if (mobile){
                        w = window.innerWidth * 0.57;
                 };
                 const audio2 = document.createElement("audio");
                 audio2.classList = "audio";
                 audio2.src = '/static/img/' + file_[1];
                 audio2.textContent = file_[0];
                 audio2.style.width = w + 'px';
                 audio2.controls = 'controls';
                 messageItem.appendChild(audio2);
            }else {
                if (video.includes(ras)){
                    var w = window.innerWidth * 0.18;
                    if (mobile){
                        w = window.innerWidth * 0.57;
                    };
                    const video = document.createElement("video");
                    video.classList = "audio";
                    video.controls = 'controls';
                     video.src = '/static/img/' + file_[1];
                  video.textContent = file_[0];
                     video.style.width = w + 'px';
                 messageItem.appendChild(video);
                } else{
                    const a_ = document.createElement('a');
                    a_.classList = "my-a";
                    a_.href = '/static/img/' + file_[1];
                    a_.textContent = file_[0];
                    a_.setAttribute('download', file_[0]);
                    messageItem.appendChild(a_);
                }
        }
    }
    };
     const time_div = document.createElement('p');
     time_div.classList = "time-mess";
     if (other){
        time_div.textContent = time + " " + name_sender;
     }else{
        time_div.textContent = time;
     }
     messageItem.appendChild(time_div);
    if (read){
        time_div.innerHTML += '<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="прочитано">ᨒ</button>';
    } else{
        time_div.innerHTML += `<button id="mr${id_m}" type="button" class="info-btn "
         data-bs-toggle="tooltip" data-bs-placement="top" title="доставлено">ᨈ</button>`;
    }
    const menu_con = document.createElement("div");
    menu_con.style.display = "none";
    menu_con.classList.add("context-menu-open");
    menu_con.id = "mm" + id_m;
    messageItem.appendChild(menu_con);
    messageItem.id = 'm' + id_m;
//    document.getElementById("content").innerHTML += new_mess;
    messagesDiv.appendChild(messageItem);
     scrollToBottom("content");
     if(pinned){
        add_pinned(id_m);
        messagesDiv.style.height = "100%";
     }
}


function go_pin(id_mess){
    var mess = document.getElementById('m' + id_mess);
    mess.style.background = "#6666ff";
    setTimeout(function() {
        if (mess.className == "my-message"){
            mess.style.background = "#D1E7DD";
        } else{
            mess.style.background = "#CFF4FC";
        }
    }, 2000);
    window.location.hash = "#m" + id_mess;
    var list_pin = document.getElementById("list_pin").value.trim().split(" ");
    for (let i = 0; i < list_pin.length; i++){
        if (list_pin[i] == id_mess){
            const btn = document.getElementById('pin_btn');
            var btn_close = document.getElementById("close_pin");
            if (i + 1 < list_pin.length){
                btn.textContent = document.getElementById('text' + list_pin[i + 1]).textContent;
                btn.setAttribute('onclick', `go_pin('${list_pin[i + 1]}')`);
                btn_close.setAttribute('onclick', `un_pinned('${list_pin[i + 1]}')`);
            } else {
                btn.textContent = document.getElementById('text' + list_pin[0]).textContent;
                btn.setAttribute('onclick', `go_pin('${list_pin[0]}')`);
                btn_close.setAttribute('onclick', `un_pinned('${list_pin[0]}')`);
            }
        }
    }

}

function gener_in_voting(id_mess, in_voting, data, all_cnt, i){
    let div = document.createElement("div");
    if (in_voting){
            let div2 = document.createElement("div");
            div2.style.display = "flex";
            let div3 = document.createElement("div");
            let progress = document.createElement("progress");
            let label = document.createElement("label");
            label.textContent = data["voting"][i]["text"];
            div3.textContent = `${((data["voting"][i]["cnt"].length / all_cnt) * 100).toFixed(0)}%`;
            div3.id = `math_v${id_mess}_${i}`;
            progress.id = `pr_${id_mess}_${i}`;
            if (all_cnt != 0){
                progress.value = data["voting"][i]["cnt"].length / all_cnt;
            } else {
                progress.value = 0;
            }
            div.appendChild(label);
            div2.appendChild(progress);
            div2.appendChild(div3);
            div.appendChild(div2);
        }else{
            let button = document.createElement("button");
            button.innerHTML = `
    <input class="form-check-input mt-0" type="radio" value="" aria-label="Radio button for following text input">
    ${data["voting"][i]["text"]}`;
            button.classList = "btn";
            button.setAttribute("onclick", `voting(${id_mess}, ${i})`);
            div.appendChild(button);
        }
            return div;
}


function voting_show(id_mess, data){
    let tp = document.getElementById(`pr_${id_mess}_${1}`);
    let in_last = false;
    if (tp){
        in_last = true;
    }
    let in_voting = false;
    let all_cnt = 0;
    for (let i = 0; i < data["voting"].length; i++){
        all_cnt += data["voting"][i]["cnt"].length;
        if (data["voting"][i]["cnt"].includes(id_user)){
            in_voting = true;
        }
    }
    let html_text = document.getElementById(`h${id_mess}`);
    if (!in_last){
        html_text.innerHTML = '';
    }
    for (let i = 0; i < data["voting"].length; i++){
        if (in_last){
            let progress = document.getElementById(`pr_${id_mess}_${i}`);
            progress.value = data["voting"][i]["cnt"].length / all_cnt;
            let text_div = document.getElementById(`math_v${id_mess}_${i}`);
            text_div.textContent = `${((data["voting"][i]["cnt"].length / all_cnt) * 100).toFixed(0)}%`;
        } else{
            html_text.appendChild(gener_in_voting(id_mess, in_voting, data, all_cnt, i));
        }
    }
}


function gener_voting(id_mess, text, data, other, read, name_sender, time){
     const messagesDiv = document.getElementById('content');
     const messageItem = document.createElement('div');
    if (other) {
        messageItem.classList = 'message-other';
    } else{
        messageItem.classList = 'my-message';
    };
    const message_text = document.createElement('p');
    message_text.classList = "text-in-mess text-voting";
    message_text.id = 'text' + id_mess;
    message_text.textContent = text;
    const html_text = document.createElement('div');
    let in_voting = false;
    let all_cnt = 0;
    for (let i = 0; i < data["voting"].length; i++){
        all_cnt += data["voting"][i]["cnt"].length;
        if (data["voting"][i]["cnt"].includes(id_user)){
            in_voting = true;
        }
    }
    for (let i = 0; i < data["voting"].length; i++){
        html_text.appendChild(gener_in_voting(id_mess, in_voting, data, all_cnt, i))
    }
    var em_div = document.createElement("div");
    em_div.id = "v" + id_mess;
    html_text.id = `h${id_mess}`;
    messageItem.appendChild(em_div);
    messageItem.appendChild(message_text);
    messageItem.appendChild(html_text);
    messageItem.role = "alert";
     const time_div = document.createElement('p');
     time_div.classList = "time-mess";
     if (other){
        time_div.textContent = time + " " + name_sender;
     }else{
        time_div.textContent = time;
     }
     messageItem.appendChild(time_div);
    if (read){
        time_div.innerHTML += '<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="прочитано">ᨒ</button>';
    } else{
        time_div.innerHTML += `<button id="mr${id_mess}" type="button" class="info-btn "
         data-bs-toggle="tooltip" data-bs-placement="top" title="доставлено">ᨈ</button>`;
    }
    const menu_con = document.createElement("div");
    menu_con.style.display = "none";
    menu_con.classList.add("context-menu-open");
    menu_con.id = "mm" + id_mess;
    messageItem.appendChild(menu_con);
    messageItem.id = 'm' + id_mess;
    messagesDiv.appendChild(messageItem);
    scrollToBottom("content");
}