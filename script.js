const RANGE = () => Math.round(Math.random() * 19)

const space = document.getElementById('space')
const toggle = document.getElementById('toggle')
const pointer = document.getElementById('pointer')

let interval
let control = 'Arrows'
let shift    // [x, y]
let field = []

class Cell {
    constructor(x, y, blocked = false, food = false) {
        this.x = x
        this.y = y
        this.element = document.getElementById(String(20 * y + x))
        this.blocked = blocked
        this.food = food
    }
    
    block() {
        this.blocked = true
        this.element.style.backgroundColor = '#b50808'
        return this
    }
    
    unblock() {
        this.blocked = false
        this.element.style.backgroundColor = 'black'
        return this
    }
}

class BodyElement {
    constructor(pos, next, prev) {
        this.pos = pos
        this.next = next
        this.prev = prev
    }
}

class Snake {
    constructor() {
        this.head = new BodyElement(field[10][10].block(), null, null)
        this.tail = this.head
    }

    move() {
        const [dx, dy] = shift;
        let x = this.head.pos.x + dx
        let y = this.head.pos.y + dy
        const inFront = (y >= 0 && y < 20) ? field[y][x] : undefined
        if (inFront && (!inFront.blocked || this.tail.pos === inFront)) {
            console.log(inFront)
            if (!inFront.food) {
                this.tail.pos.unblock()
                this.head = new BodyElement(inFront.block(), this.head, null)
                this.head.next.prev = this.head
                this.tail = this.tail.prev
                this.tail.next = null
            } else {
                inFront.food = false
                this.head = new BodyElement(inFront.block(), this.head, null)
                this.head.next.prev = this.head
                setFood()
            }
        } else {
            clearInterval(interval)
            this.death()
            document.body.removeEventListener('keydown', direction)
            document.body.addEventListener('keydown', start)
        }
    }
    
    death() {
        if (!this.head.next) {
            this.head.pos.element.style.backgroundColor = 'white'
            setTimeout(() => {
                this.head.pos.unblock()
                space.innerHTML = `
                <div style = "width:400px; margin: auto;">
                    <p class = "game-over-message">YOU LOSE!</p>
                    <p class = "game-over-message">Press SPACE to try again</p>
                </div>`
            }, 100)
        } else {
            this.head.pos.element.style.backgroundColor = 'white'
            setTimeout(() => {
                this.head.pos.unblock()
                this.head = this.head.next
                this.death()
            }, 100)
        }
    }
}

function setFood() {
    const x = RANGE()
    const y = RANGE()
    if (!field[y][x].blocked) {
        field[y][x].food = true
        field[y][x].element.style.backgroundColor = '#00c4c4'
    } else {
        setFood()
    }
}

function direction(event) {
    switch (event.key) {
        case 'w':
            if (control === 'WASD' && shift[1] !== 1) shift = [0, -1]
            break 
        case 'a':
            if (control === 'WASD' && shift[0] !== 1) shift = [-1, 0]
            break 
        case 's':
            if (control === 'WASD' && shift[1] !== -1) shift = [0, 1]
            break 
        case 'd':
            if (control === 'WASD' && shift[0] !== -1) shift = [1, 0]
            break 
        case 'ц':
            if (control === 'WASD' && shift[1] !== 1) shift = [0, -1]
            break 
        case 'ф':
            if (control === 'WASD' && shift[0] !== 1) shift = [-1, 0]
            break 
        case 'ы':
            if (control === 'WASD' && shift[1] !== -1) shift = [0, 1]
            break 
        case 'в':
            if (control === 'WASD' && shift[0] !== -1) shift = [1, 0]
            break 
        case 'ArrowUp':
            if (control === 'Arrows' && shift[1] !== 1) shift = [0, -1]
            break 
        case 'ArrowLeft':
            if (control === 'Arrows' && shift[0] !== 1) shift = [-1, 0]
            break 
        case 'ArrowDown':
            if (control === 'Arrows' && shift[1] !== -1) shift = [0, 1]
            break 
        case 'ArrowRight':
            if (control === 'Arrows' && shift[0] !== -1) shift = [1, 0]
            break 
    }
}

function toggleAnimationToLeft() {
    let marginLeft = 37
    let marginRight = 3
    let animation = setInterval(() => {
        pointer.style.marginLeft = `${--marginLeft}px`
        pointer.style.marginRight = `${++marginRight}px`
        if (marginLeft === 3) clearInterval(animation)
    }, 4)
}

function toggleAnimationToRight() {
    let marginLeft = 3
    let marginRight = 37
    let animation = setInterval(() => {
        pointer.style.marginLeft = `${++marginLeft}px`
        pointer.style.marginRight = `${--marginRight}px`
        if (marginRight === 3) clearInterval(animation)
    }, 4)
}

function start(event) {
    if (event.key === ' ') {
        shift = [0, -1]
        space.innerHTML = ''
        for (let id = 0; id < 400; id++) {
            space.insertAdjacentHTML('beforeend', `
            <div id = "${id}" class = "cell"></div>`)
        }
        
        field = []
        for (let y = 0; y < 20; y++) {
            const row = []
            for (let x = 0; x < 20; x++) {
                row.push(new Cell(x, y))
            }
            field.push(row) // field[y][x]
        }
        
        document.body.removeEventListener('keydown', start)
        document.body.addEventListener('keydown', direction)
        
        const snake = new Snake()
        interval = setInterval(() => snake.move(), 500)
        setFood()
    }
}

toggle.onclick = function() {
    control === 'Arrows' ? toggleAnimationToLeft() : toggleAnimationToRight()
    control = control === 'Arrows' ? 'WASD' :'Arrows'
}
document.body.addEventListener('keydown', start)
