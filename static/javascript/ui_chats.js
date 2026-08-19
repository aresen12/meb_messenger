function open_menu_in_chat(){
    document.getElementById("menu-chat").style.display = "block";
    var search_div = document.getElementById("search_text_div");
    search_div.style.display = "block";
    if (search_div){
        search_div.style.display = "none";
        document.getElementById("search_text").value = "";
       document.getElementById("menu-chat-ul").style.display = "block";
    }
}


function gener_icon_chat(name_chat, chat_id, id_div, color){
    document.getElementById(id_div).style.width = icon_size + "px";
    if (!color){
        var color = random_colors[Math.floor(Math.random() * random_colors.length)];
    }
    const svg =
            d3.select("#" + id_div).
            append('svg').
            attr('height', `${icon_size}`).
            attr('width', `${icon_size}`)
            var circle = svg.append("circle") .attr("cx", icon_size / 2)
            .attr("cy", icon_size / 2) .attr("r", icon_size / 2)
             .attr("fill", color);
        var text = svg.append("text") .attr("x", circle.attr("cx") - 3) .attr("y", circle.attr("cy") - 3)
         .attr("dy", "0.35em") .text(name_chat[0]);
}

function gener_chat(id_div, chat_id, name_chat, status, primary, command, last_mess, pinned, admin){
    const cont = document.getElementById(id_div);
    get_read(chat_id);
    const btn = document.createElement('button');
    btn.id = 'chat'+ chat_id;
    btn.classList = "a-email";
    if (command == "set_recipient"){
        btn.setAttribute("onclick",`set_recipient('${chat_id}', ${primary}, '${name_chat}', ${status}, ${pinned})`);
    } else {
        btn.setAttribute("onclick",`send_of('${chat_id}', ${command}, '${name_chat}',  ${pinned})`);
    }
    let last_mess_div = document.createElement("div");
    let last_rn_div = document.createElement("div");
    let last_time = document.createElement("div");
    last_rn_div.classList = "rn-time";
    last_rn_div.appendChild(last_time);
    if (command == "set_recipient"){
        last_mess_div.id = "last_m" + chat_id;
        last_time.id = "last_time" + chat_id;
    }
    if (last_mess["time"] != "2023-01-01 00:00:00.0"){
        last_time.textContent = last_mess["time"].slice(11, 16);
        last_time.classList = "time-in-chat";
    }
    if (pinned){
        var div_pinned = document.createElement('div');
        div_pinned.style.display = "inline-block"
        div_pinned.id = "chat_pinned" + chat_id;
        div_pinned.innerHTML += `<svg fill="#b3b3b3" width="${icon_size / 2.6}px" height="${icon_size / 2.6}px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="icon">
  <path d="M878.3 392.1L631.9 145.7c-6.5-6.5-15-9.7-23.5-9.7s-17 3.2-23.5 9.7L423.8 306.9c-12.2-1.4-24.5-2-36.8-2-73.2 0-146.4 24.1-206.5 72.3-15.4 12.3-16.6 35.4-2.7 49.4l181.7 181.7-215.4 215.2a15.8 15.8 0 0 0-4.6 9.8l-3.4 37.2c-.9 9.4 6.6 17.4 15.9 17.4.5 0 1 0 1.5-.1l37.2-3.4c3.7-.3 7.2-2 9.8-4.6l215.4-215.4 181.7 181.7c6.5 6.5 15 9.7 23.5 9.7 9.7 0 19.3-4.2 25.9-12.4 56.3-70.3 79.7-158.3 70.2-243.4l161.1-161.1c12.9-12.8 12.9-33.8 0-46.8z"/>
</svg>`;
        last_time.appendChild(div_pinned);
    }
    if (last_mess["type"] == 2){
        last_mess_div.textContent = emoji[last_mess["text"]];
    } else {
        if (primary){
            if (last_mess["text"] && last_mess["text"].length > 16){
                last_mess_div.textContent = last_mess["text"].slice(0, 16) + "...";
            } else {
                last_mess_div.textContent = last_mess["text"];
            }
    } else {
        if (last_mess["text"] && last_mess["text"].length > 12){
                last_mess_div.textContent = last_mess["name_sender"] + ": " + last_mess["text"].slice(0, 12) + "...";
            } else {
                last_mess_div.textContent = last_mess["name_sender"] + ": " + last_mess["text"];
            }
        }
    }
    last_mess_div.classList = "last-mess";
    const rn = document.createElement('div');
    rn.classList = "r-n";
    rn.id = 'rn' + chat_id;
    rn.style.display = "none";
    last_rn_div.appendChild(rn);
    var icon_chat = document.createElement('div');
    icon_chat.id = "icon_chat" + command + chat_id;
    const name_chat_div = document.createElement('div');
    name_chat_div.id = "n_c" + chat_id;
    name_chat_div.textContent = name_chat;
    if (admin){
        name_chat_div.innerHTML += `<svg width="${icon_size / 2.6}px" height="${icon_size / 2.6}px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet"><circle cx="32" cy="32" r="30" fill="#4bd37b"></circle><path fill="#ffffff" d="M46 14L25 35.6l-7-7.2l-7 7.2L25 50l28-28.8z"></path></svg>`;
    }
    name_chat_div.classList = "n-c";
    name_chat_div.appendChild(last_rn_div);
    name_chat_div.appendChild(last_mess_div);
    btn.appendChild(icon_chat);
    btn.appendChild(name_chat_div);
    cont.appendChild(btn);
    gener_icon_chat(name_chat[0], chat_id, "icon_chat" + command + chat_id);
    $(`#chat${chat_id}`).on('contextmenu','div', function(e) { //Get li under ul and invoke on contextmenu
        e.preventDefault(); //Preventdefaults
        open_menu_chat(`${chat_id}`); //alert the id

        });
}


function gener_my_chat(id_div, command, last_mess, chat_id, pinned){
    const cont = document.getElementById(id_div);
    const btn = document.createElement('button');
    btn.id = 'my_chat' + id_user;
    btn.classList = "a-email";
    if (command == "set_recipient"){
        btn.setAttribute("onclick",`set_my_recipient('${chat_id}')`);
    } else {
        btn.setAttribute("onclick",`my_send_of('${chat_id}', ${command})`);
    }
    let last_mess_div = document.createElement("div");
    let last_time = document.createElement("div");
    if (last_mess["time"] != "2023-01-01 00:00:00.0"){
    last_time.textContent = last_mess["time"].slice(11, 16);;
    last_time.classList = "rn-time time-in-chat";
    }
    if (pinned){
        var div_pinned = document.createElement('div');
        div_pinned.style.display = "inline-block"
        div_pinned.id = "chat_pinned" + chat_id;
        div_pinned.innerHTML += `<svg fill="#b3b3b3" width="${icon_size / 2.6}px" height="${icon_size / 2.6}px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="icon">
  <path d="M878.3 392.1L631.9 145.7c-6.5-6.5-15-9.7-23.5-9.7s-17 3.2-23.5 9.7L423.8 306.9c-12.2-1.4-24.5-2-36.8-2-73.2 0-146.4 24.1-206.5 72.3-15.4 12.3-16.6 35.4-2.7 49.4l181.7 181.7-215.4 215.2a15.8 15.8 0 0 0-4.6 9.8l-3.4 37.2c-.9 9.4 6.6 17.4 15.9 17.4.5 0 1 0 1.5-.1l37.2-3.4c3.7-.3 7.2-2 9.8-4.6l215.4-215.4 181.7 181.7c6.5 6.5 15 9.7 23.5 9.7 9.7 0 19.3-4.2 25.9-12.4 56.3-70.3 79.7-158.3 70.2-243.4l161.1-161.1c12.9-12.8 12.9-33.8 0-46.8z"/>
</svg>`;
        last_time.appendChild(div_pinned);
    }
    if (last_mess["type"] == 2){
        last_mess_div.textContent = emoji[last_mess["text"]];
    } else {
        if (last_mess["text"] && last_mess["text"].length > 12){
            last_mess_div.textContent = last_mess["name_sender"] + ": " + last_mess["text"].slice(0, 12) + "...";
        } else {
            last_mess_div.textContent = last_mess["name_sender"] + ": " + last_mess["text"];
        }
    }
    last_mess_div.classList = "last-mess";
    const icon_chat = document.createElement('div');
    icon_chat.id = "icon_chat" + command + chat_id;
    const name_chat_div = document.createElement('div');
    name_chat_div.id = "n_c" + chat_id;
    name_chat_div.textContent = "Избранное";
    name_chat_div.classList = "n-c";
     name_chat_div.appendChild(last_time);
    name_chat_div.appendChild(last_mess_div);
    btn.appendChild(icon_chat);
    btn.appendChild(name_chat_div);
    cont.appendChild(btn);
    gener_icon_chat("И", chat_id, "icon_chat" + command + chat_id, "#7b68ee")
     $(`#my_chat${id_user}`).on('contextmenu','div', function(e) { //Get li under ul and invoke on contextmenu
//        alert("Для избранного в разработке!")
        e.preventDefault(); //Preventdefaults
        open_menu_chat(`${chat_id}`); //alert the id
        });
}


get_chats('email', "set_recipient");