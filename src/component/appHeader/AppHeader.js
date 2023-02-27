import {NavLink} from "react-router-dom";
import {AiOutlineMenu, AiOutlineClose} from "react-icons/ai";
import MenuIcon from '@rsuite/icons/Menu';
import './AppHeader.scss';
import {useState} from "react";

export const AppHeader = () => {

	const [active, setActive] = useState(false)

	return (
		<div className="app-header">
			<div className="app-header__box">
				<div className="app-header__title">
					<span className="app-header__name">Football</span>
					<NavLink to='/' >information portal</NavLink>
				</div>
				<div className={`app-header__menu ${active ? 'active' : ''}` }
				     onClick={() => setActive(!active)}>
					<NavLink to='/'>Home</NavLink>
					<NavLink to='/table' >Table</NavLink>
					<NavLink to='/results'>Results</NavLink>
				</div>
				<div className="app-header__mobile-btn"
				     onClick={() => setActive(!active)}>
					{active ? <AiOutlineClose size="25px" color="#7F0013"/> : <AiOutlineMenu size="25px" color="#7F0013"/>}
				</div>
			</div>
		</div>
	)
}
