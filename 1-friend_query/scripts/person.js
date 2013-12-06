function Person(id, img, email, address, phone){
    var $img = $('#imgFriendEdit'),
        $name = $('#tbFriendEditName'),
        $email = $('#tbFriendEditMail'),
        $address = $('#tbFriendEditAddress'),
        $phone = $('#tbFriendEditphone'),
        emitter = $('#friendEdit')
        ;
    var UPDATE = 'update';

    return {
        attachForm:function (){

        },
        on:function(eventName,callback){
            emitter.on(eventName, callback);

        },
        attachModel:function(model){

            function upadateFields(varName, attr , event, keyModel){
                var variable = varName;
                variable.attr(attr, model[keyModel]|| '');
                variable.on(event,function(){
                    model[keyModel] = variable.prop(attr);
                    emitter.trigger(UPDATE,[model]);
                    lst1.save(userModel);
                });
            }

            upadateFields($name, 'value', 'input', 'name');
            upadateFields($img, 'src', '', 'img');
            upadateFields($email, 'value', 'input', 'email');
            upadateFields($address, 'value', 'input', 'address');
            upadateFields($phone, 'value', 'input', 'phone');
            emitter.trigger(UPDATE,[model]);
        }
    }
}//Person class