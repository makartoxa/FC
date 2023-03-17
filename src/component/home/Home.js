import './Home.scss'
import {NavLink} from "react-router-dom";

export const Home = ({ dummyLeague }) => {
	return (
		<div className="home" >
			<div className="home__menu">
				<NavLink to='new_league'>
					Start
				</NavLink>
				<NavLink to={ `/${ encodeURI(dummyLeague.leagueName) }/table` }>
					Demo version
				</NavLink>
			</div>
		</div>
	)
}