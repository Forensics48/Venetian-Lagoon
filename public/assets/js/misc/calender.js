const picker = new easepick.create({
    element: "#datepicker",
    css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.1.6/dist/index.css"
    ],
    zIndex: 10,
    grid: 1,
    calendars: 1,
    lang: "de-DE",
    inline: true,
    plugins: [
        "RangePlugin"
    ],
    format: "DD MMM YYYY"
});
