function delete_user(delete_id){
    var password = document.getElementById("password").value;
    $.ajax({
        url: '/panel/delete_user_by_id',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"user_id": delete_id, "password": password}),
        success: function(json_data){
            alert("успешно")
        },
        error: function(err) {
            alert("Наверное пароль не правильный")
            console.error(err);
        }
    });
}


function send_block_page(){
     var password = document.getElementById("password").value;
     let delete_id = document.getElementById("block_cod").value;
    $.ajax({
        url: '/panel/add_block_page',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"name_page": delete_id, "password": password}),
        success: function(json_data){
            alert("успешно")
        },
        error: function(err) {
            alert("Наверное пароль не правильный")
            console.error(err);
        }
    });
}


function send_admin_voting(flag, id_voting){
    $.ajax({
        url: '/panel/admin_voting',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"bool": flag, "voting_id": id_voting}),
        success: function(json_data){
            alert("успешно")
        },
        error: function(err) {
            alert("Наверное пароль не правильный")
            console.error(err);
        }
    });
}


function send_unblock_page(){
     var password = document.getElementById("password").value;
     let delete_id = document.getElementById("block_cod").value;
    $.ajax({
        url: '/panel/delete_block_page',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"name_page": delete_id, "password": password}),
        success: function(json_data){
            alert("успешно")
        },
        error: function(err) {
            alert("Наверное пароль не правильный")
            console.error(err);
        }
    });
}


function show_no_admin(){
    $.ajax({
        url: '/panel/get_not_admin',
        type: 'GET',
        dataType: 'json',
        success: function(json_data){
            var div_ = document.getElementById("new_admins");
            console.log(json_data["users"].length)
           for (let i = 0; i < json_data["users"].length; i++){
                var button = document.createElement("li");
                button.setAttribute("onclick", `add_new_admin(${json_data['users'][i]['id']})`);
                button.textContent = `${json_data["users"][i]['name']}(${json_data["users"][i]["username"]})`;
                button.classList = "list-group-item";
                div_.appendChild(button);
           }
        },
        error: function(err) {
            console.error(err);
        }
    });
}


function add_new_admin(id_user){
    var password = document.getElementById("password").value;
    var name = document.getElementById("name_new_admin").value;
    $.ajax({
        url: '/panel/add_new_admin',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"id_user": id_user, "password": password, "name": name}),
        success: function(json_data){
            alert("SUCCESS");
            document.getElementById("new_admins").innerHTML = "";
        },
        error: function(err) {
            console.error(err);
        }
    });
}