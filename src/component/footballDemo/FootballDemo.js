import '../appHeader/AppHeader.scss'
import {NavLink, Outlet } from "react-router-dom";
import { Dropdown, ButtonToolbar } from 'rsuite';

export const FootballDemo = () => {
	return (
		<div>
			<div className="app-header__sub-menu">
				<NavLink to='/demo/table'>Table</NavLink>
				<NavLink to='/demo/results' >Results</NavLink>
			</div>
			<Outlet />
		</div>
	);
}