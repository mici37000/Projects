$(document).on('click', '.item', function(){
    var id = this.getAttribute('data-id');
    window.open('https://www.youtube.com/watch?v=' + id);
});

$(function(){
    $('#searchBtn').click(function(){
        getYoutubeResults();
    });

    $('#searchTB').keypress(function(event){
        if (event.which == 13){
            getYoutubeResults();
        }
    });

    $('#sortTitleBtn').click(function(){

    });

    $('#sortDateBtn').click(function(){

    });
});

function getYoutubeResults(sortType) {
    var searchVal = $('#searchTB').val().trim();

    if (searchVal) {
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + searchVal + '&videoCaption=closedCaption&type=video&maxResults=25&key=AIzaSyBNPjKNPK_R8raVLKs33g5L4PAhpsNH0JU',
            dataType: 'json',
            type: 'GET',
            error: function () {
                $('.content').empty();
                alert('Sorry an error has been acurred');
            },
            success: function (res) {
                var videosArr = [];

                for (var i = 0; i < res.items.length; i++) {
                    var item = res.items[i];

                    var cont = $('<div class="item" data-id="' + item.id.videoId + '" />');
                    var thumb = $('<img class="thumb" src="' + item.snippet.thumbnails.default.url + '" />');
                    var body = $('<div class="video-body"><div class="channel">' + item.snippet.channelTitle + '</div>' +
                        '<div class="title">' + item.snippet.title + '</div>' +
                        '<div class="desc">' + item.snippet.description + '</div></div>'
                    );

                    cont.append(thumb, body);
                    videosArr.push(cont);
                }

                $('.content').empty().append(videosArr);
            }
        });
    }
}