/*=========================================================
MALI YAM v5.0.0
APP.JS
Developer : Anele Bango
=========================================================*/


/*=========================================================
LOCAL STORAGE KEYS
=========================================================*/

const STORAGE={

SETTINGS:"maliyam_settings",

SESSIONS:"maliyam_sessions",

ACTIVE:"maliyam_active"

};


/*=========================================================
APP DATA
=========================================================*/

let settings=null;

let sessions=[];

let activeSession=null;

let uiTimer=null;

let toastTimer=null;

let confirmAction=null;

/*=========================================================
STARTUP
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

initApp

);


/*=========================================================
INITIALIZE
=========================================================*/

function initApp(){

loadStorage();

buildCycleDays();

bindButtons();

startClock();

updateDashboard();

checkFirstRun();

}


/*=========================================================
LOAD STORAGE
=========================================================*/

function loadStorage(){

settings=

JSON.parse(

localStorage.getItem(STORAGE.SETTINGS)

)||null;

sessions=

JSON.parse(

localStorage.getItem(STORAGE.SESSIONS)

)||[];

activeSession=

JSON.parse(

localStorage.getItem(STORAGE.ACTIVE)

)||null;

}


/*=========================================================
SAVE STORAGE
=========================================================*/

function saveSettings(){

localStorage.setItem(

STORAGE.SETTINGS,

JSON.stringify(settings)

);

}

function saveSessions(){

localStorage.setItem(

STORAGE.SESSIONS,

JSON.stringify(sessions)

);

}

function saveActive(){

if(activeSession){

localStorage.setItem(

STORAGE.ACTIVE,

JSON.stringify(activeSession)

);

}else{

localStorage.removeItem(

STORAGE.ACTIVE

);

}

}


/*=========================================================
BUILD PAY CYCLE DAYS
=========================================================*/

function buildCycleDays(){

const select=

document.getElementById("cycleStart");

select.innerHTML="";

for(let i=1;i<=31;i++){

const option=

document.createElement("option");

option.value=i;

option.textContent=i;

if(i===23){

option.selected=true;

}

select.appendChild(option);

}

}


/*=========================================================
FIRST RUN
=========================================================*/

function checkFirstRun(){

if(!settings){

showSetup();

}

}


/*=========================================================
SHOW SETUP
=========================================================*/

function showSetup(){

document

.getElementById("setupModal")

.classList

.remove("hidden");

}


/*=========================================================
HIDE SETUP
=========================================================*/

function hideSetup(){

document

.getElementById("setupModal")

.classList

.add("hidden");

}


/*=========================================================
SAVE SETUP
=========================================================*/

function saveSetup(){

const rate=

Number(

document.getElementById("hourlyRate").value

);

if(rate<=0){

toast(

"Enter a valid hourly rate."

);

return;

}

settings={

hourlyRate:rate,

cycleStart:Number(

document.getElementById("cycleStart").value

),

normalHours:Number(

document.getElementById("normalHours").value

),

lunchMinutes:Number(

document.getElementById("lunchMinutes").value

),

overtimeRate:Number(

document.getElementById("overtimeRate").value

),

sundayRate:Number(

document.getElementById("sundayRate").value

),

holidayRate:Number(

document.getElementById("holidayRate").value

),

sound:

document.getElementById("sound").checked,

vibration:

document.getElementById("vibration").checked

};

saveSettings();

hideSetup();

toast(

"Welcome to Mali Yam"

);

updateDashboard();

}


/*=========================================================
BUTTON EVENTS
=========================================================*/

function bindButtons(){

document
.querySelectorAll(".coffeePreset")
.forEach(function(btn){

btn.onclick=function(){

document
.querySelectorAll(".coffeePreset")
.forEach(function(b){

b.classList.remove("active");

});

btn.classList.add("active");

document.getElementById("coffeeAmount").value=

btn.dataset.value;

};

});

document
.getElementById("coffeeBtn")
.addEventListener(
"click",
buyCoffee
);

document

.getElementById("saveSetupBtn")

.addEventListener(

"click",

saveSetup

);

document

.getElementById("menuBtn")

.addEventListener(

"click",

openSidebar

);

document

.getElementById("overlay")

.addEventListener(

"click",

closeSidebar

);

document

.getElementById("dashboardBtn")

.addEventListener(

"click",

function(){

closeAllScreens();

closeSidebar();

}

);


document

.getElementById("reportsBtn")

.addEventListener(

"click",

function(){

showScreen(

"reportsScreen"

);

}

);

document

.getElementById("aboutBtn")

.addEventListener(

"click",

function(){

showScreen(

"aboutScreen"

);

}

);

document

.getElementById("supportBtn")

.addEventListener(

"click",

function(){

showScreen(

"supportScreen"

);

}

);

document
.getElementById("resetTodayBtn")
.addEventListener(
"click",
resetToday
);

document
.getElementById("resetCycleBtn")
.addEventListener(
"click",
resetCycle
);

document
.getElementById("resetAllBtn")
.addEventListener(
"click",
resetEverything
);


document
.getElementById("confirmCancel")
.addEventListener(
"click",
closeConfirm
);

document
.getElementById("confirmOk")
.addEventListener(
"click",
function(){

if(confirmAction){

confirmAction();

}

closeConfirm();

}
);

}

document.querySelectorAll(".backBtn").forEach(function(btn){

btn.addEventListener(

"click",

closeAllScreens

);

});
/*=========================================================
SIDEBAR
=========================================================*/

function openSidebar(){

document

.getElementById("sidebar")

.classList

.add("open");

document

.getElementById("overlay")

.classList

.add("show");

}


function closeSidebar(){

document

.getElementById("sidebar")

.classList

.remove("open");

document

.getElementById("overlay")

.classList

.remove("show");

}


/*=========================================================
SCREENS
=========================================================*/

function showScreen(id){

closeSidebar();

closeAllScreens();

document.getElementById(id).classList.remove("hidden");

if(id==="reportsScreen"){

renderCycleList();

}

}


function closeAllScreens(){

document

.querySelectorAll(".screen")

.forEach(function(screen){

screen.classList.add("hidden");

});

}


/*=========================================================
TOAST
=========================================================*/

function toast(message){

const box=

document.getElementById("toast");

box.textContent=message;

box.classList.remove("hidden");

box.classList.add("show");

clearTimeout(toastTimer);

toastTimer=

setTimeout(function(){

box.classList.remove("show");

setTimeout(function(){

box.classList.add("hidden");

},300);

},2500);

}


/*=========================================================
CLOCK
=========================================================*/

function startClock(){

if(uiTimer){

clearInterval(uiTimer);

}

uiTimer=

setInterval(

updateDashboard,

1000

);

}



/*=========================================================
HELPERS
=========================================================*/

function money(value){

return "R"+value.toFixed(2);

}

function hours(value){

return value.toFixed(2)+" Hours";

}

/*=========================================================
TIME HELPERS
=========================================================*/

function time(date){

return date.toLocaleTimeString(
"en-ZA",
{
hour:"2-digit",
minute:"2-digit"
}
);

}

function shortDate(date){

return date.toLocaleDateString(
"en-ZA",
{
day:"2-digit",
month:"2-digit",
year:"numeric"
}
);

}

function getMonthName(m){

const months=[
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

return months[Number(m)-1];

}

/*=========================================================
CHECK IN
=========================================================*/

document
.getElementById("checkInBtn")
.addEventListener(
"click",
checkIn
);

function checkIn(){

if(!settings){

toast("Complete setup first.");

return;

}

if(activeSession){

toast("You are already checked in.");

return;

}

activeSession={

start:new Date().toISOString(),

end:null,

mode:getWorkMode()

};

saveActive();

toast("Checked In");

updateDashboard();

}


/*=========================================================
CHECK OUT
=========================================================*/

document
.getElementById("checkOutBtn")
.addEventListener(
"click",
checkOut
);

function checkOut(){

if(!activeSession){

toast("You are not checked in.");

return;

}

activeSession.end=

new Date().toISOString();

sessions.push(activeSession);

saveSessions();

activeSession=null;

saveActive();

toast("Checked Out");

renderActivity();

updateDashboard();

}


/*=========================================================
CURRENT WORK MODE
=========================================================*/

function getWorkMode(){

return document.querySelector(

'input[name="mode"]:checked'

).value;

}


/*=========================================================
LIVE HOURS
=========================================================*/

function getLiveHours(){

if(!activeSession)

return 0;

return(

new Date()

-

new Date(activeSession.start)

)

/ 3600000;

}


/*=========================================================
LIVE MONEY
=========================================================*/

function getLiveMoney(){

if(!activeSession)

return 0;

let rate=settings.hourlyRate;

let hours=getLiveHours();

let multiplier=1;

if(activeSession.mode==="sunday"){

multiplier=settings.sundayRate;

}

if(activeSession.mode==="holiday"){

multiplier=settings.holidayRate;

}

return(

hours

*

rate

*

multiplier

);

}


/*=========================================================
TODAY TOTALS
=========================================================*/

function todayHours(){

let total=0;

let today=

new Date().toDateString();

sessions.forEach(function(session){

if(

new Date(session.start)

.toDateString()

===today

){

total+=calculateHours(session);

}

});

total+=getLiveHours();

return total;

}


function todayMoney(){

let total=0;

let today=

new Date().toDateString();

sessions.forEach(function(session){

if(

new Date(session.start)

.toDateString()

===today

){

total+=calculateMoney(session);

}

});

total+=getLiveMoney();

return total;

}


/*=========================================================
CALCULATE HOURS
=========================================================*/

function calculateHours(session){

return(

new Date(session.end)

-

new Date(session.start)

)

/3600000;

}


/*=========================================================
CALCULATE MONEY
=========================================================*/

function calculateMoney(session){

    const hrs = calculateHours(session);

    // Normal working day
    if(session.mode==="normal"){

        const normalHours = Math.min(
            hrs,
            settings.normalHours
        );

        const overtimeHours = Math.max(
            0,
            hrs - settings.normalHours
        );

        return (

            normalHours *
            settings.hourlyRate

        ) +

        (

            overtimeHours *
            settings.hourlyRate *
            settings.overtimeRate

        );

    }

    // Sunday
    if(session.mode==="sunday"){

        return (

            hrs *
            settings.hourlyRate *
            settings.sundayRate

        );

    }

    // Public Holiday

    return (

        hrs *
        settings.hourlyRate *
        settings.holidayRate

    );

}


/*=========================================================
ACTIVITY
=========================================================*/

/*=========================================================
ACTIVITY (V4 STYLE)
=========================================================*/

function renderActivity(){

const list=document.getElementById("activityList");

if(sessions.length===0){

list.innerHTML="No activity yet.";

return;

}

list.innerHTML="";

let grouped={};

sessions
.slice()
.reverse()
.forEach(function(session){

const day=new Date(session.start).toDateString();

if(!grouped[day]){

grouped[day]=[];

}

grouped[day].push(session);

});

Object.keys(grouped).forEach(function(day){

const heading=document.createElement("div");

heading.className="activityDay";

heading.textContent=day;

list.appendChild(heading);

grouped[day].forEach(function(session){

const row=document.createElement("div");

row.className="activityItem";

const start=new Date(session.start);

const end=new Date(session.end);

row.innerHTML=

"IN <strong>"+time(start)+
"</strong> - OUT <strong>"+time(end)+
"</strong> | "+session.mode.toUpperCase()+
" | "+calculateHours(session).toFixed(2)+"h"+
" | "+money(calculateMoney(session));

list.appendChild(row);

});

});

}


/*=========================================================
UPDATE DASHBOARD
=========================================================*/

function updateDashboard(){

if(activeSession){

document.getElementById("status").innerHTML=

"🟢 ON DUTY";

}else{

document.getElementById("status").innerHTML=

"🔴 OFF DUTY";

}

document.getElementById("todayHours").innerHTML=

hours(

todayHours()

);

document.getElementById("todayMoney").innerHTML=

money(

todayMoney()

);

document.getElementById("cycleMoney").innerHTML=

money(

cycleMoney()

);

renderActivity();

}
/*=========================================================
PAY CYCLE
=========================================================*/

function getCycleStartDate(){

if(!settings){

return new Date();

}

const today=new Date();

let year=today.getFullYear();

let month=today.getMonth();

let start=new Date(

year,

month,

settings.cycleStart,

0,

0,

0,

0

);

if(today.getDate()<settings.cycleStart){

start=new Date(

year,

month-1,

settings.cycleStart,

0,

0,

0,

0

);

}

return start;

}


function getCycleEndDate(){

let start=getCycleStartDate();

return new Date(

start.getFullYear(),

start.getMonth()+1,

settings.cycleStart-1,

23,

59,

59,

999

);

}

/*=========================================================
FIRST SESSION DATE
=========================================================*/

function getOldestSessionDate(){

    if(sessions.length===0){

        return null;

    }

    let oldest=new Date(sessions[0].start);

    sessions.forEach(function(session){

        const d=new Date(session.start);

        if(d<oldest){

            oldest=d;

        }

    });

    return oldest;

}

/*=========================================================
PREVIOUS PAY CYCLE
=========================================================*/

function getCycleStart(offset){

const start = getCycleStartDate();

start.setMonth(start.getMonth() - offset);

return start;

}

function getCycleEnd(offset){

const start = getCycleStart(offset);

return new Date(

start.getFullYear(),

start.getMonth()+1,

settings.cycleStart-1,

23,

59,

59,

999

);

}

/*=========================================================
PAY CYCLE TOTAL HOURS
=========================================================*/

function cycleHours(){

if(!settings){

return 0;

}

const start=getCycleStartDate();

let total=0;

sessions.forEach(function(session){

if(

new Date(session.start)>=start

){

total+=calculateHours(session);

}

});

total+=getLiveHours();

return total;

}

/*=========================================================
PAY CYCLE TOTAL MONEY
=========================================================*/

function cycleMoney(){

if(!settings){

return 0;

}

const start=getCycleStartDate();

let total=0;

sessions.forEach(function(session){

if(

new Date(session.start)>=start

){

total+=calculateMoney(session);

}

});

total+=getLiveMoney();

return total;

}

/*=========================================================
REPORTS
=========================================================*/

function renderCycleList(){

if(!settings) return;

const box=document.getElementById("reportsContent");

box.innerHTML="";

const oldest=getOldestSessionDate();

if(!oldest){

    box.innerHTML="<p>No pay cycles yet.</p>";

    return;

}

let offset=0;

while(true){

    const start=getCycleStart(offset);
    const end=getCycleEnd(offset);

    if(end<oldest){

        break;

    }

    const card=document.createElement("div");

    card.className="card";

    card.style.cursor="pointer";

    card.innerHTML=

    "<h3>"+

    (offset===0?"Current Pay Cycle":"Pay Cycle")+

    "</h3>"+

    "<p><strong>"+

    shortDate(start)+

    " - "+

    shortDate(end)+

    "</strong></p>";

    card.onclick=function(){

    renderCycleReport(start,end,offset===0);

};

    box.appendChild(card);

    offset++;

}


}


/*=========================================================
PAY CYCLE REPORT
=========================================================*/

function renderCycleReport(start,end,isCurrent){

const box=document.getElementById("reportsContent");

box.innerHTML="";

const back=document.createElement("button");

back.className="backBtn";

back.textContent="Back to Pay Cycles";

back.onclick=renderCycleList;

box.appendChild(back);

const title=document.createElement("div");

title.className="card";

title.innerHTML=

"<h3>"+

(isCurrent?"Current Pay Cycle":"Pay Cycle")+

"</h3>"+

"<p><strong>"+

shortDate(start)+

" - "+

shortDate(end)+

"</strong></p>";

box.appendChild(title);

let totalHours=0;
let totalMoney=0;

let normalHours=0;
let sundayHours=0;
let holidayHours=0;
let overtimeHours = 0;

const cycleSessions=sessions.filter(function(session){

const d=new Date(session.start);

return d>=start && d<=end;

});

if(cycleSessions.length===0){

const empty=document.createElement("div");

empty.className="card";

empty.innerHTML="<p>No shifts in this pay cycle.</p>";

box.appendChild(empty);

return;

}

let grouped={};

cycleSessions.forEach(function(session){

const day=new Date(session.start).toDateString();

if(!grouped[day]){

grouped[day]=[];

}

grouped[day].push(session);

});

/*=========================================================
CALCULATE TOTALS
=========================================================*/

cycleSessions.forEach(function(session){

    const hrs = calculateHours(session);
    const pay = calculateMoney(session);

    totalHours += hrs;
    totalMoney += pay;

    if(session.mode==="normal"){

        const normalWorked=Math.min(
            hrs,
            settings.normalHours
        );

        const overtimeWorked=Math.max(
            0,
            hrs-settings.normalHours
        );

        normalHours += normalWorked;
        overtimeHours += overtimeWorked;

    }

    else if(session.mode==="sunday"){

        sundayHours += hrs;

    }

    else{

        holidayHours += hrs;

    }

});

const totals=document.createElement("div");

totals.className="card";

let html="<h3>Pay Summary</h3>";

if(normalHours>0){

html+=
"<p><strong>Normal</strong><br>"+
normalHours.toFixed(2)+"h | "+
money(normalHours*settings.hourlyRate)+
"</p>";

}

if(sundayHours>0){

html+=
"<p><strong>Sunday</strong><br>"+
sundayHours.toFixed(2)+"h | "+
money(
sundayHours*
settings.hourlyRate*
settings.sundayRate
)+
"</p>";

}

if(holidayHours>0){

html+=
"<p><strong>Holiday</strong><br>"+
holidayHours.toFixed(2)+"h | "+
money(
holidayHours*
settings.hourlyRate*
settings.holidayRate
)+
"</p>";

}

if(overtimeHours>0){

html+=
"<p><strong>Potential Overtime</strong><br>"+
overtimeHours.toFixed(2)+"h | "+
money(
overtimeHours*
settings.hourlyRate*
settings.overtimeRate
)+
"</p>";

}

html+=
"<hr>"+
"<p><strong>Total Hours</strong><br>"+
totalHours.toFixed(2)+"h</p>"+

"<p><strong>Total Earnings</strong><br>"+
money(totalMoney)+
"</p>";

totals.innerHTML=html;

box.appendChild(totals); 



/*=========================================================
EXPORT PDF BUTTON
=========================================================*/

const exportBtn=document.createElement("button");

exportBtn.className="saveBtn";

exportBtn.textContent=" Save PDF";

exportBtn.onclick=function(){

exportCurrentReportPDF();

};

box.appendChild(exportBtn);

function exportCurrentReportPDF(){

const { jsPDF }=window.jspdf;

const pdf=new jsPDF();

let y=20;

pdf.setFontSize(20);
pdf.text("Mali Yam",20,y);

y+=8;

pdf.setFontSize(12);
pdf.text("Pay Cycle Report",20,y);

y+=15;

pdf.setFontSize(11);

document.querySelectorAll("#reportsContent .card, #reportsContent .activityDay, #reportsContent .activityItem").forEach(function(item){

const text=item.innerText.split("\n");

text.forEach(function(line){

if(y>280){

pdf.addPage();

y=20;

}

pdf.text(line,20,y);

y+=7;

});

y+=4;

});

pdf.save("Pay Cycle Report.pdf");

}

/*=========================================================
ACTIVITY
=========================================================*/

Object.keys(grouped).forEach(function(day){

const heading=document.createElement("div");

heading.className="activityDay";

heading.textContent=day;

box.appendChild(heading);

grouped[day].forEach(function(session){

const hrs=calculateHours(session);

const pay=calculateMoney(session);

const row=document.createElement("div");

row.className="activityItem";

row.innerHTML=

"IN <strong>"+

time(new Date(session.start))+

"</strong> - OUT <strong>"+

time(new Date(session.end))+

"</strong><br>"+

session.mode.toUpperCase()+

" | "+

hrs.toFixed(2)+

"h | "+

money(pay);

box.appendChild(row);

});

});

}



/*=========================================================
RESET TODAY
=========================================================*/

function resetToday(){

showConfirm(

"Reset Today",

"This will permanently delete today's work history.",

function(){

const today=new Date().toDateString();

sessions=sessions.filter(function(session){

return new Date(session.start).toDateString()!==today;

});

saveSessions();

updateDashboard();

toast("Today's activity reset.");

}

);

return;

}

/*=========================================================
RESET PAY CYCLE
=========================================================*/

function resetCycle(){

showConfirm(

"Reset Pay Cycle",

"This will permanently delete every shift in the current pay cycle.",

function(){

const start=getCycleStartDate();

sessions=sessions.filter(function(session){

return new Date(session.start)<start;

});

saveSessions();

updateDashboard();

toast("Pay cycle reset.");

}

);

return;

}

/*=========================================================
RESET EVERYTHING
=========================================================*/

function resetEverything(){

showConfirm(

"Reset Everything",

"This will permanently delete ALL saved data and settings.",

function(){

localStorage.clear();

settings=null;

sessions=[];

activeSession=null;

location.reload();

}

);

return;

}

/*=========================================================
CUSTOM CONFIRM
=========================================================*/

function showConfirm(title,message,callback){

document.getElementById("confirmTitle").textContent=title;

document.getElementById("confirmMessage").textContent=message;

confirmAction=callback;

document
.getElementById("confirmModal")
.classList
.remove("hidden");

}

function closeConfirm(){

document
.getElementById("confirmModal")
.classList
.add("hidden");

confirmAction=null;

}

function buyCoffee(){

let amount=

Number(

document.getElementById("coffeeAmount").value

);

if(amount<10){

toast(

"Minimum contribution is R10."

);

return;

}

const form=document.createElement("form");

form.method="POST";

form.action="https://payment.payfast.io/eng/process";

form.target="_blank";

form.innerHTML=`

<input type="hidden" name="cmd" value="_paynow">

<input type="hidden" name="receiver" value="23133140">

<input type="hidden" name="amount" value="${amount.toFixed(2)}">

<input type="hidden" name="item_name" value="Buy the developer a coffee">

<input type="hidden" name="item_description"

value="Thank you for supporting Mali Yam.">

`;

document.body.appendChild(form);

form.submit();

form.remove();

}