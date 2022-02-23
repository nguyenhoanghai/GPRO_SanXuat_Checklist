https://www.cssscript.com/mc-datepicker/


How to use it:
1. To get started, insert the MCDatepicker’s JavaScript and Stylesheet in the document.

<link rel="stylesheet" href="/dist/mc-calendar.min.css" />
<script src="/dist/mc-calendar.min.js"></script>
2. Attach the date picker to an input field you provide. This will open a calendar interface in a modal popup where you can select a date by click.

<input id="example" type="text" />
const myDatePicker = MCDatepicker.create({ 
      el: '#example' 
})
3. Set the date format. Default: ‘DD-MMM-YYYY’.

const myDatePicker = MCDatepicker.create({ 
      el: '#example',
      dateFormat: 'MMM-DD-YYYY',
})
4. Determine the display mode: ‘modal’, ‘inline’, or ‘permanent’.

const myDatePicker = MCDatepicker.create({ 
      el: '#example',
      bodyType: 'inline',
})
5. Customize week days and month names.

const myDatePicker = MCDatepicker.create({ 
      el: '#example',
      customWeekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      customMonths: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
})
6. Disable specific dates.

const myDatePicker = MCDatepicker.create({ 
      el: '#example',
      disableWeekends: false,
      disableWeekDays: [], // ex: [0,2,5]
})
7. Determine whether to show the calendar header. Default: true.

const myDatePicker = MCDatepicker.create({ 
      el: '#example',
      showCalendarDisplay: false
})
8. Set the selected date on page load.

const myDatePicker = MCDatepicker.create({ 
      el: '#example',
      selectedDate: new date(), // today
})
9. More configuration options with default values.

const myDatePicker = MCDatepicker.create({ 
      el: '#example',
      context: document.body,
      autoClose: false,
      closeOndblclick: true,
      closeOnBlur: false,
      customOkBTN: 'OK',
      customClearBTN: 'Clear',
      customCancelBTN: 'CANCEL',
      firstWeekday: 0, // ex: 1 accept numbers 0-6;
      minDate: null,
      maxDate: null,
      jumpToMinMax: true,
      jumpOverDisabled: true,
      disableDates: [], // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
      allowedMonths: [], // ex: [0,1] accept numbers 0-11;
      allowedYears: [], // ex: [2022, 2023]
      disableMonths: [], /// ex: [3,11] accept numbers 0-11;
      disableYears: [], // ex: [2010, 2011]
      markDates: [],
      theme: defaultTheme,
})
10. API methods.

// open
myDatePicker.open();
// close
myDatePicker.close();
// reset
myDatePicker.reset();
// destroy
myDatePicker.destroy();
// get the index of the weekday
myDatePicker.getDay();
// get the day of the month
myDatePicker.getDate();
// get the index of the month
myDatePicker.getMonth();
// get the year
myDatePicker.getYear();
// get the the date object
myDatePicker.getFullDate();
// get the formated date
myDatePicker.getFormatedDate();
// push the provided callback to an array
myDatePicker.markDatesCustom(date);
// set date
myDatePicker.setFullDate(date);
myDatePicker.setDate(date);
// set month
myDatePicker.setMonth(month);
// set year
myDatePicker.setYear(year);
11. Events.

myDatePicker.onOpen(() => console.log('Do Something'));
myDatePicker.onClose(() => console.log('Do Something'));
myDatePicker.onCancel(() => console.log('Do Something'));
myDatePicker.onSelect((date, formatedDate) => console.log('Do Something'));
myDatePicker.onMonthChange(() => console.log('Do Something'));
myDatePicker.onYearChange(() => console.log('Do Something'));