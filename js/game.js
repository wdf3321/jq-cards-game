// 遊戲初始化
function init() {
	$("#begin").show();
	$(".card").remove();
	$("#review").children().remove();

	for (let i = 0; i < 52; i++) {
		$("#game").append(` <div class="card card-open">
    <div class="card-front"></div>
    <div class="card-back"></div>
  </div>`);
	}

	for (let i = 0; i < 52; i++) {
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

		const target = Math.round(Math.random() * 52);
		$(".card").eq(target).insertAfter($(".card").eq(i));
	}


	let str = "";
	let numbers = [];
	for (let i = 0; i < 11; i++) {
		str = Math.ceil(Math.random() * 26);
		for (j = 0; j < numbers.length; j++) {
			if (numbers[j] == str) {
				numbers.splice(j, 1);
				i--;
			}
		}
		numbers.push(str);
	}
	// console.log(numbers);

	for (let number of numbers) {
		$(`[data-card="${number}"]`).hide();
	}
}
init();


$("#btnStart").on("click", function () {
	$("#begin").hide();
	$(".card").removeClass("card-open");
	let time = 0;
	timer = setInterval(() => {
		time++;
		$("#time").text(time);
	}, 1000);

	$("#game").on("click", ".card", function () {

		if ($(".card-open").length < 2 && !$(this).hasClass("card-open")) {
			$(this).addClass("card-open");
		}

		if ($(".card-open").length === 2) {

			if (
				$(".card-open").eq(0).attr("data-card") ===
				$(".card-open").eq(1).attr("data-card")
			) {
				$(".card-open").addClass("card-ok");
				$(".card-open .card-front").fadeTo(1000, 0);
			}
			setTimeout(() => {
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
