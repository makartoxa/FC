import { NavLink } from "react-router-dom";
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import soccerBall from "../logo/soccerBall.png"

import './FootballLeagues.scss'

export const FootballLeagues = ({
	                                leagues,
	                                localPageHistory,
	                                updateHistory,
	                                setUpdateHistory }) => {

	return (
		<div className="football-league-container">
			<div className="football-league-header">
				<img src={soccerBall} alt="logo ball" width='45px' color={'red'}/>
				{
					leagues.length === 1 && (
						<div>
							Your created Football League
						</div>
					)
				}
				{
					leagues.length > 1 && (
						<div>
							Your created Football Leagues
						</div>
					)
				}

				{
					leagues.length === 0 && (
						<div>
							Football Leagues
						</div>
					)
				}
			</div>
			<div className="football-league-body">
				{
					leagues.map((league, i) => (
						<div
							className="football-league"
							key={i}
						>
							{
								<>
									{
										league.label.length > 1  ? (
											<img
												style={{ objectFit: 'contain', minWidth: '70px'}}
												src={ league.label }
												alt="league label"
												width="70px"
												height="40px"
											/>
										) : (
											<div
												className="football-league__label"
												style={{backgroundColor: league.colorLeague}}
											>
												{ league.label }
											</div>
										)
									}
									<div className="football-league-list-name">
										<NavLink
											onClick={() => {
												localPageHistory(league)
												setUpdateHistory(!updateHistory)
											}}
											to={`/${encodeURI(league.pathPage)}/${encodeURI(league.leagueName)}/${encodeURI(league.seasons[league.seasons.length - 1].seasonTime)}/table`}
										>
											{ league.leagueName }
											<span className="football-league-list-icon">
												<ArrowRightIcon />
											</span>
										</NavLink>
										<div className="football-league-list-dropdown-content">
											{
												league.seasons.map( (seasonTime, i) => {
													const dataForHistory = {
														leagueName: league.leagueName,
														pathPage: league.pathPage,
														seasons: [{seasonTime: seasonTime.seasonTime}]
													};

													return (
													<NavLink
														key={i}
														onClick={() => {
															localPageHistory(dataForHistory)
															setUpdateHistory(!updateHistory)
														}}
														to={`/${encodeURI(league.pathPage)}/${encodeURI(league.leagueName)}/${encodeURI(seasonTime.seasonTime)}/table`}
													>
														{seasonTime.seasonTime}
													</NavLink>
												)})
											}
										</div>
									</div>
								</>
							}
						</div>
						)
					)
				}

				{
					leagues.length === 0 && (
						<div className="football-league-no-exist">
							<div>There are not football leagues.</div>
							<div>
								You can create them
								<button>
									<NavLink
										to='/new_league'>
									here!
									</NavLink>
								</button>
							</div>
						</div>
					)
				}
			</div>
		</div>
	)
}