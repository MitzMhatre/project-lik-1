import React from 'react'
import logo from "../../logo.png"
import { Link } from "react-router-dom"
import { ImSearch } from "react-icons/im"

const Header = () => {
    return (
        <nav className="header">

            {/* <Link to="/" className='link'><img src={logo} alt="logo" /></Link> */}
            <img src={logo} alt="logo" />
            <div>
                <Link to="/tvshows" >TV Shows</Link>
                <Link to="/movies" >Movies</Link>
                <Link to="/recent" >Recently Added</Link>
                <Link to="/mylist" >My List</Link>
            </div>

            <ImSearch />

        </nav>
    )
}

export default Header