var questions, quizName;
var answerTpl =
        '<label class="question">\
            <input type="radio" name="radioQuestion-{groupId}" value="{value}" />{answer}\
        </label>',
    questionTpl =
        '<li class="questionsGroup">\
            <fieldset>\
            <h4>{question}</h4>\
            {answers}\
            </fieldset>\
        </li>';

function generateHTML (tpl, data){
    var placeHolderReg = /{([^}]+)}/g;
    return tpl.replace(placeHolderReg,function(match, p1 ,offset, string){
        return data[p1]
    });
}

function initQuiz(){
    var $container = $('#container');
    $container.empty();
    for(var qn in questions){
        var q = questions[qn];
        var answersHTML = [];
        for (var i = 0, a; a= q.answers[i]; i++){
            answersHTML.push(generateHTML(answerTpl,{
                groupId:qn,
                value:i,
                answer:a
            }))
        }

        $container.append(generateHTML(questionTpl,{
            question: q.question,
            answers:answersHTML.join('')
        }))
    }
}


function getQuizSelectList(){
    $.ajax({
        url : 'ajax/quizList.json',
        success : function(res){
            var quizSelectList = res;
            $.each(quizSelectList, function(i, value) {
                $('#selectQuizList').append($('<option>').text(value).attr('value', value));
            });
        },
        error : function(e){
            $('#result').text('Error has been occurred: ' + e.statusText);
        }
    })
}

function getQuiz( quizName ){
    $.ajax({
        type: 'get',
        beforeSend: function(){console.log('get ready for request...')},
        url: 'ajax/'+ quizName +'.json',
        success : function(res){
            questions = res;
            initQuiz();
            $('.hidden').removeClass('hidden');
            $('#result').removeClass('wrong');
        },
        error : function(e){
            $('#result').addClass('wrong');

            if(e.status===403 || e.status===404){
                $('#result').text('The specified quiz doesn\'t exist. Please enter correct quiz name.');
            }
            else{
                $('#result').text('Error has been occurred: ' + e.statusText);
            }
        },
       complete: function(){console.log('the request is done...')}

    })
}

$(function(){
    getQuizSelectList();

    $('#selectQuizList').change(function(){
        if($('#selectQuizList')[0].selectedIndex !==0){
            $('#result').empty();
            quizName = $('#selectQuizList').val();
            getQuiz( quizName );
        }
    });

    $('#btSubmit').click(function(){
       checkQuiz();
    })
});

function checkQuiz(){
    var correctQues = 0;
    var result='';
    var $quesForm = $('#quizForm');
    var userAnswers =$.map($quesForm.serializeArray(), function(field, i){
        return field.value;
    });
    var modelAnswers = $.map(questions,function( o, i ){
        return o.solution;
    });
    var numOfQues = modelAnswers.length;
    var isUserAnswerAll = userAnswers.every(function(value,i,arr){
     return !!value;
    });

    if(isUserAnswerAll){
        for (var i=0, j=modelAnswers.length; i<j; i++ ){
            if(userAnswers[i]==modelAnswers[i]){
                $('.questionsGroup:eq(' + i + ')').removeClass('wrong').addClass('correct');
                correctQues++;
            }
            else{
                $('.questionsGroup:eq(' + i + ')').removeClass('correct').addClass('wrong');
            }
            result = 'You have answered ' + correctQues + ' out of ' + numOfQues;
        }
    }else{
        result = 'Please answer all questions';
        $("#result").addClass('wrong');
    }
    $("#result").html(result);
}