let timer = true;
let bgm = "";
let muted = true;
// 0930修改播放音樂邏輯
function playAudio(dataName) {
    let audio = $(`audio[data-name="${dataName}"]`);
    // 如果靜音，不撥放
    if (muted) {
        return;
        // 非靜音狀態，且撥放的是BGM，撥放並且不重製播放時間
    } else if (!muted && dataName === bgm) {
        var playPromise = $(audio).trigger("play");
        // 其餘音效，每次皆重頭撥放
    } else {
        $(audio).prop("currentTime", 0);
        $(audio).trigger("play");
    }
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

function transScene500ms(preScene, nextScene) {
    dShow(".trans_scene.s_500");
    setTimeout(function () {
        dNone(preScene);
        dShow(nextScene);
    }, 300);
    setTimeout(() => {
        dNone(".trans_scene");
    }, 1000);
}

// 初始化設定
$(function () {
    // 設定網頁高度為瀏覽器"內"高
    let winInnerHeight = $(window).innerHeight();
    $(".wrapper").css({ height: winInnerHeight });

    // 阻止雙擊放大
    $(document).on("dbclick", function (e) {
        e.preventDefault();
    });
    // 阻止多點觸控
    $(document).on("gesturestart", function (e) {
        e.preventDefault();
    });
    // 前後點擊時間小於300ms，阻止事件
    let lastTouchEnd = 0;
    $(document).on("touchend", function (e) {
        let now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    });

    // 監聽網頁是否可處於可見狀態
    $(document).on("visibilitychange", (e) => {
        // 網頁可見撥放BGM
        if (document.visibilityState === "visible") {
            playAudio(bgm);
        } else {
            // 不可見停止BGM
            pauseAudio(bgm);
        }
    });

    // 音樂開關鈕
    $(".audio_btn").on("click", function () {
        if (muted) {
            muted = !muted;
            playAudio(bgm);
            $(".audio_btn img").toggleClass("d-none");
        } else {
            muted = !muted;
            pauseAudio(bgm);
            $(".audio_btn img").toggleClass("d-none");
        }
    });
});

// loading > intro
$(function () {
    bgm = "BGM-suspense";
    setTimeout(() => {
        dShow(".intro_scene");
        dShow(".audio_btn");
        playAudio("BGM-suspense");
    }, 6000);

    // 9.5s loading_scene消失
    setTimeout(() => {
        dNone(".loading_scene");
    }, 11500);

    // 0930刪除開始按鈕
    // 按下按鈕開始遊戲
    // $(".start_game_btn").on("click", function () {
    //     $(this).addClass("d-none");
    //     playAudio("click");
    //     dShow(".container");
    //     bgm = "BGM-suspense";
    //     playAudio("BGM-suspense");
    //     pauseAudio("BGM-suspense")
    //     // 4s 音樂開始
    //     setTimeout(() => {
    //         dShow(".intro_scene");
    //         playAudio("BGM-suspense");
    //     }, 6000);

    //     // 9.5s loading_scene消失
    //     setTimeout(() => {
    //         dNone(".loading_scene");
    //     }, 11500);
    // });
});

// intro_scene
$(function () {
    // 第一個對話框 > 第二對話框
    $(".intro_scene").one("click", function () {
        dNone(".chat_bubble.first");
        $(".spark_box").css("opacity", "0");
        dShow(".chat_bubble.second.d-none");
        dShow(".post_rising");
        setTimeout(() => {
            dShow(".btn_box");
            playAudio("mission");
        }, 1000);
    });

    // 按下查看任務 出現懸賞單
    $(".check_mission").on("click", function () {
        playAudio("click");
        dShow(".post_wrapper");
        dNone(".check_mission");
    });

    // 按下接受任務 過場進game_scene
    $(".accept_mission").on("click", function () {
        if (timer === true) {
            timer = false;
            playAudio("click");
            bgm = "BGM-speed";
            playAudio("BGM-speed");
            // setTimeout(() => {
            //     pauseAudio("BGM-speed");
            // }, 150);
            pauseAudio("BGM-speed");
            // 印章出現
            dShow(".letsgo");
            //1s 後出現過場黑幕
            setTimeout(() => {
                dShow(".trans_scene.s_default");
            }, 1000);

            // 2s 背景更換 停止音樂
            setTimeout(() => {
                dNone(".intro_scene");
                dNone(".post_wrapper");
                pauseAudio("BGM-suspense");
            }, 2000);

            //3s 播放音樂
            setTimeout(() => {
                dShow(".game_scene");
                playAudio("BGM-speed");
            }, 2500);

            //5s 過場黑幕 display none
            setTimeout(() => {
                dNone(".trans_scene");
            }, 5000);

            // 進入遊戲後五秒才能點擊鯛
            setTimeout(() => {
                $(".diu").css({ "pointer-events": "auto" });
                timer = true;
            }, 13000);
        }
    });
});

// game_scene
$(function () {
    let n = 4;
    let failure_count = 1;

    function failure(etc) {
        if (failure_count < 10) {
            $(`.${etc}`).addClass("wrong");
            dNone(".chat_bubble");
            dShow(".chat_bubble.game_fail");
            setTimeout(() => {
                $(`.${etc}`).removeClass("wrong");
            }, 1000);
        } else if (failure_count >= 10 && failure_count < 20) {
            $(`.${etc}`).addClass("wrong");
            dNone(".chat_bubble");
            dShow(".egg1");
            setTimeout(() => {
                $(`.${etc}`).removeClass("wrong");
            }, 1000);
        } else if (failure_count >= 20 && failure_count < 30) {
            $(`.${etc}`).addClass("wrong");
            dNone(".chat_bubble");
            dShow(".egg2");

            setTimeout(() => {
                $(`.${etc}`).removeClass("wrong");
            }, 1000);
        } else if (failure_count >= 30) {
            $(".float_up" + (n - 1)).addClass("active");
            $(".shrink").addClass("active");
            $(".fish").addClass("active");
            $(".float_up5").show();
            dNone(".chat_bubble");
            dShow(".egg");
        }
    }

    $(".game_scene").click(function (e) {
        let etc = e.target.className;
        // 蝦和飛魚
        if (etc === "shrink" || etc === "fish") {
            playAudio("fish_jump");
            failure(etc);
            failure_count++;
        }

        // 鯛
        if (etc === "diu") {
            playAudio("fish_jump");
            $(e.target).parent().addClass("active");
            $(".diu").css({ "pointer-events": "none" });
            // 被點擊的消失 下一個出來
            setTimeout(function () {
                $(e.target).parent().hide();
                $(".float_up" + n).show();
                n++;
            }, 1000);

            setTimeout(function () {
                $(".diu").css({ "pointer-events": "auto" });
            }, 3000);

            if (n === 4) {
                dNone(".chat_bubble");
                dShow(".game_second");
            }

            if (n === 5) {
                $(".shrink").addClass("active");
                $(".fish").addClass("active");
                dNone(".chat_bubble");
                setTimeout(() => {
                    dShow(".game_third");
                }, 4000);
            }
        }
        // 發光的鯛
        if (etc === "diu prize") {
            if (timer === true) {
                timer = false;
                $(".float_up5").addClass("active");
                $(".game_scene").addClass("active");
                playAudio("prize");
                pauseAudio("prize");
                setTimeout(function () {
                    $(".game_scene").hide();
                    dShow(".prize_scene");
                    playAudio("prize");
                    timer = true;
                }, 4000);
                // 按鈕可點擊時間
                setTimeout(function () {
                    $(".prize_scene .btn_box").css("pointer-events", "auto");
                }, 6800);
            }
        }
    });
});

// prize_scene
$(function () {
    // 點擊換場
    $(".prize_scene .btn_box").on("click", function (e) {
        // dShow(".trans_scene.s_500");
        // setTimeout(function () {
        //     dNone(".prize_scene");
        //     dShow(".qrcode_scene");
        // }, 300);
        // setTimeout(() => {
        //     dNone(".trans_scene");
        // }, 1000);
        transScene500ms(".prize_scene", ".qrcode_scene");
        pauseAudio("BGM-speed");
        bgm = "BGM-happy";
        playAudio("BGM-happy");
        setTimeout(function () {
            $(".qrcode_scene .btn_box").css("pointer-events", "auto");
        }, 3000);
    });
});

// qrcode_scene
$(function () {
    $(".qrcode_scene .btn_box").on("click", function () {
        playAudio("click");
        transScene500ms(".qrcode_scene", ".sushi_scene");

        if (timer === true) {
            timer = false;
            playAudio("prize");
            pauseAudio("prize");
            setTimeout(function () {
                playAudio("prize");
                timer = true;
            }, 1000);
            setTimeout(function () {
                $(".sushi_scene .btn_box").css("pointer-events", "auto");
            }, 3000);
        }
    });
});

// sushi_scene
$(".sushi_scene .btn_box").on("click", function () {
    dNone(".sushi_scene");
    dShow(".lottery");
});
