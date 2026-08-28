document.querySelector('.form2').addEventListener('submit', function(e) {
      e.preventDefault();
      go();
})


document.querySelector('#bg_form').addEventListener('submit', function(e) {
  event.preventDefault(); // Отмена стандартного поведения формы
  const fileInput = document.getElementById('input');
  const file = fileInput.files[0];
  if (file) {
  document.getElementById("progressBar").style.display = "block";
    uploadFile(file); // Передаем файл в функцию для загрузки
  } else {
    alert('Пожалуйста, выберите файл.');
  }
})


document.addEventListener('keydown', function(event) {
    var x = document.querySelector('form');
    var about = document.getElementById("about");
    if (enter_flag && !mobile) {
        if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
        globalThis.position = about.selectionStart + 1;
        about.value = about.value + "\n";
        go();
        // add len text
        };
        if (event.keyCode == 13 && !(event.ctrlKey)) {
         event.preventDefault();
        submit_form();
        }
    }else {
        if ( (event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
         event.preventDefault();
            submit_form();
  }
  }
});


//$('#content').on('contextmenu','div', function(e) { //Get li under ul and invoke on contextmenu
//        e.preventDefault(); //Prevent defaults
//        open_menu_mess(this.id); //alert the id
//});


window.onfocus = function() {
    globalThis.vis = true;this.id
    if (document.getElementById("chat_id") && document.getElementById("chat_id").value != ""){
    set_read(document.getElementById("chat_id").value);
    }
};


window.onblur = function() {
    globalThis.vis = false;
};


document.addEventListener('DOMContentLoaded', () => {
 (async () => {
    try {
        await Notification.requestPermission();
    } catch (error){
        console.log(error);
   }
   })
});


document.addEventListener('click', (e) => {
    if (menu_id != ""){
        if (menu_id == "search_text_div"){
            var search_div = document.getElementById("search_text_div");
            var menu_chat = document.getElementById("menu-chat");
            if (!e.composedPath().includes(search_div) && !e.composedPath().includes(menu_chat)){
                exit_menu();
            }
        } else {
        var div = document.querySelector('#' + menu_id.slice(1));
        var div2 = document.querySelector('#emoji' + menu_id.slice(1).slice(1));
        var t2 = e.composedPath().includes(div2);
        var t = e.composedPath().includes(div);
        var button_emoji_menu = document.querySelector('#btn_emoji_menu_show');
        var div_emoji_menu = document.querySelector('#emojis_menu');
        var bool_emoji_menu = e.composedPath().includes(button_emoji_menu);
        var bool_is_emoji_menu = (menu_id ==  "emojis_menu");
        if ((!t && !t2 && !bool_is_emoji_menu) || (!bool_emoji_menu && bool_is_emoji_menu)){
            exit_menu();
        }}
    }
    if (document.getElementById("global_menu_d").style.display == "block"){
        var global_menu_d = document.querySelector("#global_menu_d");
        var global_menu = document.querySelector("#global_menu");
        var tr2 = e.composedPath().includes(global_menu_d);
        var tr = e.composedPath().includes(global_menu);
        if (tr2 && !tr){
            close_global_menu();
        }
    }
    var div = document.querySelector('#menu_create_div');
    var withinBoundaries = e.composedPath().includes(div);
    var div2 = document.querySelector('#menu_chat_div_all');
    var flag = e.composedPath().includes(div2);
    if (!withinBoundaries) {
        document.getElementById("how_create").style.display = 'none'; // скрываем элемент, так как клик был за его пределами
    };
    if (!flag) {
        document.getElementById("menu-chat").style.display = 'none'; // скрываем элемент, так как клик был за его пределами
    };
})


document.getElementById('content').addEventListener('scroll', function() {
    var scrollTop = this.scrollTop;
    var scrollHeight = this.scrollHeight;
    var height = this.clientHeight;
});


window.addEventListener('paste', e => {
    document.getElementById("send2_btn").style.display = "block";
  document.getElementById("inputTag").files = e.clipboardData.files;
  imageName.innerText = "картинка";
  const item = e.clipboardData.items[0];
   if (item.type.indexOf("image") === 0) {
         document.getElementById("watch").style.display = "block";
         document.getElementById("form").style.display = "block";
         document.getElementById("form").style.zIndex = "10";
         const blob = item.getAsFile();
        // создаем объект, считывающий файлы
                const reader = new FileReader();
                // когда файл загрузится
                reader.onload = function (event) {
                    // вставляем его на страницу
                    document.getElementById("watch_img").src = event.target.result;
                };
                // запускаем чтение двоичных данных файл как тип data URL
                reader.readAsDataURL(blob);
            }
});
