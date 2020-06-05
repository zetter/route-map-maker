import React, {useState} from 'react'

const Settings = ({initialX, initialY, onSubmit, show}) => {

  const [x, setX] = useState(initialX)
  const [y, setY] = useState(initialY)

  const sanitizeNumber = (string) => {
    const number = parseInt(string)
    if (isNaN(number)) {
      return initialX
    } else {
      return number
    }
  }

  const submit = (e) => {
    const newX = sanitizeNumber(x)
    const newY = sanitizeNumber(y)
    setX(newX)
    setY(newY)
    onSubmit({size: {x: newX, y: newY}})
    e.preventDefault()
  }

  if (!show) {return null}

  return <div>
    <h3>Settings</h3>

    <p>The size of the repeated pattern:</p>
    <form onSubmit={submit}>
      <div>
        <label htmlFor="x">Tiles wide:</label>
        <input name="x" value={x} onChange={(e) => setX(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="y">Tiles high:</label>
        <input name="y" value={y} onChange={(e) => setY(e.target.value)}/>
      </div>

      <input type="submit" value="Regenerate"/>
    </form>
  </div>
}

export default Settings
