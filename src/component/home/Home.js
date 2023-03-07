import './Home.scss'
import {NavLink} from "react-router-dom";

export const Home = () => {
	return (
		<div className="home">
			<div className="home__menu">
				<NavLink to='leagues'>Start</NavLink>
				<NavLink to='demo/table' >Demo version</NavLink>
			</div>
		</div>
	)
}