$(function () {

	$.fn.slidebox = function (option) {
		return this.each(function (option) {

				var settings = {
					width: 0,
					height: 0,
					hoverPause: true,
					showTime: 5000,
					switchTime: 0,
					auto: true,
					onChange: function () {
					}
				}

				option = $.extend(settings, option);

				var $element = $(this);
				var $items = $element.find("ol > li");

				var autoTimer;
				var mousehover = false;
				var switchTimeLock = false;

				function SlideTo(index) {

					index = parseInt(index);
					var leaveItem = $items.filter(".active");
					var enterItem = $items.eq(index);
					if (leaveItem.index() == index || switchTimeLock)return;

					switchTimeLock = true;
					setTimeout(function () {
						switchTimeLock = false;
					}, option.switchTime)

					if (leaveItem.index() < index) {
						$element.addClass("forward").removeClass("back")
					} else {
						$element.addClass("back").removeClass("forward")
					}

					$items.removeClass("leave active");
					leaveItem.addClass("leave");
					enterItem.addClass("active");
					$("[data-slide-to]").removeClass("active");
					$("[data-slide-to='" + index + "']").addClass("active");
					option.onChange(index);
				}

				function auto() {
					clearTimeout(autoTimer);
					autoTimer = setTimeout(function () {

						if (mousehover && option.hoverPause) {
							return;
						}

						var index = $items.filter(".active").index() + 1;
						if (index > $items.length - 1) {
							index = 0
						}

						SlideTo(index);
						option.auto && auto();
					}, option.showTime);
				}

				option.width && $element.width(option.width);
				option.height && $element.height(option.height);
				SlideTo(Math.max(0, parseInt($items.filter(".active").index())));
				option.auto && auto();

				$element.on("mousemove", function () {
					mousehover = true
				});
				$element.on("mouseleave ", function () {
					mousehover = false;
					option.auto && auto();
				});

				$element.find("[data-slide-to]").on("click mouseenter", function () {
					SlideTo($(this).attr("data-slide-to"));
				});

				$element.find("[data-slide='prev']").on("click", function () {
					var index = $items.filter(".active").index() - 1;
					if (index < 0) {
						index = $items.length - 1
					}
					SlideTo(index);
				});

				$element.find("[data-slide='next']").on("click ", function () {
					var index = $items.filter(".active").index() + 1;
					if (index > $items.length - 1) {
						index = 0
					}
					SlideTo(index);
				});
			}
		)
	}

	$(".slidebox").slidebox()

})
;