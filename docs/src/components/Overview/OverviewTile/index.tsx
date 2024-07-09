import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

interface OverviewProps {
    title: string,
    content: string
    src: string,
    reversed?: boolean
}

const OverviewTile = ({ title, content, src, reversed = false }: OverviewProps) => {
  return (
    <div className={clsx(styles.overviewTile, reversed && styles.tileReversed)}>
      <div className={styles.contentContainer}>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
      <div className={styles.imageContainer}>
          <img src={src}/>
      </div>
    </div>
  )
}

export default OverviewTile