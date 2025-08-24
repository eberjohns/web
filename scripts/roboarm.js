const canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

canvas.style.background = "black";

let center_x = width/2;
let center_y = height/2;

let arm_length_1 = center_x/2;
let arm_length_2 = center_x/2-10;

if(center_x > center_y){
    arm_length_1 = center_y/2;
    arm_length_2 = center_y/2-10;
}

let angle_1 = -90;
let rad_angle_1 = angle_1*Math.PI/180;

let angle_2 = -0;
let rad_angle_2 = angle_2*Math.PI/180;

let px = center_x;
let py = center_y;

document.addEventListener("mousemove", function(event) {
    px = event.clientX;
    py = event.clientY;

    let dx = px - center_x;
    let dy = py - center_y;

    let distance = Math.sqrt(dx * dx + dy * dy);
    let target_angle = Math.atan2(dy, dx) * (180 / Math.PI); // angle from center to click

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    let a = clamp((distance ** 2 + arm_length_1 ** 2 - arm_length_2 ** 2) / (2 * distance * arm_length_1), -1, 1);
    let tri_angle = Math.acos(a) * (180 / Math.PI);

    angle_1 = target_angle - tri_angle;
    rad_angle_1 = angle_1 * Math.PI / 180;

    let b = clamp((arm_length_1 ** 2 + arm_length_2 ** 2 - distance ** 2) / (2 * arm_length_1 * arm_length_2), -1, 1);
    let elbow_angle = Math.acos(b) * (180 / Math.PI);

    angle_2 = 180 - elbow_angle;
    rad_angle_2 = angle_2 * Math.PI / 180;
});

function draw(){
    context.strokeStyle = "green";
    context.beginPath();
    context.arc(center_x,center_y,arm_length_1-arm_length_2,0,Math.PI*2);
    context.closePath();
    context.stroke();
    
    context.beginPath();
    context.arc(center_x,center_y,arm_length_1+arm_length_2,0,Math.PI*2);
    context.closePath();
    context.stroke();

    context.strokeStyle = "hsl(250,100%,20%)";
    context.beginPath();
    context.moveTo(center_x,center_y); //pinned to center
    context.lineTo(px,py);
    context.closePath();
    context.stroke();

    let x1_offset = arm_length_1 * Math.cos(rad_angle_1);
    let y1_offset = arm_length_1 * Math.sin(rad_angle_1);

    let x2_offset = arm_length_2 * Math.cos(rad_angle_1+rad_angle_2);
    let y2_offset = arm_length_2 * Math.sin(rad_angle_1+rad_angle_2);
    
    context.strokeStyle = "white";
    context.beginPath();
    context.moveTo(center_x,center_y); //pinned to center
    context.lineTo(center_x + x1_offset,center_y + y1_offset);
    context.closePath();
    context.stroke();

    context.strokeStyle = "red";
    context.beginPath();
    context.moveTo(center_x + x1_offset,center_y + y1_offset); //pinned to first line end
    context.lineTo(center_x + x1_offset + x2_offset,center_y + y1_offset + y2_offset);
    context.closePath();
    context.stroke();
}

let speed = 1;

function update(){
    angle_1 += speed;
    rad_angle_1 = angle_1*Math.PI/180;

    angle_2 += speed*2;
    rad_angle_2 = angle_2*Math.PI/180;
}

draw();

function loop(){
    context.clearRect(0,0,canvas.width,canvas.height);

    // update();
    draw();

    requestAnimationFrame(loop);
}

loop();