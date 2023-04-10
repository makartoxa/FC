import { NavLink } from "react-router-dom";
import { TEXT_FOR_CREATE_PAGE } from "../../TEXT_FOR_CREATE_PAGE";

import './Home.scss'

export const Home = ({ dummyLeague,
	                     setDataCreate,
	                     setIdTeam,
	                     setCopyDataLeagueOrNewSeason,
	                     setCreateButtonForAddSeason,
	                     setCreateButtonForCopyLeague }) => {

	const seasons = dummyLeague.seasons.find(el => el.seasonTime)

	return (
		<div className="home" >
			<div className="home__menu">
				<NavLink to='/new_league'
				         onClick={ () => {
					         setDataCreate(TEXT_FOR_CREATE_PAGE.league)
					         setIdTeam(2)
					         setCopyDataLeagueOrNewSeason() } } >
					Start
				</NavLink>
				<NavLink to={`/${encodeURI(dummyLeague.pathPage)}/${encodeURI(dummyLeague.leagueName)}/${encodeURI(dummyLeague.seasons[dummyLeague.seasons.length - 1].seasonTime)}/table`}
				         onClick={ () => {
							 setCreateButtonForAddSeason(false)
					         setCreateButtonForCopyLeague(true) }}>
					Demo version
				</NavLink>
			</div>
		</div>
	)
}