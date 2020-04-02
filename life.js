
const dom = {
  container: document.querySelector('#gridContainer'),
  startBtn: document.querySelector('#start'),
  clearBtn: document.querySelector('#clear'),
  randomBtn: document.querySelector('#random'),
}

const params = {
  gridRows: 60,
  gridCols: 100,
  delay: 100,
  random: false,
}

let state
let interval

const getInitialState = ({ gridRows, gridCols, random }) => {
  let playing = false
  let grid = []
  for (let i = 0; i < gridRows; i += 1) {
    grid[i] = []
    for (let j = 0; j < gridCols; j += 1) {
      grid[i][j] = random ? Math.floor(Math.random() * 2) : 0
    }
  }

  return { grid, playing }
}

const updateView = ({ grid }) =>
  grid.forEach((x, i) =>
    x.forEach((y, j) => document
      .getElementById(`${i}_${j}`)
      .setAttribute('class', `${y === 1 ? 'live' : 'dead'}`)
    )
  )

const countNeighbors = (row, col) => {
  let rowLimit = params.gridRows - 1
  let colLimit = params.gridCols - 1
  let count = 0
  if (row > 0 && state.grid[row - 1][col] === 1)
    count += 1
  if (row > 0 && col < colLimit && state.grid[row - 1][col + 1] === 1)
    count += 1
  if (col < colLimit && state.grid[row][col + 1] === 1)
    count += 1
  if (row < rowLimit && col < colLimit && state.grid[row + 1][col + 1] === 1)
    count += 1
  if (row < rowLimit && state.grid[row + 1][col] === 1)
    count += 1
  if (row < rowLimit && col > 0 && state.grid[row + 1][col - 1] === 1)
    count += 1
  if (col > 0 && state.grid[row][col - 1] === 1)
    count += 1
  if (row > 0 && col > 0 && state.grid[row - 1][col - 1] === 1)
    count += 1

  return count
}

const applyRules = (row, col, isAlive) => {
  const neighbors = countNeighbors(row, col)
  if (neighbors === 3) return true
  if (isAlive && neighbors === 2) return true

  return false
}

const getNextGeneration = ({ grid }) => grid
  .map((x, i) => x.map((y, j) => applyRules(i, j, !!y) ? 1 : 0))

const cellClickHandler = evt => {
  const cell = evt.target
  const prevCellState = cell.getAttribute('class')
  const newCellState = prevCellState === 'dead' ? 'live' : 'dead'
  cell.setAttribute('class', newCellState)
  const [row, col] = cell.id.split('_').map(x => +x)
  state.grid[row][col] = newCellState === 'live' ? 1 : 0
}

const initViewGrid = ({ gridRows, gridCols }) => {
  dom.container.innerHTML = ''
  const table = document.createElement('table')

  for (let i = 0; i < gridRows; i += 1) {
    const tr = document.createElement('tr')
    for (let j = 0; j < gridCols; j += 1) {
      const cell = document.createElement('td')
      cell.setAttribute('id', `${i}_${j}`)
      cell.setAttribute('class', 'dead')
      cell.addEventListener('click', cellClickHandler)
      tr.appendChild(cell)
    }
    table.appendChild(tr)
  }

  dom.container.appendChild(table)
}

const play = () => {
  state.grid = getNextGeneration(state)
  updateView(state)
}

const init = () => {
  state = getInitialState(params)
  dom.startBtn.textContent = 'Start'
  clearInterval(interval)
  initViewGrid(params)
  updateView(state)
}

const startBtnHandler = () => {
  state.playing = !state.playing
  dom.startBtn.textContent = state.playing ? 'Pause' : 'Continue'
  state.playing
    ? interval = setInterval(play, params.delay)
    : clearInterval(interval)
}

const clearBtnHandler = () => {
  params.random = false
  init()
}

const randomBtnHandler = () => {
  params.random = true
  init()
}

dom.startBtn.addEventListener('click', startBtnHandler)
dom.clearBtn.addEventListener('click', clearBtnHandler)
dom.randomBtn.addEventListener('click', randomBtnHandler)

window.onload = init
