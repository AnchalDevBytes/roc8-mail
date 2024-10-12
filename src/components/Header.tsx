import React from 'react'

const Header = () => {
  return (
    <nav className='flex md:gap-10 gap-5 bg-background text-black items-center'>
        <span>Filter By: </span>
        <ul className='flex md:gap-10 justify-between gap-5 items-center'>
            <li>Unread</li>
            <li>Read</li>
            <li>Favorites</li>
        </ul>
    </nav>
  )
}

export default Header
