var friends;

var friendTpl =
        '<li id="{id}" class="friend" draggable="true">\
           <img src="http://graph.facebook.com/{id}/picture" />\
           <span>{name}</span>\
        </li>';

//drag and drop functions
var personService;
var lst1 = new FriendsList();
var userModel;

$(function(){
    lst1.load();

    $('#tbName').on('input',function(){
        lst1.load();
    });

    $('#friendEdit').on('drop',function(e){
        e.stopPropagation();
        e.preventDefault();

        var userID = e.originalEvent.dataTransfer.getData('userId');
        userModel = $('#'+userID).data('model');
        personService.attachModel(userModel);
    });

    $('#imgFriendEdit').on('drop',function(e){
        e.stopPropagation();
        e.preventDefault();

        var file = e.originalEvent.dataTransfer.files[0];
        var imgSrc = window.URL.createObjectURL(file);
        $('#imgFriendEdit').attr('src', imgSrc);
    })

    personService = new Person();

    personService.on('update',function(event,model){
        console.log('person was updated');
    });

    personService.on('update',function(event,model){
        $('#imgFriendShow').attr('src',model.img);
        $('#lbFriendShowName').text(model.name);
        $('#tbFriendShowMail').text(model.email);
        $('#tbFriendShowAddress').text(model.address);
        $('#tbFriendShowPhone').text(model.phone);
    })
});