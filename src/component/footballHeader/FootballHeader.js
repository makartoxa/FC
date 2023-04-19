import { FootballTable } from "../footballTable/FootballTable";
import { FootballResults } from "../footballResults/FootballResults";

import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import TrashIcon from "@rsuite/icons/Trash";
import CopyIcon from '@rsuite/icons/Copy';
import MinusIcon from '@rsuite/icons/Minus';
import PlusIcon from '@rsuite/icons/Plus';

import './FootballHeader.scss'

export const FootballHeader = ({
	                               league,
	                               update,
	                               setUpdate,
	                               updateHistory,
	                               setUpdateHistory,
	                               localPageHistory,
	                               setCopyDataForNewLeagueOrNewSeason }) => {


	const [chooseSeason, setChooseSeason] = useState()
	const [activeMenuSeasons, setActiveMenuSeasons] = useState(false)

	const refMenuSeasons = useRef(null)
	const navigate = useNavigate();

	const activeLeague = league.leagueName
	const activeSeason = league.seasons.find(el => el.seasonTime === chooseSeason)
		? league.seasons.find(el => el.seasonTime === chooseSeason)
		: league.seasons.find(el => el.seasonTime)

	const teamsOfSeason = activeSeason.teams
	const seasonOfLeague = activeSeason.seasonTime

	const dayKey = useMemo(() => `dayKey_${activeLeague}_${seasonOfLeague}`, [seasonOfLeague]);
	const dataInput = useMemo(() => `dataInput_${activeLeague}_${seasonOfLeague}`, [seasonOfLeague]);
	const dataTable = useMemo(() => `dataTable_${activeLeague}_${seasonOfLeague}`, [seasonOfLeague]);

	const leaguesInLocal = localStorage.getItem('leagues');
	const jsonLeagues = leaguesInLocal ? JSON.parse(leaguesInLocal) : null;
	const filterLeagues = jsonLeagues ? jsonLeagues.filter(league => league.leagueName !== activeLeague) : null;

	useEffect(() => {

		if (decodeURI(window.location.href.slice((window.location.href.length) - 7)) === 'results') {
			const datePeriod = decodeURI(window.location.href.slice((window.location.href.length) - 35, (window.location.href.length) - 8));
			setChooseSeason(datePeriod)
		} else if (decodeURI(window.location.href.slice((window.location.href.length) - 5)) === 'table') {
			const datePeriod = decodeURI(window.location.href.slice((window.location.href.length) - 33, (window.location.href.length) - 6));
			setChooseSeason(datePeriod)
		}
	}, [league])


	const deleteLeague = () => {
		if (filterLeagues) {
			localStorage.setItem('leagues', JSON.stringify(filterLeagues))
		}

		league.seasons.map(season => {
			localStorage.removeItem(`dataInput_${activeLeague}_${season.seasonTime}`);
			localStorage.removeItem(`dataTable_${activeLeague}_${season.seasonTime}`);
			localStorage.removeItem(`dayKey_${activeLeague}_${season.seasonTime}`)
		})


		const oldLocalPageHistory = localStorage.getItem('pageHistory');
		const jsonOldHistory = oldLocalPageHistory ? JSON.parse(oldLocalPageHistory) : null;
		if (jsonOldHistory) {
			const searchDeletePageInHistory = jsonOldHistory.filter(page => page.leagueName !==activeLeague )
			if (searchDeletePageInHistory.length === 0) {
				localStorage.removeItem('pageHistory')
			} else {
				localStorage.setItem('pageHistory', JSON.stringify(searchDeletePageInHistory))
			}
		}
		setUpdate(!update)
		setUpdateHistory(!updateHistory)
	}

	const handleButtonClick = (props) => {
		navigate(props);
	}

	const redirectAfterDeleteLeague = () => {
		const response = window.confirm("Are you sure you want to delete league? It will be impossible to restore them!");
		if (response) {
			deleteLeague();
			handleButtonClick('/leagues')
		} else {
			alert('Cancel');
		}
	}

	const createDataLeagueOrNewSeason = (props) => {
		setCopyDataForNewLeagueOrNewSeason({
			leagueName: league.leagueName,
			label: league.label,
			position: props,
			teams: teamsOfSeason
		})
		handleButtonClick('/new_league')
	}

	const handleClickOutsideMenuSeasons =  (event) => {
		if (refMenuSeasons.current && !refMenuSeasons.current.contains(event.target)) {
			setActiveMenuSeasons(false);
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutsideMenuSeasons)
		return () => {
			document.removeEventListener('mousedown', handleClickOutsideMenuSeasons)
		}
	}, [refMenuSeasons])

	const navigator = () => {
		if (decodeURI(window.location.href.slice((window.location.href.length) - 7)) === 'results') {
			return (
					<FootballResults activeLeague={activeLeague}
					                 seasonOfLeague={seasonOfLeague}
					                 teamsOfSeason={teamsOfSeason}
					                 dayKey={dayKey}
					                 dataInput={dataInput}
					                 dataTable={dataTable}
					                 handleButtonClick={handleButtonClick}
					/>
				)
		} else if (decodeURI(window.location.href.slice((window.location.href.length) - 5)) === 'table') {
			return (
					<FootballTable activeLeague={activeLeague}
					               seasonOfLeague={seasonOfLeague}
					               teamsOfSeason={teamsOfSeason}
					               dataTable={dataTable}
					/>
				)
		}
	}

	return (
		<div className="football-header">
			<div className="football-container-header">
				<div className="football-container-header-league">
					{ league.label.length > 1  ? (
						<>
							<img
								className="football-container-header-league__label"
								style={{ objectFit: 'contain' }}
								alt={"league"}
								src={ league.label }
								width="75px"
								height="50px"
							/>
							<div className="football-container-header-league__name">
								{ league.leagueName }
							</div>
						</>
					) : (
						<>
							<div
								className="football-container-header-league__label"
								style={{backgroundColor: league.colorLeague}}
							>
								{ league.label }
							</div>
							<div className="football-container-header-league__name">
								{ league.leagueName }
							</div>
						</>
					)
					}
				</div>
				<div className="football-container-header-league__group-button">
					{ league.pathPage === 'demo' && (
						<div className="football-container-header-league__copy">
							<button className="football-container-header-league__buttons"
							        onClick={() => {
								        createDataLeagueOrNewSeason('league')
									}}>
								<div className="football-container-header-league__copy-league-button">
									<CopyIcon />
								</div>
								<span className="tooltip-copy-league">Copy league</span>
							</button>
						</div>
					) }
					{ league.pathPage === 'league' && (
						<div className="football-container-header-league__delete">
							<button className="football-container-header-league__buttons"
							        onClick={() => {
								        redirectAfterDeleteLeague()
							        }}
							>
								<div className="football-container-header-league__delete-league-button">
									<TrashIcon />
								</div>
								<span className="tooltip-delete-league">Delete league</span>
							</button>
						</div>
					) }
				</div>
			</div>
			<div className="football-container-header-seasons">
				<div ref={refMenuSeasons}
				     className={`dropdown-seasons${activeMenuSeasons ? ' show-background-seasons' : ''}`}>
					<button
						className={`dropbtn-seasons${activeMenuSeasons ? ' show-color-seasons' : ''}`}
					        onClick={ () => {
						        setActiveMenuSeasons(!activeMenuSeasons)
					        }}>
						Seasons
						{
							activeMenuSeasons ?  <ArrowLeftLineIcon /> : <ArrowRightLineIcon />
						}
					</button>
					<div id="myDropdown3"
					     className={`dropdown-content-seasons${activeMenuSeasons ? ' show-seasons' : ''}`}>
						{
							league.seasons.map((season, i) => {
								const dataForHistory = {
									leagueName: activeLeague,
									pathPage: league.pathPage,
									seasons: [{seasonTime: season.seasonTime}]
								};
								return (
								<NavLink
									to={ `/${encodeURI(league.pathPage)}/${ encodeURI(activeLeague) }/${ encodeURI(season.seasonTime) }/table` }
									key={i}
									onClick={ () => {
										setUpdateHistory(!updateHistory)
										localPageHistory(dataForHistory)
										setChooseSeason(season.seasonTime)
										setActiveMenuSeasons(false)
									}}>
									{season.seasonTime}
								</NavLink>
								)
							})
						}
					</div>
				</div>

					{chooseSeason}

				{ league.pathPage === 'league' && (
					<button className="football-container-header-seasons__add-season"
					        onClick={() => {
						        createDataLeagueOrNewSeason('season')
							}}
					>
						<div className="football-container-header-seasons__add-season-button">
							<PlusIcon/>
						</div>
						<span className="tooltip-text">
							Add season
						</span>
					</button>
				) }
				{ league.pathPage === 'league' && (
					<button className="football-container-header-seasons__delete-season" style={{color: 'red'}}>
						<NavLink className="football-container-header-seasons__delete-season-button"
						         to='/new_league'>
							<MinusIcon />
						</NavLink>
						<span className="tooltip-text">Delete season</span>
					</button>
				)}
			</div>
			<div className="football-container-header-nav">
				<NavLink
					className="football-container-header-nav__button"
					to={ `/${encodeURI(league.pathPage)}/${ encodeURI(activeLeague) }/${ encodeURI(activeSeason.seasonTime) }/table` }>
						Table
				</NavLink>
				<NavLink
					className="football-container-header-nav__button"
					to={ `/${encodeURI(league.pathPage)}/${ encodeURI(activeLeague) }/${ encodeURI(activeSeason.seasonTime) }/results` }>
						Results
				</NavLink>
			</div>
			{
				navigator()
			}
		</div>
	)
}