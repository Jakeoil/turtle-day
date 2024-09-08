const turtle = "🐢";
const shower = "🚿";

window.onload = (event) => {
    const ele = document.getElementById("turtle-time");
    const now = new Date();
    ele.valueAsDate = now;
    console.log(ele);
    computeTurtleDay(now);
};

document.getElementById("turtle-time").onchange = (e) => {
    const datetimeString = document.getElementById("turtle-time").value;
    console.log("onchange " + datetimeString);
    const gmtDate = new Date(datetimeString);
    const localDateOffset = new Date(
        gmtDate.getTime() + gmtDate.getTimezoneOffset() * 60000
    );
    console.log("local date offset:" + localDateOffset);
    computeTurtleDay(localDateOffset);
};

const USNO_API = "https://aa.usno.navy.mil/api/";
const DOW = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const MONTH = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
/***
 *
 */
function computeTurtleDay(selectedDate) {
    //
    const localYear = selectedDate.getFullYear();
    const localMonth = selectedDate.getMonth(); // 0 to 11
    const localDate = selectedDate.getDate();
    const localDow = selectedDate.getDay();
    const localDateStr = `${DOW[localDow]}, ${MONTH[localMonth]} ${localDate}, ${localYear}`;
    console.log(localDateStr);
    console.log("selectedDate" + selectedDate.toString);

    const gmtDate = Date(localYear, localMonth, localDate, 12);
    const uri =
        USNO_API +
        "juliandate?date=" +
        localYear +
        "-" +
        (localMonth + 1) +
        "-" +
        localDate +
        "&time=12:00";
    console.log(uri);

    console.log({ gmtDate });
    console.log("localDate:" + localDate);
    displayTurtleDay(uri);
}

async function displayTurtleDay(uri) {
    try {
        console.log("fetching " + uri);
        const response = await fetch(uri);
        if (!response.ok) {
            console.log("bug");
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log({ data });
        const julianDay = JSON.stringify(data, null, 2);
        console.log(julianDay);
        const jd = data.data[0]["jd"];
        const parity = parseInt(jd) % 2 == 0;
        console.log(parity);
        if (parity) {
            // turtle day
            document.getElementById("t-text").innerHTML = "Turtle Day!";
            document.getElementById("emoji").innerHTML = turtle;
        } else {
            document.getElementById("t-text").innerHTML = "Shower Day!";
            document.getElementById("emoji").innerHTML = shower;
        }
    } catch (error) {
        document.getElementById("result").innerText = "Error: " + error.message;
    }
}

document.getElementById("fetch-button").addEventListener("click", async () => {
    try {
        // Get the current date and time
        let currentDate = new Date();
        console.log(currentDate);

        computeTurtleDay(currentDate);
    } catch (error) {
        document.getElementById("result").innerText = "Error: " + error.message;
    }
});
