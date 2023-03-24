import './FootballHeader.scss'
import TrashIcon from "@rsuite/icons/Trash";
import CopyIcon from '@rsuite/icons/Copy';
import { NavLink } from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {FootballTable} from "../footballTable/FootballTable";
import {FootballResults} from "../footballResults/FootballResults";
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';


export const FootballHeader = ({ league, color, update }) => {

	const LEAGUE = league.seasons.map(el => el.seasonTime)

	const [chooseSeason, setChooseSeason] = useState(LEAGUE.find(el => el))
	const [menuSeasons, setMenuSeasons] = useState(false)
	const refMenuSeasons = useRef(null)

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

	const activeLeague = league.leagueName
	const activeSeason = league.seasons.find(el => el.seasonTime === chooseSeason)
		? league.seasons.find(el => el.seasonTime === chooseSeason)
		: league.seasons.find(el => el.seasonTime)

	const teamsOfSeason = activeSeason.teams
	const seasonOfLeague = activeSeason.seasonTime


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
					<div className="football-container-header-league__copy">
						<button className="football-container-header-league__buttons">
							<CopyIcon />
						</button>
					</div>
					<div className="football-container-header-league__delete">
						<button className="football-container-header-league__buttons">
							<TrashIcon />
						</button>
					</div>
				</div>
			</div>
			<div
				ref={refMenuSeasons}
				className="football-container-header-seasons">
				<div className={`dropdown-seasons${menuSeasons ? ' show-background-seasons' : ''}`}>
					<button className={`dropbtn-seasons${menuSeasons ? ' show-color-seasons' : ''}`}
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