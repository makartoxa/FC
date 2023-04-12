import { NavLink } from "react-router-dom";
import { TEXT_FOR_CREATE_PAGE } from "../../TEXT_FOR_CREATE_PAGE";

import './Home.scss'

export const Home = ({ dummyLeague,
	                     setDataCreate,
	                     setIdTeam,
	                     listLeagueHistory,
	                     setCopyDataLeagueOrNewSeason,
	                     setCreateButtonForAddSeason,
	                     setCreateButtonForCopyLeague }) => {


	return (
		<div className="home" >
			{
				!listLeagueHistory  && (
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
				)
			}
			{
				listLeagueHistory && (
					<div className="home-history">
						<div className="home-history-text">
							Last action...
						</div>
						{
							listLeagueHistory.map((page, i) => (
								<div className="home-history-league">
									<NavLink
										to={ `/${encodeURI(page.path)}/${encodeURI(page.leagueName)}/${encodeURI(page.season)}/table` }
									>
										{i + 1}. {page.leagueName} / {page.season}
									</NavLink>
									<div
										className="home-history-league-place"
										style={{backgroundColor: `${page.path.slice(0, 1).toUpperCase() === 'D' ? 'red' : ''}`}}
									>
											{
												page.path === 'demo' && (
													page.path
												)
											}
									</div>
								</div>
							))
						}
					</div>

				)
			}
		</div>
	)
}