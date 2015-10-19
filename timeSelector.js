// initial: moment()
// min: moment()
// max: moment() 
// step: minutes (see moment documentation)

Template.timeSelector.onCreated(function() {

  var tmpl = this;

  tmpl.time = ReactiveVar();
  tmpl.active = ReactiveVar();

  tmpl.initial = tmpl.data.initial ? moment(tmpl.data.initial, "hh:mm") : moment();

  tmpl.autorun(function (c) {
    var data = Template.currentData();

    if (data) {
      tmpl.min = data.min ? moment(data.min,"hh:mm") : moment("00:00","hh:mm");
      tmpl.max = data.max ? moment(data.max,"hh:mm") : moment("23:59","hh:mm");
      tmpl.locale = data.locale ? data.locale : 'en';
      tmpl.step = +data.step || 15;

      // make calculations easier
      tmpl.min.add(tmpl.step,'minutes');
      tmpl.max.subtract(tmpl.step,'minutes');

      moment.locale(tmpl.locale);

      if (typeof data.active === "undefined")
        tmpl.active.set(true);
      else
        tmpl.active.set(data.active);
    }
  });

  tmpl.time.set(_.clone(tmpl.initial));
});

Template.timeSelector.helpers({
  class: function () {
    return false;
  },
  time: function () {
    var tmpl = Template.instance();
    return tmpl.time.get().format('HH:mm');
  },
  date: function () {
    var tmpl = Template.instance();
    return tmpl.time.get().format('ddd DD MMM');    
  },
  disabledClass: function () {
    var tmpl = Template.instance();
    return tmpl.active.get() ? '' : 'disabled'; 
  }
});

Template.timeSelector.events({
  'resetTimer': function (e, tmpl, time) {
    tmpl.time.set(time);
    return false;
  },
  'click [data-action="add"], click [data-action="subtract"]': function (e, tmpl) {
    e.preventDefault();

    if (tmpl.active.get()) {
      var time = _.clone(tmpl.time.get());

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

      tmpl.time.set(time);
      tmpl.$(e.target).trigger('timeSelectorChange', {time: time, id: this.id});
    }
    return false;
  }  
});