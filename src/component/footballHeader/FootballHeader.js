import { FootballTable } from "../footballTable/FootballTable";
import { FootballResults } from "../footballResults/FootballResults";
import { TEXT_FOR_CREATE_PAGE } from "../../TEXT_FOR_CREATE_PAGE";

import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import TrashIcon from "@rsuite/icons/Trash";
import CopyIcon from '@rsuite/icons/Copy';
import MinusIcon from '@rsuite/icons/Minus';
import PlusIcon from '@rsuite/icons/Plus';

import './FootballHeader.scss'

export const FootballHeader = ({ league,
	                               color,
	                               update,
	                               setUpdate,
	                               setDataCreate,
	                               setIdTeam,
	                               setSeasonsActiveLeague,
	                               createButtonForAddSeason,
	                               createButtonForCopyLeague,
	                               setCopyDataLeagueOrNewSeason }) => {


	const [chooseSeason, setChooseSeason] = useState()
	const [menuSeasons, setMenuSeasons] = useState(false)

	const refMenuSeasons = useRef(null)

	const activeLeague = league.leagueName
	const activeSeason = league.seasons.find(el => el.seasonTime === chooseSeason)
		? league.seasons.find(el => el.seasonTime === chooseSeason)
		: league.seasons.find(el => el.seasonTime)

	const teamsOfSeason = activeSeason.teams
	const seasonOfLeague = activeSeason.seasonTime
	const copyData = {
		leagueName: league.leagueName,
		label: league.label,
		teams: teamsOfSeason
	}

	const dayKey = useMemo(() => `dayKey_${activeLeague}_${seasonOfLeague}`, [seasonOfLeague]);
	const dataInput = useMemo(() => `dataInput_${activeLeague}_${seasonOfLeague}`, [seasonOfLeague]);
	const dataTable = useMemo(() => `dataTable_${activeLeague}_${seasonOfLeague}`, [seasonOfLeague]);

	const leaguesInLocal = localStorage.getItem('leagues');
	const jsonLeagues = leaguesInLocal ? JSON.parse(leaguesInLocal) : [];
	const filterLeagues = jsonLeagues ? jsonLeagues.filter(league => league.leagueName !== activeLeague) : [];
	const dataActiveLeague = jsonLeagues ? jsonLeagues.find(league => league.leagueName === activeLeague) : [];

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
		const response = window.confirm("Are you sure you want to delete league? It will be impossible to restore them!");
		if (response) {
			if (filterLeagues) {
				localStorage.setItem('leagues', JSON.stringify(filterLeagues))
				dataActiveLeague.seasons.map(season => {
					localStorage.removeItem(`dataInput_${activeLeague}_${season.seasonTime}`);
					localStorage.removeItem(`dataTable_${activeLeague}_${season.seasonTime}`);
					localStorage.removeItem(`dayKey_${activeLeague}_${season.seasonTime}`)
				})
			}
			setUpdate(!update)
		} else {
			alert("Сancel");
		}
	}

	const createDataLeagueOrNewSeason = () => {
		setCopyDataLeagueOrNewSeason(copyData)
		setIdTeam(2)
	}

	const handleClickOutsideMenuSeasons =  (event) => {
		if (refMenuSeasons.current && !refMenuSeasons.current.contains(event.target)) {
			setMenuSeasons(false);
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
					                 update={update} />
				)
		} else if (decodeURI(window.location.href.slice((window.location.href.length) - 5)) === 'table') {
			return (
					<FootballTable activeLeague={activeLeague}
					               seasonOfLeague={seasonOfLeague}
					               teamsOfSeason={teamsOfSeason}
					               dataTable={dataTable}
					               update={update} />
				)
		}
	}

	return (
		<div className="football-header">
			<div className="football-container-header">
				<div className="football-container-header-league">
					{ league.label.length > 1  ? (
						<>
							<img className="football-container-header-league__label" style={{ objectFit: 'contain' }} src={ league.label } width="75px" height="50px"/>
							<div className="football-container-header-league__name">{ league.leagueName }</div>
						</>
					) : (
						<>
							<div className="football-container-header-league__label" style={{backgroundColor: league.colorLeague}}>{ league.label }</div>
							<div className="football-container-header-league__name">{ league.leagueName }</div>
						</>
					)
					}
				</div>
				<div className="football-container-header-league__group-button">
					{ createButtonForCopyLeague && (
						<div className="football-container-header-league__copy">
							<button className="football-container-header-league__buttons"
							        onClick={() => {
								        setDataCreate(TEXT_FOR_CREATE_PAGE.league)
								        createDataLeagueOrNewSeason()}}>
								<NavLink className="football-container-header-league__copy-league-button"
								         to='/new_league'>
									<CopyIcon />
								</NavLink>
								<span className="tooltip-copy-league">Copy league</span>
							</button>
						</div>
					) }
					{ createButtonForAddSeason && (
						<div className="football-container-header-league__delete">
							<button className="football-container-header-league__buttons"
							        onClick={() => deleteLeague()}>
								<NavLink className="football-container-header-league__delete-league-button"
								         to='/'>
									<TrashIcon />
								</NavLink>
								<span className="tooltip-delete-league">Delete league</span>
							</button>
						</div>
					) }
				</div>
			</div>
			<div className="football-container-header-seasons">
				<div ref={refMenuSeasons}
				     className={`dropdown-seasons${menuSeasons ? ' show-background-seasons' : ''}`}>
					<button
						className={`dropbtn-seasons${menuSeasons ? ' show-color-seasons' : ''}`}
					        onClick={ () => {
						        setMenuSeasons(!menuSeasons)
					        }}>
						Seasons
						{
							menuSeasons ?  <ArrowLeftLineIcon /> : <ArrowRightLineIcon />
						}
					</button>
					<div id="myDropdown3"
					     className={`dropdown-content-seasons${menuSeasons ? ' show-seasons' : ''}`}>
						{
							league.seasons.map((season, i) => (
								<NavLink to={ `/${encodeURI(league.pathPage)}/${ encodeURI(activeLeague) }/${ encodeURI(season.seasonTime) }/table` }
								         key={i}
								         onClick={ () => {
									         setChooseSeason(season.seasonTime)
									         setMenuSeasons(false)
								         }}>
									{season.seasonTime}
								</NavLink>
							))
						}
					</div>
				</div>

				{chooseSeason}

				{ createButtonForAddSeason && (
					<button className="football-container-header-seasons__add-season"
					        onClick={() => {
						        setDataCreate(TEXT_FOR_CREATE_PAGE.season)
						        createDataLeagueOrNewSeason()}}>
						<NavLink className="football-container-header-seasons__add-season-button"
						         to='/new_league'>
							<PlusIcon/>
						</NavLink>
						<span className="tooltip-text">Add season</span>
					</button>
				) }
				{ createButtonForAddSeason && (
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