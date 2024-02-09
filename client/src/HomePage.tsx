import React from 'react'

import Grid, { GridProps } from './components/Grid'
import Navbar from './components/Navbar'
import { Image } from './App'

interface HomePageProps {
  images: Image[];
  callback: (sortField?: string, sortOrder?: string) => void;
}

const HomePage = ({images, callback}: HomePageProps) => {
  return (
    <div>
        <Navbar callback={callback}></Navbar>
        <Grid images={images}></Grid>
    </div>
  )
}

export default HomePage