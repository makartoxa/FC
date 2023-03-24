import './Home.scss'
import { NavLink } from "react-router-dom";
import {DUMMY_LEAGUE} from "../../DUMMY_LEAGUE";

export const Home = ({ dummyLeague }) => {

	const seasons = dummyLeague.seasons.find(el => el.seasonTime)

	return (
		<div className="home" >
			<div className="home__menu">
				<NavLink to='new_league'>
					Start
				</NavLink>
				<NavLink to={ `/${ encodeURI(dummyLeague.leagueName) }/${encodeURI(seasons.seasonTime)}/table` }>
					Demo version
				</NavLink>
			</div>
		</div>
	)
}