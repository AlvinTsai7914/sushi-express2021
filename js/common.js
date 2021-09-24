function playAudio(dataName) {
    let audio = $(`audio[data-name="${dataName}"]`);
    $(audio).trigger("play");
}
function pauseAudio(dataName) {
    let audio = $(`audio[data-name="${dataName}"]`);
    $(audio).trigger("pause");
}

function dNone(className) {
    $(`${className}`).addClass("d-none");
}
function dShow(className) {
    $(`${className}`).removeClass("d-none");
}


// loading > intro
$(function () {
    // 初始化設定網頁高度為瀏覽器"內"高
    let winInnerHeight = $(window).innerHeight();
    $(".wrapper").css({ height: winInnerHeight });

    // 按下按鈕開始遊戲
    $(".start_game_btn").on("click", function () {
        $(this).addClass("d-none");
        playAudio("click");
        dShow(".container")
        // 4s 音樂開始
        setTimeout(() => {
            dShow(".intro_scene")
            playAudio("BGM-suspense");
        }, 4000);

        // 9.5s loading_scene消失
        setTimeout(() => {
            dNone(".loading_scene") 
        }, 9500);
    });
});

// intro_scene
$(function () {
    // 第一個對話框 > 第二對話框
    $(".intro_scene").one("click", function () {
        dNone(".chat_bubble.first") 
        dShow(".chat_bubble.second.d-none")
        dShow(".post_rising")
        setTimeout(() => {
            dShow(".btn_box")
            playAudio("mission");
        }, 1000);
    });

    // 按下查看任務 出現懸賞單
    $(".check_mission").on("click", function () {
        playAudio("click")
        dShow(".post_wrapper")
        dNone(".check_mission")
    });

    // 按下接受任務 過場進game_scene
    $(".accept_mission").on("click", function () {
        playAudio("click");

        // 印章出現
        dShow(".letsgo")

        //1s 後出現過場黑幕
        setTimeout(() => {
            dShow(".trans_scene")
        }, 1000);

        // 2s 背景更換 停止音樂
        setTimeout(() => {
            dNone(".intro_scene") 
            dNone(".post_wrapper") 
            pauseAudio("BGM-suspense");
        }, 2000);

        //3s 播放音樂
        setTimeout(() => {
            dShow(".game_scene")
            playAudio("BGM-speed");
        }, 2500);

        //5s 過場黑幕 display none
        setTimeout(() => {
            dNone(".trans_scene") 
        }, 5000);
    });
});


function failure() {
    let failure_count = 1;
    console.log("failure_count:" + failure_count)
    if (failure_count < 10 ){
        $(`.${etc}`).addClass("wrong");
        dNone(".chat_bubble")
        dShow(".chat_bubble.game_fail")
        failure_count++
        setTimeout(() => {
            $(`.${etc}`).removeClass("wrong");
        }, 1000);
    } else if (failure_count >= 10 && failure_count < 20){
        $(`.${etc}`).addClass("wrong");
        dNone(".chat_bubble")
        dShow(".egg1")
        failure_count++
        setTimeout(() => {
            $(`.${etc}`).removeClass("wrong");
        }, 1000);
    } else if (failure_count >= 20 && failure_count < 30){
        $(`.${etc}`).addClass("wrong");
        dNone(".chat_bubble")
        dShow(".egg2")
        failure_count++
        setTimeout(() => {
            $(`.${etc}`).removeClass("wrong");
        }, 1000);
    } else if (failure_count >= 30){
        $(".float_up" + (n-1)).addClass("active")
        $(".shrink").addClass("active");
        $(".fish").addClass("active");
        $(".float_up5").show();
        dNone(".chat_bubble")
        dShow(".egg")
    }
}