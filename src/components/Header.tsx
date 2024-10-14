import React from 'react'

const Header = ({ setFilter } : { setFilter: (filter: string) => void }) => {
  return (
    <nav className='flex md:gap-10 gap-4 bg-background text-black items-center'>
        <span>Filter By: </span>
        <ul className='flex md:gap-10 justify-between gap-4 items-center'>
            <li className='cursor-pointer' onClick={() => setFilter("unread")}>Unread</li>
            <li className='cursor-pointer' onClick={() => setFilter("read")}>Read</li>
            <li className='cursor-pointer' onClick={() => setFilter("favorites")}>Favorites</li>
            <li className='cursor-pointer' onClick={() => setFilter("all")}>All</li>
        </ul>
    </nav>
  )
}

export default Header
