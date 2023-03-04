const game_clock=1000;
const block_side_length=30;
const rows=20;
const cols=30;
const score_worth=10;
const shapes=[
    [],
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],[
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]
    ],[
        [0,0,0,0],
        [0,1,1,0],
        [1,1,0,0],
        [0,0,0,0]
    ],[
        [0,0,0,0],
        [0,1,1,0],
        [0,0,1,1],
        [0,0,0,0]
    ],[
        [0,0,0,0],
        [0,1,0,0],
        [1,1,1,0],
        [0,0,0,0]
    ],[
        [0,0,0,0],
        [0,0,1,0],
        [1,1,1,0],
        [0,0,0,0]
    ],[
        [0,0,0,0],
        [1,0,0,0],
        [1,1,1,0],
        [0,0,0,0]
    ],[
        [0,0,0,0],
        [0,1,1,0],
        [0,1,0,0],
        [0,1,0,0]
    ],[
        [0,0,0,0],
        [0,1,1,0],
        [0,0,1,0],
        [0,0,1,0]
    ],[
        [0,0,0,0],
        [0,1,0,0],
        [0,1,1,0],
        [0,0,1,0]
    ],[
        [0,0,0,0],
        [0,0,1,0],
        [0,1,1,0],
        [0,1,0,0]
    ],[
        [0,0,0,0],
        [0,1,0,0],
        [1,1,0,0],
        [1,0,0,0]
    ],
]
const colors=[
    '#000000',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#00FFFF',
    '#FF00FF',
    '#FF8000',
    '#8000FF',
    '#0080FF',
    '#FF0080',
    '#80FF00',
    '#00FF80',
];
class Piece{
    constructor(shape,ctx){
        this.shape=shape;
        this.ctx=ctx;
        this.x=Math.floor(cols/2)-2;
        this.y=0;
    }
    renderPiece(){
        this.shape.forEach((row,y)=>{
            row.forEach((block,x)=>{
                if(block===1){
                    this.ctx.fillStyle=colors[x%colors.length];
                    this.ctx.fillRect(this.x+x,this.y+y,1,1);
                }
            })
        })
    }
}
class ModelGamle{
    constructor(ctx){
        this.ctx=ctx;
        this.fallingPiece=null;
        this.grid=this.makingGrid()
    }
    makingGrid(){
        let grid=[];
        for(let i=0;i<rows;i++){
            grid.push([]);
            for(let j=0;j<cols;j++){
                grid[grid.length-1].push(0);
            }
        }
        return grid;
    }
    collision(x,y,candidate=null){
        const shape=candidate||this.fallingPiece.shape;
        const n=shape.length;
        for(let i=0;i<n;i++){
            for(let j=0;j<n;j++){
                if(shape[i][j]===1){
                    let p=x+j;
                    let q=y+i;
                    if(p>=0 && p<cols && q<rows){
                        if(this.grid[q][p]===1){
                            return true;
                        }
                    }
                    else{
                        return true;
                    }
                }
            }
        }
        return false;
    }
    renderGameState(){
        for(let i=0;i<this.grid.length;i++){
            for(let j=0;j<this.grid.length;j++){
                let cell=this.grid[i][j];
                this.ctx.fillStyle=colors[j%colors.length];
                this.ctx.fillRect(j,i,1,1);
            }
        }
        if(this.fallingPiece!==null){
            this.fallingPiece.renderPiece();
        }
    }
    moveDown(){
        if(this.fallingPiece===null){
            this.renderGameState();
            return;
        }else if(this.collision(this.fallingPiece.x,this.fallingPiece.y+1)){
            const shape=this.fallingPiece.shape;
            const x=this.fallingPiece.x;
            const y=this.fallingPiece.y;
            shape.forEach((row,i)=>{
                row.forEach((block,j)=>{
                    let p=x+j;
                    let q=y+i;
                    if(p>=0 && p<cols && q<rows&&block===1){
                        this.grid[q][p]=shape[i][j];
                    }
                })
            })
            if(this.fallingPiece.y===0){
                alert('Game Over');
                this.grid=this.makingGrid();
            }
        }else{
            this.fallingPiece.y++;
        }
        this.renderGameState();
    }
    move(right){
        if(this.fallingPiece===null){
            return;
        }
        let x=this.fallingPiece.x;
        let y=this.fallingPiece.y;
        if(right){
            if(!this.collision(x+1,y)){
                this.fallingPiece.x++;
            }
        }else{
            if(!this.collision(x-1,y)){
                this.fallingPiece.x--;
            }
        }
        this.renderGameState();
    }
    rotate(){
        if(this.fallingPiece!==null){
            let shape=[...this.fallingPiece.shape.forEach((row,i)=>[...row])];
            for(let y=0;y<shape.length;++y){
                for(let x=0;x<y;++x){
                    [shape[x][y],shape[y][x]]=[shape[y][x],shape[x][y]];
                }
            }
            shape.forEach(row=>row.reverse());
            if(!this.collision(this.fallingPiece.x,this.fallingPiece.y,shape)){
                this.fallingPiece.shape=shape;
            }
        }
        this.renderGameState();
    }
}
let canvas=document.getElementById('game-canvas');
let scoreboard=document.getElementById('scoreboard');
let ctx=canvas.getContext('2d');
ctx.scale(block_side_length,block_side_length);
let score=0;
const model=new ModelGamle(ctx);
setInterval(()=>{
    newGameState()
},game_clock);
let newGameState=()=>{
    if(model.fallingPiece===null){
        const rand=Math.floor(Math.random()*shapes.length);
        const newPiece=new Piece(shapes[rand],ctx);
        model.fallingPiece=newPiece;
        model.moveDown();
    }else{
        model.moveDown();
    }
}
const fullSend=()=>{
    const allFilled=(row)=>{
        for(let x of row){
            if(x===0){
                return false;
            }
        }
        return true;
    }
    for(let i=0;i<rows;i++){
        if(allFilled(model.grid[i])){
            score+=score_worth;
            model.grid.splice(i,1);
            model.grid.unshift(new Array(cols).fill(0));
        }
    }
    scoreboard.innerHTML=`Score: ${score}`;
}
document.addEventListener('keydown',event=>{
    event.preventDefault();
    switch(event.key){
        case 'w':
            model.rotate();
            break;
        case 'a':
            model.move(false);
            break;
        case 's':
            model.moveDown();
            break;
        case 'd':
            model.move(true);
            break;
    }
});