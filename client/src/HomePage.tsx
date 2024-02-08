import React from 'react'

import Grid, { GridProps } from './components/Grid'
import Navbar from './components/Navbar'

const HomePage = ({images} : GridProps) => {
  return (
    <div>
        <Navbar></Navbar>
        <Grid images={images}></Grid>
    </div>
  )
}

export default HomePage