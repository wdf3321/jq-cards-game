// 遊戲初始化
function init() {
  // 恢復起始畫面
  $("#begin").show();
  // 移除上一場的牌
  $(".card").remove();
  $("#review").children().remove();
  // 動態產生92張卡片(46組)
  for (let i = 0; i < 52 ; i++) {
    $("#game").append(` <div class="card card-open">
    <div class="card-front"></div>
    <div class="card-back"></div>
  </div>`);
  }

  // 決定數字並打散
  for (let i = 0; i < 52 ; i++) {
    //決定數字 (使用餘數+1，1~46 各會出現兩次) data-card 用於儲存資料(卡片數字)
    const num = (i % 26) + 1;
    if (i < 26) {
      $(".card")
        .eq(i)
        .find(".card-front")
        .css("background-image", `url('./atoz/A(${num}).png')`);
      $(".card").eq(i).attr("data-card", num);
    } else {
      $(".card")
        .eq(i)
        .find(".card-front")
        .css("background-image", `url('./atoz/B${num}.png')`);
      $(".card").eq(i).attr("data-card", num);
    }
    // 打散 92張卡的隨機索引(0-91)
    const target = Math.round(Math.random() * 52);
    // 隨機牌加到後方
    $(".card").eq(target).insertAfter($(".card").eq(i));
  }

  // 1-46隨機產28個數(要拿掉31組 留下15組)  1-26  11 15
  let str = "";
  let numbers = [];
  for (let i = 0; i < 11; i++) {
    str = Math.ceil(Math.random() * 26);
    // 隨機數與陣列內的數字比對，j是陣列的index
    for (j = 0; j < numbers.length; j++) {
      // 若重複就重陣列中移除
      if (numbers[j] == str) {
        numbers.splice(j, 1);
        // 讓i再多跑一次
        i--;
      }
    }
    numbers.push(str);
  }
  console.log(numbers);

  // 把選到的隱藏
  for (let number of numbers) {
    $(`[data-card="${number}"]`).hide();
  }
}
init();

// 點擊按鈕遊戲開始
$("#btnStart").on("click", function () {
  // 起始畫面隱藏
  $("#begin").hide();
  // 卡片翻轉
  $(".card").removeClass("card-open");
  let time = 0;
  // 計時器
  timer = setInterval(() => {
    time++;
    $("#time").text(time);
  }, 1000);

  // 翻牌 (因為牌是動態產生，所以必須往外選，再選到card本身)
  $("#game").on("click", ".card", function () {
    // 最多只能翻兩張牌，且這張牌還沒翻開
    if ($(".card-open").length < 2 && !$(this).hasClass("card-open")) {
      $(this).addClass("card-open");
    }

    // 如果翻開兩張了
    if ($(".card-open").length === 2) {
      // 如果兩張數字一樣
      if (
        $(".card-open").eq(0).attr("data-card") ===
        $(".card-open").eq(1).attr("data-card")
      ) {
        // 使用 card-ok 標記已完成並淡出
        $(".card-open").addClass("card-ok");
        // 將 card-front 淡出而不是 .card 因為對 card 淡出會把3d壓平
        $(".card-open .card-front").fadeTo(1000, 0);
        // 翻牌成功就顯示翻出的牌與對應的片假名

      }
      // 1秒後 不管一不一樣都翻回來
      setTimeout(() => {
        // 如果 .card-open 裡的 card-front 透明度不是1(表示翻對了)，把 .card-open 透明的設為0 (因為不管翻對錯都會再翻回背面，所以用透明度判斷後，把整個card透明度設為0)
        //.each() 類似 for of 裡面的 $(this) 代表迴圈正在跑的元素
        $(".card-open").each(function () {
          if ($(this).find(".card-front").css("opacity") != 1) {
            $(this).css("opacity", 0);
          }
        });

        $(".card-open").removeClass("card-open");
        if ($(".card-ok").length === 30) {
          clearInterval(timer);
          Swal.fire({
            title: "真的是Very Good的啦!",
            imageUrl: "../atoz/thumbs.png",
            text: ` You spend ${time} s , Unbelievable! `,
          }).then((response) => {
            if (response.isConfirmed) {
              init();
            }
          });
        }
      }, 1000);
    }
  });
});
