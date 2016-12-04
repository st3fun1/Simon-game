var arrOfColors = $('#wheel #buttons').children().map(function () {
    return '#' + $(this).attr('id');
}).toArray();
var Simon = (function ($, startBtn, colors) {
    var playerTurn = false
        , col = 0
        , row = 0;
    var pattern = [];
    var count = 0;
    var strictMode = false; //no strict mode
    var maxLevel = 20;
    var colorArr = colors.map((x) => x.slice(1));
    var activatePattern;
    var startGame = function () {
        generatePattern(colorArr);
        loopThroughPattern(pattern, col);
    };
    var pickMode = function () {
        $('#mode').on('click', function () {
            if (strictMode == false) {
                strictMode = true;
                $(this).text('Casual');
            }
            else {
                strictMode = false;
                $(this).text('Strict');
            }
        });
    };
    
    var generatePattern = function (colors) {
        pattern = [];
        var subArr = [];
        subArr.push(colorArr[Math.floor(Math.random() * 4)]);
        for (var i = 1; i <= maxLevel; i++) {
            if (pattern.length > 0) {
                subArr = subArr.concat(pattern[pattern.length - 1]);
            }
            subArr.push(colorArr[Math.floor(Math.random() * 4)]);
            pattern.push(subArr);
            subArr = [];
        }
    };
    
    var resetGame = function () {
        $('#reset').on('click', function () {
            pattern = [];
            col = 0;
            row = 0;
            generatePattern(colors);
            $('#status').text('Game reseted!');
            setTimeout(function clearStatus() {
                $('#status').text('');
            }, 1500);
        });
    };
    var checkPlayersPick = function () {
        if (playerTurn == true) {
            /* play specific sound for each item */
            $(this).children('audio')[0].play();
            $(this).addClass('active');
            let currentArrayLen = pattern[col].length;
            if ($(this).attr('id') != pattern[col][row]) {
                col = 0;
                row = 0;
                $('.screen').text('Game over!');
                if (strictMode == true) {
                    pattern = [];
                    generatePattern(colors);
                }
                $('#level').text('');
                playerTurn = false;
            }
            else if (row == currentArrayLen - 1) {
                count++;
                $('.screen').text(count);
                if (col == pattern.length - 1) {
                    $('.screen').text('Won!!!');
                    col = 0;
                    playerTurn = false;
                    row = 0;
                    pattern = [];
                    generatePattern(colorArr);
                    return;
                }
                else {
                    col++;
                    row = 0;
                    $('.screen').text('Next level!');
                    playerTurn = false;
                    setTimeout(function increaseLevel() {
                        loopThroughPattern(pattern, col);
                    }, 1000);
                }
            }
            else {
                $('.screen').text('Playing!');
                console.log('color', $(this).attr('id'));
                row++;
            }
        }
    };
    var loopThroughPattern = function (pattern, j) {
        console.log(pattern);
        var s = 0;
        $('#status').text('');
        for (var i = 0; i < pattern[j].length; i++) {
            highlightColor(i, pattern[j][i], pattern[j]);
        }

        function highlightColor(i, color, arr) {
            var speed = 900;
            $('#wheel #buttons').children().off('mousedown');
            activatePattern = setTimeout(function highlightEls() {
                var el = $('#' + color);
                $(el).children('audio')[0].play();
                $(el).addClass('active');
                setTimeout(function () {
                    $(el).removeClass('active');
                    if (i == arr.length - 1) {
                        setTimeout(function changeToPlayerTurn() {
                            $('.screen').text('Player!');
                            playerTurn = true;
                            addEventListenerToColors(colors, checkPlayersPick);
                            $('#buttons').prop('disabled',false);
                        }, speed);
                    }
                    else if (i == 3 || i == 5 || i == 7) {
                        speed -= 100;
                    }
                }, 70 / 100 * speed);
            }, speed * i);
        }
    };
    var addEventListenerToColors = (function (colors, callback) {
        for (var i = 0; i < colors.length; i++) {
            $(colors[i]).on('mousedown', callback);
            $(colors[i]).on('mouseup',function(){
                $(this).removeClass('active');
                console.log(this); 
            });
        }
    });
    //(colors,checkPlayersPick);
    (function addEventListenerToStartBtn(btn, callback) {
        $(btn).on('click', callback);
    }(startBtn, startGame));
    return {
        init: function (colors) {
            generatePattern(colors);
            resetGame();
            pickMode();
        }
    };
}(jQuery, '.start', arrOfColors));
Simon.init();