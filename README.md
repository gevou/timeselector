
# Introduction

A UI component built primarily for input on mobile devices but usable everywhere.

![time selector screenshot](screenshot.png "time selector screenshot")

# Usage

```
meteor add gevou:timeselector
```

You can easily pass a number of options as part of the component's data context. The data context is retrieved reactively i.e. if any of the options change after rendering the template the component will be updated and re-rendered accordingly.  

```html
<template name="MyTemplate">
  {{>timeSelector myOptions}}
</template>
```

```js
Template.MyTemplate.helpers({
  myOptions: function() {
    return {
      min: '09:00', // (optional) minimum allowed time. (Default 00:00)
      max: '17:00', // (optional) maximum allowed time. (Default 23:59)
      step: 30, // (optional) step in minutes. (Default 15 minutes)
      locale: 'en', // (optional) moment.js locale for displayed date/time (Default 'en')
      active: true // (optional) enable (true) or disable (false) input (Default 'true') 
    };
  }
});
```

# Retrieve the currently selected time

```js
  var selectedTime = $('.time-selector').attr('data-value');
```

# Capturing add/subtract events

timeSelector triggers a `timeSelectorChange` event every time the user clicks the `+` or `-` buttons. You can capture the event in your template event map as follows:

```js
Template.MyTemplate.events({
  'timeSelectorChange', function (e, tmpl, options) {
    // currently selected time is available in the options parameter

    var selectedTime = options.time; // this is a moment js object
  } 
}) 
```

# Set/Reset the currently selected time programmatically 

```js
  var newTime = moment('22:00','hh:mm');
  $('.time-selector').trigger('resetTimer', newTime);
```

# Using multiple simultaneous time selectors

Wrap the selectors in separate divs of separate sub-templates in order to be able to easily define selectors or use `Template.instance()` for retrieving the currently selected time and setting/reseting the currently selected time programmatically.

example TBA