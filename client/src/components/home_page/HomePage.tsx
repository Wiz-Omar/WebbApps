import React from 'react'

import Grid, { GridProps } from './Grid'
import Navbar from './Navbar'
import { Image } from '../../App'

interface HomePageProps {
  images: Image[];
  callback: (sortField?: string, sortOrder?: string) => void;
  // callback: () => void;
}

const HomePage = ({images, callback}: HomePageProps) => {
  return (
    <div>
        <Navbar callback={callback}></Navbar>
        <Grid images={images} callback={callback}></Grid>
    </div>
  )
}

export default HomePage