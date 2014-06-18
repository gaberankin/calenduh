(function() {
  var Calenduh, Today;

  Today = new Date();

  Calenduh = (function() {
    Calenduh.prototype.opts = {
      month: Today.getMonth(),
      year: Today.getFullYear(),
      date: null,
      renderPrevNext: true,
      maxDate: null,
      minDate: null,
      availableClass: 'available',
      unavailableClass: 'unavailable',
      target: null,
      dayTemplate: '<span class="day">{day}</span>',
      prevDayTemplate: null,
      nextDayTemplate: null
    };

    Calenduh.localization = {
      months: {
        '1': ['Jan', 'January'],
        '2': ['Feb', 'February'],
        '3': ['Mar', 'March'],
        '4': ['Apr', 'April'],
        '5': ['May', 'May'],
        '6': ['Jun', 'June'],
        '7': ['Jul', 'July'],
        '8': ['Aug', 'August'],
        '9': ['Sep', 'September'],
        '10': ['Oct', 'October'],
        '11': ['Nov', 'November'],
        '12': ['Dec', 'December']
      },
      weekdays: {
        '0': ['S', 'Sun', 'Sunday'],
        '1': ['M', 'Mon', 'Monday'],
        '2': ['T', 'Tue', 'Tuesday'],
        '3': ['W', 'Wed', 'Wednesday'],
        '4': ['T', 'Thu', 'Thursday'],
        '5': ['F', 'Fri', 'Friday'],
        '6': ['S', 'Sat', 'Satuday']
      }
    };

    function Calenduh(options) {
      this.opts = $.extend(true, this.opts, options);
      if (this.opts.date !== null) {
        this.setDate(this.opts.date, false);
      }
      if (typeof this.opts.target === 'string') {
        this.opts.target = $(this.opts.target);
      } else if (typeof this.opts.target !== 'object' || !(this.opts.target instanceof jQuery)) {
        this.opts.target = null;
      }
      if (this.opts.prevDayTemplate === null) {
        this.opts.prevDayTemplate = this.opts.dayTemplate;
      }
      if (this.opts.nextDayTemplate === null) {
        this.opts.nextDayTemplate = this.opts.dayTemplate;
      }
      this.render();
    }

    Calenduh.prototype.setDate = function(date, render) {
      if (render == null) {
        render = true;
      }
      if (date instanceof Date) {
        this.opts.month = date.getMonth();
        this.opts.year = date.getFullYear();
      }
      if (render) {
        return this.render();
      }
    };

    Calenduh.prototype.getDate = function() {
      return new Date(this.opts.year, this.opts.month, 1);
    };

    Calenduh.prototype.getMonth = function() {
      return (new Date(this.opts.year, this.opts.month, 1)).getMonth();
    };

    Calenduh.prototype.getYear = function() {
      return (new Date(this.opts.year, this.opts.month, 1)).getFullYear();
    };

    Calenduh.prototype.render = function() {
      var curMonth, curYear, d, date, html, mEnd, mStart, next, nextDayEnd, nextDayStart, nextMonth, nextYear, now, prev, prevDayEnd, prevDayStart, prevMonth, prevYear, weekday, _i, _j, _k;
      now = new Date(this.opts.year, this.opts.month, 1, 0, 0, 0, 0);
      next = new Date(this.opts.year, this.opts.month + 1, 1, 0, 0, 0, 0);
      prev = new Date(now - 1000);
      html = '<ul class="calenduh calenduh-cf">';
      if (prev.getDay() !== 6) {
        prevMonth = prev.getMonth();
        prevYear = prev.getFullYear();
        prevDayEnd = prev.getDate();
        prevDayStart = prevDayEnd - prev.getDay();
        weekday = 0;
        for (d = _i = prevDayStart; prevDayStart <= prevDayEnd ? _i <= prevDayEnd : _i >= prevDayEnd; d = prevDayStart <= prevDayEnd ? ++_i : --_i) {
          html += "<li class=\"day-item prev-month day-" + weekday + (Calenduh.isToday(prevYear, prevMonth, d) ? ' calenduh-today' : '') + "\" data-year=\"" + prevYear + "\" data-month=\"" + prevMonth + "\" data-day=\"" + d + "\">";
          if (this.opts.renderPrevNext) {
            html += this.opts.prevDayTemplate.replace(/{day}/g, d);
          }
          html += "</li>";
          weekday++;
        }
      }
      mStart = 1;
      mEnd = (new Date(next - 1000)).getDate();
      date = new Date(this.opts.year, this.opts.month, 1, 0, 0, 0);
      curMonth = date.getMonth();
      curYear = date.getFullYear();
      for (d = _j = mStart; mStart <= mEnd ? _j <= mEnd : _j >= mEnd; d = mStart <= mEnd ? ++_j : --_j) {
        date = new Date(this.opts.year, this.opts.month, d, 0, 0, 0);
        weekday = date.getDay();
        html += "<li class=\"day-item current-month day-" + weekday + (Calenduh.isToday(curYear, curMonth, d) ? ' calenduh-today' : '') + "\" data-year=\"" + curYear + "\" data-month=\"" + curMonth + "\" data-day=\"" + d + "\">" + (this.opts.dayTemplate.replace(/{day}/g, d)) + "</li>";
      }
      if (weekday !== 6) {
        nextMonth = next.getMonth();
        nextYear = next.getFullYear();
        nextDayStart = 1;
        nextDayEnd = 6 - weekday;
        for (d = _k = nextDayStart; nextDayStart <= nextDayEnd ? _k <= nextDayEnd : _k >= nextDayEnd; d = nextDayStart <= nextDayEnd ? ++_k : --_k) {
          html += "<li class=\"day-item next-month day-" + weekday + (Calenduh.isToday(nextYear, nextMonth, d) ? ' calenduh-today' : '') + "\" data-year=\"" + nextYear + "\" data-month=\"" + nextMonth + "\" data-day=\"" + d + "\">";
          if (this.opts.renderPrevNext) {
            html += this.opts.nextDayTemplate.replace(/{day}/g, d);
          }
          html += "</li>";
          weekday++;
        }
      }
      if (this.opts.target === null) {
        return html;
      }
      this.opts.target.html(html);
    };

    Calenduh.isToday = function(date, month, day) {
      if (month == null) {
        month = false;
      }
      if (day == null) {
        day = false;
      }
      if (month !== false && day !== false) {
        date = new Date(date, month, day);
      }
      return date.getMonth() === Today.getMonth() && date.getFullYear() === Today.getFullYear() && date.getDate() === Today.getDate();
    };

    Calenduh.format = function(format, date) {
      var d, dd, m, mm, mmm, mmmm, yy, yyyy;
      if (date == null) {
        date = null;
      }
      if (date === null) {
        date = format;
        format = 'mm/dd/yyyy';
      }
      d = date.getDate();
      m = date.getMonth() + 1;
      yyyy = date.getFullYear();
      dd = d < 10 ? '0' + d : d;
      mm = m < 10 ? '0' + m : m;
      mmm = Calenduh.localization.months[m + ''][0];
      mmmm = Calenduh.localization.months[m + ''][1];
      yy = (yyyy + '').substr(2);
      return format.replace(/yyyy/g, yyyy).replace(/yy/g, yy).replace(/mmmm/g, mmmm).replace(/mmm/g, mmm).replace(/mm/g, mm).replace(/m/g, m).replace(/dd/g, dd).replace(/d/g, d);
    };

    return Calenduh;

  })();

  (function($) {
    $.fn.calenduh = function(options) {
      return this.each(function() {
        var $calendar, $container, $controls, $me, me, selectedDay;
        $me = $(this);
        me = this;
        this.isInput = $me.is(":text");
        $container = $('<div class="calenduh-container"></div>').appendTo('body').hide();
        $controls = $("<div class=\"calenduh-controls calenduh-cf\">\n	<a class=\"prev-month\">prev</a>\n	<span class=\"current-loc\"></span>\n	<a class=\"next-month\">next</a>\n</div>").appendTo($container);
        $calendar = $('<div class="calenduh-calendar"></div>').appendTo($container);
        options.target = $calendar;
        this.c = new Calenduh(options);
        selectedDay = null;
        $calendar.on('mouseenter', '.day-item', function() {
          var $d, d, m, y;
          $d = $(this);
          $d.addClass('over-day');
          y = $d.attr('data-year');
          m = $d.attr('data-month');
          d = $d.attr('data-day');
          $me.trigger('calenduh.mouseenterday', [new Date(y, m, d)]);
        }).on('mouseleave', '.day-item', function() {
          var $d, d, m, y;
          $d = $(this);
          $d.removeClass('over-day');
          y = $d.attr('data-year');
          m = $d.attr('data-month');
          d = $d.attr('data-day');
          $me.trigger('calenduh.mouseleaveday', [new Date(y, m, d)]);
        }).on('click', '.day-item', function() {
          var $d, $selected, args, d, m, val, y;
          $d = $(this);
          if ($d.hasClass('current-day')) {
            return;
          }
          y = $d.attr('data-year');
          m = $d.attr('data-month');
          d = $d.attr('data-day');
          selectedDay = new Date(y, m, d);
          args = [selectedDay, null];
          $selected = $('.current-day', $calendar);
          if ($selected.size() > 0) {
            y = $selected.attr('data-year');
            m = $selected.attr('data-month');
            d = $selected.attr('data-day');
            args[1] = new Date(y, m, d);
          }
          $selected.removeClass('current-day');
          $d.addClass('current-day');
          if (me.isInput) {
            val = Calenduh.format(args[0]);
            $me.val(val);
          }
          return $me.trigger('calenduh.selectday', args);
        });
        $me.focus(function() {
          var h, pos;
          pos = $me.position();
          h = $me.outerHeight();
          $container.css({
            position: 'absolute',
            top: pos.top + h,
            left: pos.left
          }).show();
        });
        return $controls.on('click', '.next-month', function() {
          var d;
          d = me.c.getDate();
          me.c.setDate(new Date(d.getFullYear(), d.getMonth() + 1, 1));
          $('.current-loc', $controls).text(Calenduh.format('mmm yyyy', me.c.getDate()));
          if (selectedDay !== null) {
            $("li[data-year=" + (selectedDay.getFullYear()) + "][data-month=" + (selectedDay.getMonth()) + "][data-day=" + (selectedDay.getDate()) + "]", $calendar).addClass('current-day');
          }
          return $me.trigger('calenduh.nextmonth', [me.c.getDate()]);
        }).on('click', '.prev-month', function() {
          var d;
          d = me.c.getDate();
          me.c.setDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
          $('.current-loc', $controls).text(Calenduh.format('mmm yyyy', me.c.getDate()));
          if (selectedDay !== null) {
            $("li[data-year=" + (selectedDay.getFullYear()) + "][data-month=" + (selectedDay.getMonth()) + "][data-day=" + (selectedDay.getDate()) + "]", $calendar).addClass('current-day');
          }
          return $me.trigger('calenduh.prevmonth', [me.c.getDate()]);
        });
      });
    };
  })(jQuery);

}).call(this);
