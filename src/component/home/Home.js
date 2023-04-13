import { NavLink } from "react-router-dom";

import './Home.scss'

export const Home = ({
	                     dummyLeague,
	                     listLeagueHistory,
	                     setCopyDataForNewLeagueOrNewSeason}) => {


	return (
		<div className="home" >
			{
				listLeagueHistory.length === 0  && (
					<div className="home__menu">
						<NavLink to='/new_league'
						         onClick={ () => {
							         setCopyDataForNewLeagueOrNewSeason()
								 }}
						>
							Start
						</NavLink>
						<NavLink to={`/${encodeURI(dummyLeague.pathPage)}/${encodeURI(dummyLeague.leagueName)}/${encodeURI(dummyLeague.seasons[dummyLeague.seasons.length - 1].seasonTime)}/table`}
						>
							Demo version
						</NavLink>
					</div>
				)
			}
			{
				listLeagueHistory.length > 0 && (
					<div className="home-history">
						<div className="home-history-text">
							Last action...
						</div>
						{
							listLeagueHistory.map((page, i) => (
								<div
									className="home-history-league"
									key={i}
								>
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