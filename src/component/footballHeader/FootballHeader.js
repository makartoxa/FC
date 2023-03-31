import './FootballHeader.scss'
import TrashIcon from "@rsuite/icons/Trash";
import CopyIcon from '@rsuite/icons/Copy';
import { NavLink } from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {FootballTable} from "../footballTable/FootballTable";
import {FootballResults} from "../footballResults/FootballResults";
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import MinusIcon from '@rsuite/icons/Minus';
import PlusIcon from '@rsuite/icons/Plus';
import {TEXT_FOR_CREATE_PAGE} from "../../TEXT_FOR_CREATE_PAGE";


export const FootballHeader = ({ league, color, update, setDataCreate, setIdTeam, createButtonForAddSeason, createButtonForCopyLeague, setCopyDataLeagueOrNewSeason }) => {

	const LEAGUE = league.seasons.map(el => el.seasonTime)

	const [chooseSeason, setChooseSeason] = useState(LEAGUE.find(el => el))
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
					<FootballResults activeLeague={activeLeague} seasonOfLeague={seasonOfLeague} teamsOfSeason={teamsOfSeason} update={update} color={color} />
				)
		} else if (decodeURI(window.location.href.slice((window.location.href.length) - 5)) === 'table') {
			return (
					<FootballTable activeLeague={activeLeague} seasonOfLeague={seasonOfLeague} teamsOfSeason={teamsOfSeason} update={update} color={color}  />
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
							<div className="football-container-header-league__label" style={{backgroundColor: color()}}>{ league.label }</div>
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
							<button className="football-container-header-league__buttons">
								<TrashIcon />
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
								<NavLink to={ `/${ encodeURI(activeLeague) }/${ encodeURI(season.seasonTime) }/table` }
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

				{activeSeason.seasonTime}

				{ createButtonForAddSeason && (
					<button className="football-container-header-seasons__add-season"
					        onClick={() => {
						        setDataCreate(TEXT_FOR_CREATE_PAGE.season)
						        createDataLeagueOrNewSeason()}}>
						<NavLink className="football-container-header-seasons__add-season-button"
						         to='/new_league'>
							<PlusIcon/>
						</NavLink>
						<span className="tooltiptext">Add season</span>
					</button>
				) }
				{ createButtonForAddSeason && (
					<button className="football-container-header-seasons__add-season" style={{color: 'red'}}>
						<MinusIcon />
					</button>
				)}
			</div>
			<div className="football-container-header-nav">
				<NavLink
					className="football-container-header-nav__button"
					to={ `/${ encodeURI(activeLeague) }/${ encodeURI(activeSeason.seasonTime) }/table` }>
						Table
				</NavLink>
				<NavLink
					className="football-container-header-nav__button"
					to={ `/${ encodeURI(activeLeague) }/${ encodeURI(activeSeason.seasonTime) }/results` }>
						Results
				</NavLink>
			</div>
			{
				navigator()
			}
		</div>
	)
}