import { NavLink } from "react-router-dom";

import './NavBar.scss'

export const NavBar = () => {
	return (
		<nav>
			<NavLink to='/' >Home</NavLink>
			/
			<NavLink to='/results'>Results</NavLink>
		</nav>
	)
}