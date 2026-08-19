            // Connect to SocketIO server
const socket = io.connect();


function set_emoji(id_mess, id_emoji){
    var div = document.getElementById(id_mess + "emoji_btn_id" + id_emoji);
    if (div) {
        if (div.style.background == "#6699cc"){
            document.getElementById(menu_id).style.display = "none";
            globalThis.menu_id = '';
            alert(500);
            return 500;
        }
    }
    var chat_id =  document.getElementById("chat_id").value;
    socket.emit('emoji', {chat_id: chat_id, id_mess: id_mess, value: id_emoji});
    if (menu_id){
        document.getElementById(menu_id).style.display = "none";
        globalThis.menu_id = '';
    }
}


function send_io_mess() {
    const input = document.getElementById('about');
    const chat_id = document.getElementById('chat_id').value;
    const message = input.value;
    const html2 = document.getElementById('html_m');
    const html_m = html2.value;
    if (message) {
        // Send message to server
        if (Number(chat_id)){
            socket.emit('room_message', {room: chat_id, message: message, html: html_m });
        } else {
            socket.emit('my_message', {room: chat_id.slice(2), message: message, html: html_m });
        }
        input.value = '';
        html2.value = '';
    }
}


function send_sticker(path){
    socket.emit("send_sticker", {chat_id: document.getElementById("chat_id").value, html: `<img src="/static/img/emoji${path}" class="mess-img">`})
}

            // Listen for messages from server
socket.on('message', (data) => {
    if (document.getElementById("chat_id").value == ""){
        return;
    }
    const messagesDiv = document.getElementById('content');
    document.getElementById("last_mess_id").value = data["id_m"];
    set_read(document.getElementById("chat_id").value);
    var other = 1;
    if (id_user == data["id_sender"]){
        var other = 0;
    }
    if (data["type"] == 3){
        gener_sticker(data["id_m"], data["time"].split(".")[0], data["html"], other, 0, data["name"], 0);
    } else{
        gener_html(data["id_m"], data["message"], data["time"], data["html"], data["file2"], other, data["read"],
         data["name"], data["pinned"])
    }
});


socket.on('create_chat', (data) => {
    gener_chat("email", data["chat_id"], data["name"], 1, data["is_primary"], "set_recipient", {"time" : "2023-01-01 00:00:00.0"});
});

//, html_m, other, text
socket.on('emoji_client', (data) => {
    gener_emoji(data["id_emoji"], data["id_mess"], !(data["id_sender"] == id_user), data['value'])
});


socket.on('delete_chat', (data) => {
    if (document.getElementById("chat_id") == data["chat_id"]){
        exit_chat();
    }
    document.getElementById("chat" + data["chat_id"]).remove();
});


socket.on('delete_message', (data) => {
    document.getElementById("m" + data["message_id"]).remove();
    console.log("m" + data["message_id"]);
});


socket.on('un_pinned_message', (data) => {
    delete_pin_message(data["id_mess"]);
});


socket.on('pinned_message', (data) => {
    add_pinned(data["id_mess"], first=true);
});


socket.on('delete_emoji', (data) => {
    document.getElementById(`${data["message_id_on_emoji"]}emoji_btn_id${data["id_emoji"]}`);
    var btn = document.getElementById(data["message_id_on_emoji"] + "emoji_btn_id" + data["id_emoji"]);
    if (data['id_sender'] == id_user){
        btn.style.background = "#91b3f2";
        btn.setAttribute("onclick", `set_emoji(${data["message_id_on_emoji"]}, ${data["id_emoji"]})`);
    }
    console.log(btn.textContent);
    if (btn.textContent.length  && Number(btn.textContent.split(" ")[1])){
        btn.textContent = emoji[data["id_emoji"]] + (Number(btn.textContent.split(" ")[1]) - 1);
    } else {
        var em_div = document.getElementById("em" + data["message_id_on_emoji"]);
        btn.remove();
    }
})



socket.on('join_event', (data) => {
    if (id_user != data["id_user"]){
        const div_ = document.getElementById("ident");
        div_.textContent = "(в сети)";
    }


});

socket.on('leave_event', (data) => {
    if (id_user != data["id_user"]){
        const div_ = document.getElementById("ident");
        div_.textContent = "";
    }
});


socket.on('edit_message', (data) => {
   document.getElementById("text" + data["id_mess"]).textContent = data["new_text"];
});

socket.on('connect', () => {
    var chat_id = document.getElementById("chat_id");
    if (chat_id.value != ""){
        socket.emit('join', {room: chat_id.value});
        get_new_message_id();
    }
});


socket.on('disconnect', () => {
//    alert("disconnect");
});


socket.on('set_read', (data) => {
    update_read_message(data["id_mess"]);
});


socket.on('message_other', (data) => {
    var rn = document.getElementById("rn" + data["chat_id"]);
    rn.style.display = "block";
    rn.innerText =  Number(rn.innerText) + 1;
    if (document.getElementById("chat_id").value != data["chat_id"]){
        notification(data["text"], data["chat_name"]);
        if (mobile){
            try {
                android.send_my_alert(`${data["chat_name"]}
                ${data["text"]}`);
            } catch(error){
//                console.log("Не приложение")
            }
        }
        var  last_m = document.getElementById("last_m" + data["chat_id"]);
        var  time = document.getElementById("last_time" + data["chat_id"]);
        if (data["text"] && data["text"].length > 16){
                last_m.textContent = data["text"].slice(0, 16) + "...";
        } else {
                last_m.textContent = data["text"];
        }
        time.textContent = data["time"].slice(0, 5);
}
});


socket.on('send_call', (data) => {
//    убирает повторный вызов для инициатора звонка
    console.log(data);
    if (data["user_id"] != id_user){
        gener_UI_call(2, data["name_call"], data["chat_id"]);
        playAudio();
    }
});


socket.on("send_call_by_number", data => {
//    if (data["current_user"] != id_user){
    callToNode(data["data"]["number"]);
//    }
})
