import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { TEXT_FOR_CREATE_PAGE } from "../../TEXT_FOR_CREATE_PAGE";

import ArrowDownIcon from '@rsuite/icons/ArrowDown';
import ArrowUpIcon from '@rsuite/icons/ArrowUp';
import MenuIcon from '@rsuite/icons/Menu';
import CloseIcon from '@rsuite/icons/Close';

import './AppHeader.scss';

export const AppHeader = ({   update,
	                          dummyLeague,
	                          setDataCreate,
	                          setIdTeam,
	                          setCopyDataLeagueOrNewSeason,
	                          setCreateButtonForAddSeason }) => {

	const [active, setActive] = useState(false);
	const [leagueNames, setleagueNames] = useState([]);
	const [menuLeague, setMenuLeague] = useState(false);
	const [menuDemo, setMenuDemo] = useState(false);

	const SEASON = dummyLeague.seasons.find(el => el.seasonTime)

	const refMenuLeague = useRef(null)
	const refMenuDemo = useRef(null)

	const handleClickOutsideMenuLeague =  (event) => {
		if (refMenuLeague.current && !refMenuLeague.current.contains(event.target)) {
			setMenuLeague(false);
		}
	}

	const handleClickOutsideMenuDemo =  (event) => {
		if (refMenuDemo.current && !refMenuDemo.current.contains(event.target)) {
			setMenuDemo(false);
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutsideMenuDemo)
		return () => {
			document.removeEventListener('mousedown', handleClickOutsideMenuDemo)
		}
	}, [refMenuDemo])

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutsideMenuLeague)
		return () => {
			document.removeEventListener('mousedown', handleClickOutsideMenuLeague)
		}
	}, [refMenuLeague])

	useEffect(() => {
		const localLeagues = localStorage.getItem('leagues');
		const dataLeagues = localLeagues ? JSON.parse(localLeagues) : '';
		if (localLeagues) {
			setleagueNames(dataLeagues)
		}
	}, [update])


	return (
		<div className="app-header">
			<div className="app-header-menu__mobile-btn"
			     onClick={ () => setActive(!active) }>
				{
					active
						? <CloseIcon size="25px" color="#0e8ac7" />
						: <MenuIcon size="25px" color="#0e8ac7" />
				}
			</div>
			<div className="app-header-title">
				<div className="app-header-title__name">
					Football
				</div>
				<NavLink to='/' >
					information portal
				</NavLink>
			</div>
			<div className={`app-header-menu${active ? ' active' : ''}`}>
				<div className="app-header-menu__home">
					<NavLink to='/'
					         onClick={ () => setActive(!active) }>
						Home
					</NavLink>
				</div>
				<div
					ref={refMenuLeague}
					className={`dropdown${menuLeague ? ' show-background' : ''}`}>
					<button
						className={`dropbtn${menuLeague ? ' show-color' : ''}`}
				        onClick={ () => {
					        setMenuLeague(!menuLeague)
							setMenuDemo(false)
				        }}
					>
						Leagues
						{
							!menuLeague ? <ArrowDownIcon /> : <ArrowUpIcon/>
						}
					</button>
					<div id="myDropdown"
					     className={`dropdown-content${menuLeague ? ' show' : ''}`}
					     onClick={ () => {
						     setMenuLeague(false)
							 setActive(!active)
					     } }>
						<NavLink to='/new_league'
						         onClick={() => {
							         setDataCreate(TEXT_FOR_CREATE_PAGE.league)
							         setIdTeam(2)
							         setCopyDataLeagueOrNewSeason()}}>
							Create league
						</NavLink>
						{
							leagueNames.map((league, i) => (
										<NavLink key={i}
										         onClick={ () => setCreateButtonForAddSeason(true)}
										         to={ `/${ encodeURI(league.leagueName) }/${ encodeURI(league.seasons[0].seasonTime) }/table` }>
											{ league.leagueName }
										</NavLink>
									)
								)
						}
					</div>
				</div>
				<div className={`dropdown${menuDemo ? ' show-background' : ''}`}
				     ref={refMenuDemo}>
					<button className={`dropbtn${menuDemo ? ' show-color' : ''}`}
					        onClick={ () => {
						        setMenuDemo(!menuDemo)
								setMenuLeague(false)
					        }}>
						Demo version
						{
							!menuDemo ?  <ArrowDownIcon/> : <ArrowUpIcon/>
						}
					</button>
					<div id="myDropdown2"
					     className={`dropdown-content${menuDemo ? ' show' : ''}`}
					     onClick={ () => {
						     setMenuDemo(false)
							 setActive(!active) }}>
						<NavLink to={ `/${ encodeURI(dummyLeague.leagueName) }/${ encodeURI(SEASON.seasonTime) }/table` }>
							Premier league
						</NavLink>
					</div>
				</div>
			</div>
		</div>
	)
}
