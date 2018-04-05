
let time = document.getElementById("time");
let button = document.getElementById("button");
let message = document.getElementById("message");
let alarm = new Audio("audio.mp3");

let timeout = undefined;
let interval = undefined;
let msgInterval = undefined;

function setMessage(text){
	message.textContent = text;
}

function setAlarmMsg(millis){
	let msg = "Alarm in ";
	let a = Math.floor(millis/3600000);
	if(a > 0){msg += a+'h '};
	a = Math.floor((millis/60000)%60);
	if(a > 0){msg += a+'m '};
	msg += Math.floor((millis/1000)%60)+'s';
	setMessage(msg);
}

function getMillisToCompletion(){
	let s = time.valueAsDate;
	if(s == null){return null;}

	let d = new Date();
	s.setHours(s.getHours()-d.getHours());
	s.setMinutes(s.getMinutes()-d.getMinutes());
	s.setSeconds(-d.getSeconds());
	s.setMilliseconds(-d.getMilliseconds());
	
	d = s.getTime();
	while (d < 0) { // if date is in the past day
		s.setDate(s.getDate()+1);
		d = s.getTime();
	}
	return d;
}

function updateMessageTimer(){
	setAlarmMsg(getMillisToCompletion());
}

function playAlarm(){
	alarm.play();
	button.classList.remove("hide");
}

function stopAlarm(){
	alarm.pause();
	button.classList.add("hide");
}


function setAlarm(){
	clearInterval(msgInterval); // clear out any message updates
	let t = getMillisToCompletion();
	if(t != null){
		if(t > 0){
			setAlarmMsg(t);

			clearTimeout(timeout);
			timeout = setTimeout(()=>{
				playAlarm();
				clearInterval(interval);
				interval = setInterval(()=>{playAlarm();}, 86400000); // daily alarm
			}, t);
			msgInterval = setInterval(updateMessageTimer, 1000); // update every second
		}
	}else{
		setMessage("Alarm Cleared");
		clearTimeout(timeout);
		clearInterval(interval);
	}
}


alarm.loop = true;

let d = new Date();
let h = d.getHours();
let m = d.getMinutes();

time.value = (h<10?'0':'')+h+':'+(m<10?'0':'')+m;

time.addEventListener("input", setAlarm);
button.addEventListener("click", stopAlarm);
