function send_num_code(){
    const login = document.getElementById('login-input').value;
    $.ajax({
        url: '/send_code',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"login": login}),
        success: function(json){
            if (json["status"] == 200){
                document.getElementById("login").value = login;
                document.getElementById("second_hide").style.display = "none";
                 document.getElementById("hide_password_div").style.display = "block";
            } else {
                var div_mess = document.createElement("div");
                div_mess.textContent = json["message"];
                div_mess.classList = "alert alert-primary";
                document.getElementById("hide_password_div").appendChild(div_mess);
            }
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function check_code() {
    $.ajax({
        url: '/check_code_and_login',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"login": document.getElementById("login").value, "dcode": document.getElementById("dcode").value, "new_password": document.getElementById("new_password").value,}),
        success: function(json){
            if (json["status"] == 200){
                document.getElementById("login").value = login;
                 document.getElementById("hide_password_div").style.display = "none";
                 var div_mess = document.createElement("div");
                div_mess.textContent = "Вы успешно сменили пороль";
                div_mess.classList = "alert alert-primary";
                document.getElementById("global-div").appendChild(div_mess);
            } else {
                var div_mess = document.createElement("div");
                div_mess.textContent = json['message'];
                div_mess.classList = "alert alert-primary";
                document.getElementById("hide_password_div").appendChild(div_mess);
            }
            },
        error: function(err) {
            console.error(err);
        }
    });

}


