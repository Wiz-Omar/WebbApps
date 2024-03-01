import React from 'react'

import Grid, { GridProps } from './Grid'
import Navbar from './HomeNavbar'
import { Image } from '../../App'

import '../../App.css'

interface HomePageProps {
  images: Image[];
  callback: (sortField?: string, sortOrder?: string) => void;
  isLoading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ images, callback, isLoading }) => {
  return (
    <div>
      <Navbar callback={callback} />
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <Grid images={images} callback={callback} />
      )}
    </div>
  );
}

export default HomePage