import './Home.scss'
import maket_home from '../logo/maket_home.jpeg'
import {NavLink} from "react-router-dom";

export const Home = () => {
	return (
		<div className="home" >
			<div className="home__menu">
				<NavLink to='new_league'>Start</NavLink>
				<NavLink to='EnglandPremierLeague/table' >Demo version</NavLink>
			</div>
		</div>
	)
}