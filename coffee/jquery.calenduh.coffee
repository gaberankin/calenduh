Today = new Date()

class Calenduh
	opts:
		month: Today.getMonth()
		year: Today.getFullYear()
		date: null
		renderPrevNext: true
		maxDate: null
		minDate: null
		availableClass: 'available'
		unavailableClass: 'unavailable'
		target: null
		dayTemplate: '<span class="day">{day}</span>'
		prevDayTemplate: null
		nextDayTemplate: null
	@localization:
		months:
			'1': ['Jan', 'January']
			'2': ['Feb', 'February']
			'3': ['Mar', 'March']
			'4': ['Apr', 'April']
			'5': ['May', 'May']
			'6': ['Jun', 'June']
			'7': ['Jul', 'July']
			'8': ['Aug', 'August']
			'9': ['Sep', 'September']
			'10': ['Oct', 'October']
			'11': ['Nov', 'November']
			'12': ['Dec', 'December']
		weekdays:
			'0': ['S', 'Sun', 'Sunday']
			'1': ['M', 'Mon', 'Monday']
			'2': ['T', 'Tue', 'Tuesday']
			'3': ['W', 'Wed', 'Wednesday']
			'4': ['T', 'Thu', 'Thursday']
			'5': ['F', 'Fri', 'Friday']
			'6': ['S', 'Sat', 'Satuday']
	constructor: (options) ->
		@opts = $.extend(true, @opts, options)
		if @opts.date isnt null
			@setDate(@opts.date, false)

		if typeof @opts.target is 'string'
			@opts.target = $(@opts.target)
		else if typeof @opts.target isnt 'object' or !(@opts.target instanceof jQuery)
			@opts.target = null

		if @opts.prevDayTemplate is null
			@opts.prevDayTemplate = @opts.dayTemplate
		if @opts.nextDayTemplate is null
			@opts.nextDayTemplate = @opts.dayTemplate

		@render()
	setDate: (date, render = true) ->
		if date instanceof Date
			@opts.month = date.getMonth()
			@opts.year = date.getFullYear()
		if render
			return @render()
		return
	getDate:() ->
		return new Date(@opts.year, @opts.month, 1);
	getMonth: () ->
		return (new Date(@opts.year, @opts.month, 1)).getMonth()
	getYear: () ->
		return (new Date(@opts.year, @opts.month, 1)).getFullYear()
	render: () ->
		# get beginning of month, so that we can figure out where (in the week) the previous month begins
		now = new Date(@opts.year, @opts.month, 1, 0, 0, 0, 0)
		next = new Date(@opts.year, @opts.month + 1, 1, 0, 0, 0, 0)
		prev = new Date(now - 1000) #subtract 1 second, which will put the date back to the previous day
		html = '<ul class="calenduh calenduh-cf">'
		if prev.getDay() isnt 6	#if not ends on saturday
			prevMonth = prev.getMonth()
			prevYear = prev.getFullYear()
			prevDayEnd = prev.getDate()
			prevDayStart = prevDayEnd - prev.getDay()
			weekday = 0
			for d in [prevDayStart..prevDayEnd]
				html += "<li class=\"day-item prev-month day-#{weekday}#{if Calenduh.isToday(prevYear, prevMonth, d) then ' calenduh-today' else ''}\" data-year=\"#{prevYear}\" data-month=\"#{prevMonth}\" data-day=\"#{d}\">"
				if @opts.renderPrevNext
					html += @opts.prevDayTemplate.replace(/{day}/g, d)
				html += "</li>"
				weekday++
		mStart = 1
		mEnd = (new Date(next - 1000)).getDate()
		date = new Date(@opts.year, @opts.month, 1, 0, 0, 0)
		curMonth = date.getMonth();
		curYear = date.getFullYear()
		for d in [mStart..mEnd]
			date = new Date(@opts.year, @opts.month, d, 0, 0, 0)
			weekday = date.getDay()
			html += "<li class=\"day-item current-month day-#{weekday}#{if Calenduh.isToday(curYear, curMonth, d) then ' calenduh-today' else ''}\" data-year=\"#{curYear}\" data-month=\"#{curMonth}\" data-day=\"#{d}\">#{@opts.dayTemplate.replace(/{day}/g, d)}</li>"
		if weekday isnt 6
			nextMonth = next.getMonth();
			nextYear = next.getFullYear()
			nextDayStart = 1
			nextDayEnd = 6 - weekday
			for d in [nextDayStart..nextDayEnd]
				html += "<li class=\"day-item next-month day-#{weekday}#{if Calenduh.isToday(nextYear, nextMonth, d) then ' calenduh-today' else ''}\" data-year=\"#{nextYear}\" data-month=\"#{nextMonth}\" data-day=\"#{d}\">"
				if @opts.renderPrevNext
					html += @opts.nextDayTemplate.replace(/{day}/g, d)
				html += "</li>"
				weekday++

		if @opts.target is null
			# Return as a string if there ain't no place to put it.
			return html
		@opts.target.html(html)
		return
	@isToday: (date, month = false, day = false) ->
		if month isnt false and day isnt false
			date = new Date(date, month, day)
		return date.getMonth() is Today.getMonth() and date.getFullYear() is Today.getFullYear() and date.getDate() is Today.getDate()
	@format: (format, date = null) ->
		if date is null
			date = format
			format = 'mm/dd/yyyy'
		d = date.getDate()
		m = date.getMonth() + 1
		yyyy = date.getFullYear()

		dd = if d < 10 then '0' + d else d
		mm = if m < 10 then '0' + m else m
		mmm = Calenduh.localization.months[m + ''][0]
		mmmm = Calenduh.localization.months[m + ''][1]
		yy = (yyyy + '').substr(2)
	
		return format.replace(/yyyy/g, yyyy).replace(/yy/g, yy).replace(/mmmm/g, mmmm).replace(/mmm/g, mmm).replace(/mm/g, mm).replace(/m/g, m).replace(/dd/g, dd).replace(/d/g, d)

(($) ->
	$.fn.calenduh = (options) ->
		return @each(() ->
			$me = $(this);
			me = @
			@isInput = $me.is(":text")
			$container = $('<div class="calenduh-container"></div>').appendTo('body').hide()
			$controls = $("""<div class="calenduh-controls calenduh-cf">
					<a class="prev-month">prev</a>
					<span class="current-loc"></span>
					<a class="next-month">next</a>
				</div>""").appendTo($container);
			$calendar = $('<div class="calenduh-calendar"></div>').appendTo($container)

			options.target = $calendar
			@c = new Calenduh(options)
			selectedDay = null

			$calendar.on('mouseenter', '.day-item', () ->
				$d = $(this)
				$d.addClass('over-day')
				y = $d.attr('data-year')
				m = $d.attr('data-month')
				d = $d.attr('data-day')
				$me.trigger('calenduh.mouseenterday', [new Date(y, m, d)])
				return
			).on('mouseleave', '.day-item', () ->
				$d = $(this)
				$d.removeClass('over-day')
				y = $d.attr('data-year')
				m = $d.attr('data-month')
				d = $d.attr('data-day')
				$me.trigger('calenduh.mouseleaveday', [new Date(y, m, d)])
				return
			).on('click', '.day-item', () ->
				$d = $(this)
				if $d.hasClass('current-day')
					return
				y = $d.attr('data-year')
				m = $d.attr('data-month')
				d = $d.attr('data-day')
				selectedDay = new Date(y, m, d)
				args = [selectedDay, null]

				$selected = $('.current-day', $calendar)
				if $selected.size() > 0
					y = $selected.attr('data-year')
					m = $selected.attr('data-month')
					d = $selected.attr('data-day')
					args[1] = new Date(y, m, d)
				$selected.removeClass('current-day')
				$d.addClass('current-day')
				if me.isInput
					val = Calenduh.format(args[0])
					$me.val(val)
				$me.trigger('calenduh.selectday', args)
			)
			$me.focus(() ->
				pos = $me.position()
				h = $me.outerHeight()
				$container.css({
					position: 'absolute'
					top: pos.top + h
					left: pos.left
				}).show()
				return
			)
			$controls.on('click', '.next-month', () ->
				d = me.c.getDate()
				me.c.setDate(new Date(d.getFullYear(), d.getMonth() + 1, 1))
				$('.current-loc', $controls).text(Calenduh.format('mmm yyyy', me.c.getDate()))
				if selectedDay isnt null
					$("li[data-year=#{selectedDay.getFullYear()}][data-month=#{selectedDay.getMonth()}][data-day=#{selectedDay.getDate()}]", $calendar).addClass('current-day')
				$me.trigger('calenduh.nextmonth', [me.c.getDate()])
			).on('click', '.prev-month', () ->
				d = me.c.getDate()
				me.c.setDate(new Date(d.getFullYear(), d.getMonth() - 1, 1))
				$('.current-loc', $controls).text(Calenduh.format('mmm yyyy', me.c.getDate()))
				if selectedDay isnt null
					$("li[data-year=#{selectedDay.getFullYear()}][data-month=#{selectedDay.getMonth()}][data-day=#{selectedDay.getDate()}]", $calendar).addClass('current-day')
				$me.trigger('calenduh.prevmonth', [me.c.getDate()])
			)

		);
	return
)(jQuery)