function FriendsList(){

    this.friends = [];

    function getSearchStr(){
        return $('#tbName').val();
    }

    function initList(friends, filter){
        var userStringSearch = filter;
        userStringSearch = userStringSearch.replace(/^\b\s+|\s+$|\B\s/g,'').replace(/\s+/g,' ');
        var searchWords = userStringSearch.split(" ");

        var regPattern ='^(?=.*\\b' + searchWords.join(')(?=.*\\b') + ')';
        var searchPatt = new RegExp(regPattern,'gi');
        var $container = $('#container');
        $container.empty();
        var friendsHTML = [];
        for(var i = 0; i<friends.length; i++){
            var f = friends[i];
            var isFitPatt = searchPatt.test(f.name);
            if(isFitPatt){
                friendsHTML.push(
                    generateHTML(friendTpl,{
                        name: f.name,
                        id: f.id
                    })
                );
            }
        }
        $container.html(friendsHTML.join(''));
        $container.find('li')
            .each(function( i, e ){
                $(this).data('model',friends[i]);
            })
            .on('dragstart',function(e){
                e.originalEvent.dataTransfer.setData('userId', $(this).attr('id') );
            });
    }
    this.initList = initList;

    this.load = function(){
        return $.ajax({
            type: 'GET',
            url: 'scripts/myFriends.json?callback=?',
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp'
        })
            .done(function(res){
                initList(res, getSearchStr());
                friends = res;
            })
            .fail(function(e){
                $('#result').addClass('wrong');

                if(e.status===403 || e.status===404){
                    $('#result').text('We are sorry but currently we have a problem with friends display');
                }
                else{
                    $('#result').text('Error has been occurred: ' + e.statusText);
                }
            })
    };

    this.save = function(model){
        if(localStorage)
        {
            localStorage["friends"] = JSON.stringify(friends);
            //localStorage.setItem(model.id ,model);
            //localStorage.clear();
            console.log(localStorage);
        }
        else
        {
            document.getElementById("result").innerHTML="Sorry, your browser does not support web storage...";
        }
    }
}//FriendsList Class