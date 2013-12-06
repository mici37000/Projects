$(Leaderboard);

function Leaderboard(){
    var g = {
        key:null,
        roomId:null
    };

    //deferred object
    var defAjax;
    Leaderboard.refresh = function(){
        return defAjax = Leaderboard.defAjax = $.getJSON('ajax/config.json')
            .fail(function(e){
                console.log('error in config file load ');
            })
    };

    Leaderboard.refresh();
    //the template of the HTML
    var labelMarkupTpl = ' <div class="label-tab sprite">{label}</div>',
        playerMarkupTpl = '<div class="player">\
                         <div class="col rank">{rank}</div>\
                         <div class="col user">\
                            <img class="image" src="//graph.facebook.com/{user_id}/picture" alt="{name}"/>\
                            <span class="name">{name}</span>\
                         </div>\
                         <div class="col points">{points}</div>\
                     </div>';

    var labelTpl = new Template(labelMarkupTpl).compile();
    var playerTpl = new Template(playerMarkupTpl).compile();

    var $leaderboardBody = $('#leaderboard'),
        $labelsContainer = $leaderboardBody.find('.label-tabs'),
        $playersContainer = $leaderboardBody.find('.players');

    //leaderboard's initialization
    Leaderboard.init = function(key, roomId){
        g.key = key;
        g.roomId = roomId;

        defAjax.done(function(res){
            var keyMap = res.leaderboard_key_map;
            var lbID = g.lbID = keyMap[key][0];
            var lbData = g.lbData = res.leaderboards[lbID];
            updateLBSprite(lbData.sprite_url['en']);
            g.defaultIndex = getDefaultIndex(lbData);
            buildLabels(lbData.tabs, g.defaultIndex);
        });
    };

    //2013-06-17T05:10:11
    function getDateFormat(datetime){
        var regTime = /(\d{4})\-(\d{1,2})\-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/;
        var formatTime = datetime.replace(regTime,'$3/$2/$1, $4:$5:$6');
        return formatTime;
    }

    //update a css rules on runtime according the language and the leaderboard category
    function updateLBSprite(spriteUrl){
        var stylesheets = document.styleSheets, s;
        for(var i = 0; i < stylesheets.length; i++){
            s = stylesheets[i];
            if (s.href.indexOf("leaderboard.css") != -1){
                var rules = s.cssRules || s.rules;

                var selectors = [
                    '.leaderboard.sprite, #leaderboard .sprite, #leaderboard.sprite',
                    '.sprite.leaderboard, #leaderboard .sprite, .sprite#leaderboard',
                    '.sprite.leaderboard',
                    '#leaderboard .sprite',
                    '.sprite#leaderboard'
                ]

                for (var i = 0; i < selectors.length; i++){
                    for (var j = 0; j < 5; j++){
                        if(rules[j].selectorText == selectors[i])
                        {
                            rules[j].style.backgroundImage = 'url(' + spriteUrl + ')';
                        }
                    }
                }
                break;
            }
        }
    }

    //let's us know witch plaer ranking to show (the last one that isn't empty)
    function getDefaultIndex(lbData){
        var i = lbData.cyclic_number;
        if(i) while(--i && lbData.tabs[i].current == 0){};
        return i;
    }

    function buildLabels(tabs, labelIndex){
        var HTML = [];

        for(var i = 0; i < tabs.length; i++){
            var t = tabs[i];
            HTML.push(labelTpl.applyTemplate(t));
        }
        $labelsContainer.html(HTML.join(''));
        buildPlayersList(tabs[labelIndex].rankings);
        $('.label-tab-active').removeClass('label-tab-active').addClass('label-tab');
        $('.label-tab:eq(' + labelIndex + ')').addClass('label-tab-active').removeClass('label-tab');

       $('.label-tab,.label-tab-active').click(function (){
           clickIndex = $(this).index();
           clickLabelTab(clickIndex);
        })
    }

    function clickLabelTab(clickIndex){
        if(clickIndex == g.defaultIndex){
            defAjax = Leaderboard.refresh().done(function(res){
                buildLabels(res.leaderboards[g.lbID].tabs, clickIndex);
                updateTexts(res.last_update, res.interval_update);
            });
        }
        else{
            buildLabels(g.lbData.tabs, clickIndex);
        }
    }

    function buildPlayersList(rankings){
        $playersContainer.empty();
        var HTML = [];

        if(rankings.length == 0){
            $playersContainer.html(tPT['L1']).addClass('msg');
        }
        else{
            for(var i = 0; i < rankings.length; i++){
                var r = rankings[i];
                HTML.push(playerTpl.applyTemplate(r));
            }
            $playersContainer.html(HTML.join('')).removeClass('msg');
        }
    }

    var $rankingButton = $('#leaderboard .title-tabs .ranking');
    var $prizesButton = $('#leaderboard .title-tabs .prizes');
    var $playButton = $('#leaderboard .title-tabs .play');
    var $labelTab = $('.label-tab');

    $('#leaderboard').addClass('show-ranking');
    $rankingButton.addClass('ranking-active').removeClass('ranking');

    //onclick display or hide content
    $rankingButton.click(function (){
        $('#leaderboard').addClass('show-ranking').removeClass('show-prizes');
        $rankingButton.addClass('ranking-active').removeClass('ranking');
        $prizesButton.addClass('prizes').removeClass('prizes-active');
    });

    $prizesButton.click(function (){
        $('#leaderboard').addClass('show-prizes').removeClass('show-ranking');
        $prizesButton.addClass('prizes-active').removeClass('prizes');
        $rankingButton.addClass('ranking').removeClass('ranking-active');
    });
}

//opens the leaderboard when the DOM is ready
$(function(){
    openLeaderboard('D');
});