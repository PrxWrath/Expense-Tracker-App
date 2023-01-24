import React from 'react'
import classes from './Loader.module.css'

const Loader = (props) => {
  return (
    <div className={`${classes.loader} mx-auto ${props.className}`}></div>
  )
}

export default Loader