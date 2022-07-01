document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    calendar: [
      {
        date: "Jan 1",
        time: "All Day",
        holiday: "New Year's Day",
      },
      {
        date: getNthDayInMonth(3, "Mon", "Jan", 2022),
        time: "All Day",
        holiday: "MLK Day",
      },
      {
        date: getNthDayInMonth(3, "Mon", "Feb", 2022),
        time: "All Day",
        holiday: "Presidents' Day",
      },
      {
        date: "May 22",
        time: "12:00",
        holiday: "",
      },
      {
        date: getLastNthInMonth("Mon", "May", 2022),
        time: "All Day",
        holiday: "Memorial Day",
      },
      {
        date: getWeekendHoliday(new Date("July 4, 2022")),
        time: "All Day",
        holiday: "Independence Day",
      },
      {
        date: "Sep 4",
        time: "12:00",
        holiday: "",
      },
      {
        date: getNthDayInMonth(1, "Mon", "Sep", 2022),
        time: "All Day",
        holiday: "Labor Day",
      },
      {
        date: getNthDayInMonth(2, "Mon", "Oct", 2022),
        time: "All Day",
        holiday: "Columbus Day",
      },
      {
        date: "Nov 11",
        time: "All Day",
        holiday: "Veterans Day",
      },
      {
        date: "Nov 25",
        time: "12:00",
        holiday: "",
      },
      {
        date: "Nov 26",
        time: "All Day",
        holiday: "Thanksgiving",
      },
      {
        date: "Nov 27",
        time: "All Day",
        holiday: "Thanksgiving",
      },
      {
        date: "Dec 24",
        time: "12:00",
        holiday: "",
      },
      {
        date: "Dec 25",
        time: "All Day",
        holiday: "Christmas",
      },
      {
        date: "Dec 31",
        time: "12:00",
        holiday: "",
      },
    ],
  }));
});

function getNthDayInMonth(nth, weekday, monthstring, year) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = days.indexOf(weekday);
  const month = months.indexOf(monthstring);

  let d = new Date(year, month);
  let i = 1;

  while (d.getDay() !== day) {
    d.setDate(d.getDate() + 1);
  }

  while (i < nth) {
    d.setDate(d.getDate() + 7);
    i++;
  }

  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function getLastNthInMonth(weekday, monthstring, year) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = days.indexOf(weekday);
  const month = months.indexOf(monthstring);

  let d = new Date(year, month + 1);

  d.setDate(d.getDate() - 1);

  while (d.getDay() !== day) {
    d.setDate(d.getDate() - 1);
  }

  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function getWeekendHoliday(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  } else if (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  return `${months[date.getMonth()]} ${date.getDate()}`;
}
