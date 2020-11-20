let click = 0;
let isWin = false;
const gameContainer = document.getElementById("game-container");
const boardContainer = document.getElementById("board-container");
const startGameBtn = document.getElementById("start");
startGameBtn.addEventListener("click",handleSubmit);

//on submit click call this function it do validation and intialize the game
function handleSubmit() {
  const rows = document.getElementById("rows");
  const cols = document.getElementById("columns");
  const bombs = document.getElementById("bombs");
  const error = document.getElementById("error");
  const backBtn = document.getElementById("back");
  let isValidForm = false;
  if(!(rows.value)){
    error.innerHTML = "Plaese enter rows";
  }
  else if(rows.value<3 || rows.value>20){
    error.innerHTML = "Please enter rows between 3 to 20";
  }
  else if(!(cols.value)){
    error.innerHTML = "Plaese enter columns";
    
  }
  else if(cols.value<3 || cols.value>20){
    error.innerHTML = "Please enter column between 3 to 20";
  }
  else if(!(bombs.value)){
    error.innerHTML = "Please enter no of bombs";
    
  }
  else if(bombs.value<0 || bombs.value>(Math.floor((rows.value*cols.value)*80)/100)){
    error.innerHTML = `Please enter bombs between 1 to ${Math.floor(((rows.value*cols.value)*80)/100)}`;
  }
  else{
    isValidForm = true;
  }
  setTimeout(()=>{
    error.innerHTML = "";
  },2000)

  if(isValidForm){
    click = 0;
    isWin = false;
    gameContainer.classList.add("hide");
    boardContainer.classList.remove("hide");
    ClearBoard();
    initGame(Number(rows.value),Number(cols.value),Number(bombs.value));
    // resetBtn.addEventListener("click",()=>resetGame(Number(rows.value),Number(cols.value),Number(bombs.value)));
    backBtn.addEventListener("click",()=>backBtnClickHandler());
  }
}

//inintlize the game
const initGame = function (n,m,x) {
  let click=0;
  let board = new Array(n).fill("").map((_) => new Array(m).fill(""));
  for (let i = 0; i < n; i++) {
    let row = document.createElement("div");
    row.style.width=`calc(100% *${m}/20 )`;
    row.style.height=`calc(100%*${n}/20)`;
    if(boardContainer.firstElementChild){
      boardContainer.firstElementChild.style.height = row.style.height;
      boardContainer.firstElementChild.style.width = row.style.width;
    }
    row.classList.add("row");
    for (let j = 0; j < m; j++) {
      let col = document.createElement("div");
      col.classList.add("col");
      col.setAttribute("id", i.toString() +" "+ j.toString());
      col.addEventListener("click", (event) => cellClickHandler(event,board,n,m,x));
      col.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        col.innerHTML = "!";
        col.classList.add("center");
        col.classList.add("dark");
        col.classList.add("danger");
      });
      row.appendChild(col,board);
    }
    boardContainer.appendChild(row);
  }
  setBomb(board,n,m,x);
};

//set the bomb at random place
const setBomb = function (board,n,m,x) {
  let i = 0;
  while (i < x) {
    let randomi = Math.floor(Math.random() * n);
    let randomj = Math.floor(Math.random() * m);
    if (board[randomi][randomj] !== "-1") {
      i++;
      board[randomi][randomj] = "-1";
    }
  }
  updateBoard(board,n,m);
};

//upadate the board this function maps each cell has nearest how many bomb 
const updateBoard = (board,n,m) => {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let bomb = 0;
      if (board[i][j] === "-1") {
        continue;
      }
      if (i > 0) {
        if (board[i - 1][j] === "-1") {
          bomb++;
        }
      }
      if (i < n - 1) {
        if (board[i + 1][j] === "-1") {
          bomb++;
        }
      }
      if (j > 0) {
        if (board[i][j - 1] === "-1") {
          bomb++;
        }
      }
      if (j < m - 1) {
        if (board[i][j + 1] === "-1") {
          bomb++;
        }
      }
      if (i > 0 && j > 0) {
        if (board[i - 1][j - 1] === "-1") {
          bomb++;
        }
      }
      if (i < n - 1 && j > 0) {
        if (board[i + 1][j - 1] === "-1") {
          bomb++;
        }
      }
      if (i < n - 1 && j < m - 1) {
        if (board[i + 1][j + 1] === "-1") {
          bomb++;
        }
      }
      if (j < m - 1 && i > 0) {
        if (board[i - 1][j + 1] === "-1") {
          bomb++;
        }
      }
      board[i][j] = bomb.toString();
    }
  }
};

//on cell click
const cellClickHandler = function (event,board,n,m,x) {
    let cell = event.target;
    let id = cell.id;
    let row = id.split(" ")[0];
    let col = id.split(" ")[1];
    if (board[row][col] === "-1") {
      gameOver();
    } else {
      openCell(cell,board,n,m,x)
    }
  
};

//open means revele the cell details
function openCell(cell,board,n,m,x){
  // const cell = document.getElementById(id);
  if(!cell.innerHTML){
    click++;
    const id = cell.id;
    let row = id.split(" ")[0];
    let col = id.split(" ")[1];
    cell.classList.add("center");
    cell.classList.add("dark");
    cell.classList.remove("danger");
    cell.innerHTML = board[row][col];
    if(cell.innerHTML==="0"){
      openAdjucentCell(Number(row),Number(col),board,n,m,x);
    }
    // console.log(click);
    if(click===((n*m)-x)){
      gameWin();
    }
  }
}

//open adjucent cell 
function openAdjucentCell(row,col,board,n,m,x){
   for(let i=-1;i<=1;i++){
     let adjucentRow = row - i;
     if(adjucentRow<0 || adjucentRow>n-1) continue;
     for(let j=-1;j<=1;j++){
      let adjucentCol = col + j;
      if(adjucentCol<0 || adjucentCol>m-1)  continue;
      const cell = document.getElementById(adjucentRow+" "+adjucentCol);
      if(!cell.innerHTML){
        openCell(cell,board,n,m,x);
      }
    }
   }
}

//on game over call this function
const gameOver = function () {
  alert("Aww...You lost the game");
  backBtnClickHandler();
};

//on game win call this function
const gameWin = function () {
  if(!isWin){
    isWin = true;
    setTimeout(()=>{
      alert("Congratulations...you won the game");
      backBtnClickHandler(); 
    })
  }
  
};

//on back button click this function call
const backBtnClickHandler = function() {
  gameContainer.classList.remove("hide");
  boardContainer.classList.add("hide");
}

//on clear board this button is called
const ClearBoard = function (){
  let elements = document.getElementsByClassName("row");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}