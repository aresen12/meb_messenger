function send_call(primary){
    var chat_id = document.getElementById("chat_id").value;
    gener_jitsi();
//    для первичного чата
    if (primary){
        socket.emit('send_call_to_user', {chat_id: chat_id, user_id: id_user});
    }
}


// type 1 исходящий
//type 2 входящий
function gener_UI_call(type, name_call, chat_id){
    document.getElementById("global_menu_d").style.display = "block";
    var global_menu = document.getElementById("global_menu");
    global_menu.innerHTML = "";
    status_div = document.createElement("div");
    global_menu.appendChild(status_div);
    var width_video = screen.availWidth;
    if (mobile){
        global_menu.innerHTML += `<h1 id=callinfo > Звонок ${name_call}</h1>`;
	} else {
	    global_menu.innerHTML += `<h1 id=callinfo >Звонок ${name_call}</h1>`;
	}
	gener_jitsi(0);
}


function gener_jitsi(clear){
    document.getElementById("global_menu_d").style.display = "flex";
    global_menu = document.getElementById("global_menu");
    if (clear){
        global_menu.innerHTML = '<div id="meet"></div>';
    } else {
        global_menu.innerHTML += '<div id="meet"></div>';
    }
//    const domain = 'meet.uni-dubna.ru';

    var options = {
//    configOverwrite: {
//breakoutRooms: {    hideAddRoomButton: true}},
    roomName: "qwwertyuuDDDWDW" + document.getElementById("chat_id").value,
    width: '100%',
    height: document.getElementById("global_menu").offsetHeight,
    parentNode: document.querySelector('#meet'),
     userInfo: {
        email: document.getElementById("username").textContent,
        displayName: document.getElementById("name_user").textContent,
    }
    };
if (server_name == "meet.uni-dubna.ru"){
    options["jwt"] = jwt_my;
    options["roomName"] = room_name;

}
const api = new JitsiMeetExternalAPI(server_name, options);
api.on('readyToClose', () => {
    api.dispose();
    document.getElementById("global_menu_d").style.display = "none";
    document.getElementById("global_menu").innerHTML = "";
   });

// Добавление обработчика события

setTimeout(function() {
//    document.getElementById('premeeting-name-input').addEventListener('change', function(event) {

    // Вывод измененного значения в консоль
//    console.log('Новое значение:', event.target.value);
    document.getElementById('premeeting-name-input').value = document.getElementById("name_user").textContent;
    }, 10000);
//});
}

function leave_call_UI(){
    document.getElementById("global_menu").innerHTML = "";
    document.getElementById("global_menu_d").style.display = "none";
}


function kill_call(){
    leave_call_UI();
    var chat_id = document.getElementById("chat_id").value;
    var data = {};
//    peercall.close();
//    socket.emit('kill_call', {chat_id: chat_id, data:data });
}


function nAccepted(){
    document.getElementById("global_menu_d").style.display = "none";
    global_menu = document.getElementById("global_menu");
}


async function accept_call(chat_id){
//    var chat_id = document.getElementById("chat_id").value;
    console.log(document.getElementById("myid").value);
    document.getElementById("accept_call_btn").style.display = "none";
    socket.emit("send_number", {chat_id: chat_id, number: document.getElementById("myid").value});
}


async function playAudio() {
  var audio = new Audio('/static/ringtons/diazinon.mp3');
  audio.type = 'audio/wav';
  try {
    await audio.play();
    document.querySelector('#kill_call_btn').addEventListener('click', function(){
        audio.pause();
    });
    document.querySelector('#global_menu_d').addEventListener('click', function(){
        audio.pause();
    });

    console.log('Playing...');
  } catch (err) {
    console.log('Failed to play...' + err);
  }

}
