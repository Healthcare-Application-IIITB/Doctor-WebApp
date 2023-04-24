import React from 'react'

const Notification = ({ notification, type, notify}) => {
  if (notification === null)
    return null

  return (
    <div>
    {notify &&
    <div className={`${type} show`} id="toast"><div id="desc">{notification}</div></div>
    }
    </div>
  )
}

export default Notification