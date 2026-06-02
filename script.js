const board=document.querySelector('.board');
const blockHeight=50;
const blockWidth=50;
const startBtn=document.querySelector(".start-btn");
const startGameModal=document.querySelector(".modal .start-game");
const gameOverModal=document.querySelector(".modal .game-over");
const resetBtn=document.querySelector(".restart-btn");
const modal=document.querySelector(".modal");
const scoreElement=document.querySelector("#score");
const highScoreElement=document.querySelector("#high-score");
const timeElement=document.querySelector("#time");

// Show start modal only at first load
if (gameOverModal) gameOverModal.style.display = "none";
if (startGameModal) startGameModal.style.display = "flex";

const cols=Math.floor(board.clientWidth/blockWidth);
const rows=Math.floor(board.clientHeight/blockHeight);
let intervalId=null;
let timeIntervalId=null;
let food={x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows)};
let score=0;
let highScore=Number(localStorage.getItem("highScore")) || 0;    
let time='00:00';
highScoreElement.innerText=highScore;

let direction="right"
const blocks=[];
let snake=[{
    x:1,
    y:3} 
    ]
    


for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
        const block=document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);

        block.dataset.pos = `${row},${col}`;
        blocks[`${row},${col}`]=block;
    }
}

// render the snake and food
function renderSnake(){
    snake.forEach(segment => {
        blocks[`${segment.x},${segment.y}`].classList.add("fill");     
    }); 
    blocks[`${food.x},${food.y}`].classList.add("food");
}

function gameLoop(){

    let head=null;

    // direction control
    if(direction==="left"){
        head={
            x:snake[0].x,
            y:snake[0].y-1
        }
    }
    else if(direction==="right"){
        head={
            x:snake[0].x,   
            y:snake[0].y+1
        }
    }
    else if(direction==="up"){
        head={
            x:snake[0].x-1,
            y:snake[0].y
        }
    }   
    else if(direction==="down"){
        head={
            x:snake[0].x+1,
            y:snake[0].y
        }
    }

    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        modal.style.display="flex";
        startGameModal.style.display="none";
        gameOverModal.style.display="flex";
        if(intervalId) clearInterval(intervalId);
        intervalId=null;
        if(timeIntervalId) clearInterval(timeIntervalId);
        timeIntervalId=null;
        return;
    }

    // food collision consume
    let ateFood = false;
    if(head.x===food.x && head.y===food.y){
        blocks[`${food.x},${food.y}`].classList.remove("food");
        food={
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
        blocks[`${food.x},${food.y}`].classList.add("food");

        ateFood = true;
        score += 10;
        scoreElement.innerText=score;

        if(score>highScore){
            highScore=score;
            localStorage.setItem("highScore",highScore);
            highScoreElement.innerText=highScore;
        }
    }

    // self collision
    snake.forEach(segment => {
        blocks[`${segment.x},${segment.y}`].classList.remove("fill");
    });
    snake.unshift(head);
    if(!ateFood) snake.pop();

    renderSnake();
}



// direction control
addEventListener("keydown",(e)=>{
    if(e.key==="ArrowLeft"){
        direction="left";
    }
    else if(e.key==="ArrowRight"){
        direction="right";
    }
    else if(e.key==="ArrowUp"){
        direction="up";
    }
    else if(e.key==="ArrowDown"){
        direction="down";
    }
});

function resetGame(){
    score=0;
    time='00:00';
    scoreElement.innerText=score;    
    timeElement.innerText=time;
    highScoreElement.innerText=highScore;

    modal.style.display="none";
    startGameModal.style.display="flex";
    gameOverModal.style.display="none";

    if(intervalId) clearInterval(intervalId);
    intervalId=null;
    if(timeIntervalId) clearInterval(timeIntervalId);
    timeIntervalId=null;

    // clear board visuals (prevents old snake/food staying on screen)
    for(let row=0;row<rows;row++){
        for(let col=0;col<cols;col++){
            blocks[`${row},${col}`].classList.remove("fill");
            blocks[`${row},${col}`].classList.remove("food");
        }
    }

    snake=[{
        x:1,
        y:3}            
    ]
    food={x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows)};
    renderSnake();
    intervalId = setInterval(gameLoop, 400);

    timeIntervalId=setInterval(()=>{
        let [minutes,seconds]=time.split(":").map(Number);
        seconds++;
        if(seconds>=60){
            seconds=0;
            minutes++;
        }
        time=`${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        timeElement.innerText=time;
    },1000);

}


startBtn.addEventListener("click",()=>{
    resetGame();
})

resetBtn.addEventListener("click",resetGame);



