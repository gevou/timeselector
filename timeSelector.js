_TimeSelector = function () {
  var dep = new Tracker.Dependency();
  var _selectedTime = {};

  return {
    updateTime: function (id, time) {
      id && time && ( _selectedTime[id] = time );
      dep.changed();
    },
    deleteTime: function (id) {
      id && time && _selectedTime[id] && delete _selectedTime[id];
      dep.changed();
    },
    getTime: function (id) {
      var selectedTime = id && _selectedTime[id].clone();
      dep.depend();
      return selectedTime;
    }
  }
}

TimeSelector = new _TimeSelector();

Template.timeSelector.onCreated(function() {
  var tmpl = this;

  tmpl.active = ReactiveVar();
  tmpl.id = null;

  tmpl.initial = tmpl.data.initial ? moment(tmpl.data.initial, "hh:mm") : moment();

  tmpl.autorun(function (c) {
    var data = Template.currentData();

    if (data) {
      tmpl.min = data.min ? moment(data.min,"hh:mm") : moment("00:00","hh:mm");
      tmpl.max = data.max ? moment(data.max,"hh:mm") : moment("23:59","hh:mm");
      tmpl.locale = data.locale ? data.locale : 'en';
      tmpl.step = +data.step || 15;
      tmpl.id = data.id ? data.id : Random.id();
      tmpl.showDate = data.showDate ? data.showDate : true;

      // make calculations easier
      tmpl.min.add(tmpl.step,'minutes');
      tmpl.max.subtract(tmpl.step,'minutes');

      moment.locale(tmpl.locale);

      if (typeof data.active === "undefined")
        tmpl.active.set(true);
      else
        tmpl.active.set(data.active);

      TimeSelector.updateTime(tmpl.id, _.clone(tmpl.initial));
    }
  });
});

Template.timeSelector.onDestroyed(function() {
  var tmpl = this;
  TimeSelector.deleteTime(tmpl.id);
});

Template.timeSelector.helpers({
  showDate: function () {
    var tmpl = Template.instance();
    return tmpl.showDate;
  },
  class: function () {
    return false;
  },
  time: function () {
    var tmpl = Template.instance();
    var time = TimeSelector.getTime(tmpl.id); 
    return time && time.format('HH:mm');
  },
  date: function () {
    var tmpl = Template.instance();
    var time = TimeSelector.getTime(tmpl.id); 
    return time && time.format('ddd DD MMM');
  },
  disabledClass: function () {
    var tmpl = Template.instance();
    return tmpl.active.get() ? '' : 'disabled'; 
  }
});

Template.timeSelector.events({
  'resetTimer': function (e, tmpl, time) {
    TimeSelector.updateTime(tmpl.id, time);
    return false;
  },
  'click [data-action="add"], click [data-action="subtract"]': function (e, tmpl) {
    e.preventDefault();

    if (tmpl.active.get()) {
      var time = _.clone(TimeSelector.getTime(tmpl.id));

      if (! time)
        return;

      var isAdd = (e.currentTarget.dataset.action === "add");
      var isSubtract = (e.currentTarget.dataset.action === "subtract");

      if (isAdd) {
        if (! time.isAfter(tmpl.max)) {
          time.add(tmpl.step,'minutes');       
        } else {
          time = tmpl.max.clone(); // max is one step less. see lines 26-27
          time.add(tmpl.step,'minutes');       
        }
      }
      else if (isSubtract) {
        if (! time.isBefore(tmpl.min)) {
          time.subtract(tmpl.step,'minutes');
        } else {
          time = tmpl.min.clone(); // min is one step less. see lines 26-27
          time.subtract(tmpl.step,'minutes');
        }
      }

      TimeSelector.updateTime(tmpl.id, time);

      tmpl.$(e.target).trigger('timeSelectorChange', {time: time, id: tmpl.id});
    }
    return false;
  }  
});