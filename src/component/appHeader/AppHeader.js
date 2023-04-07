import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { TEXT_FOR_CREATE_PAGE } from "../../TEXT_FOR_CREATE_PAGE";
import player from "../logo/player.png"

import ArrowDownIcon from '@rsuite/icons/ArrowDown';
import ArrowUpIcon from '@rsuite/icons/ArrowUp';
import MenuIcon from '@rsuite/icons/Menu';
import CloseIcon from '@rsuite/icons/Close';
import { HomeOutlined } from "@ant-design/icons";

import './AppHeader.scss';


export const AppHeader = ({
	                          update,
	                          dummyLeague,
	                          setDataCreate,
	                          setIdTeam,
	                          setCopyDataLeagueOrNewSeason,
	                          setCreateButtonForAddSeason }) => {

	const [active, setActive] = useState(false);
	const [leagueNames, setleagueNames] = useState([]);
	const [menuLeague, setMenuLeague] = useState(false);
	const [menuDemo, setMenuDemo] = useState(false);

	const refMenuLeague = useRef(null)
	const refMenuDemo = useRef(null)

	const handleClickOutsideMenuDemo =  (event) => {
		if (refMenuDemo.current && refMenuDemo.current.contains(event.target)) {
			setMenuDemo(true);
		} else if (refMenuDemo.current && !refMenuDemo.current.contains(event.target)) {
			setMenuDemo(false);
		}
	}

	useEffect(() => {
		document.addEventListener('mouseover', handleClickOutsideMenuDemo)
		return () => {
			document.removeEventListener('mousedown', handleClickOutsideMenuDemo)
		}
	}, [refMenuDemo])

	const handleClickOutsideMenuLeague =  (event) => {
		if (refMenuLeague.current && refMenuLeague.current.contains(event.target)) {
			setMenuLeague(true);
		} else if (refMenuLeague.current && !refMenuLeague.current.contains(event.target)) {
			setMenuLeague(false);
		}
	}

	useEffect(() => {
		document.addEventListener('mouseover', handleClickOutsideMenuLeague)
		return () => {
			document.removeEventListener('mouseenter', handleClickOutsideMenuLeague)
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
			<div className="app-header-menu-mobile-btn"
			     onClick={ () => setActive(!active) }
			>
				{
					active
						? <CloseIcon color="#0e8ac7" />
						: <MenuIcon color="#0e8ac7" />
				}
			</div>
			<div className="app-header-title">
				<img src={player} width="50px"/>
				<div className="app-header-title__name">
					Football
				</div>
				<NavLink to='/' >
					information portal
				</NavLink>
			</div>
			<div className="app-header-navigation">
				<div className={`app-header-menu${active ? ' active' : ''}`}>

					<div className="app-header-menu-home"
					     onClick={ () => setActive(!active) }>
						<NavLink to='/'>
							<HomeOutlined /> Home
						</NavLink>
					</div>

					<div
						className="app-header-menu-league"
						ref={refMenuLeague}
						onClick={ () => {
							setMenuLeague(false)
							setActive(!active)
						}}
					>
						<NavLink
							to='leagues'
						>
							Leagues
							{
								!menuLeague ? <ArrowDownIcon /> : <ArrowUpIcon/>
							}
						</NavLink>
						<div className={`app-header-menu-league-dropdown-content ${menuLeague ? 'show' : ''}`}>
							<NavLink
								to='/new_league'
								onClick={() => {
									setDataCreate(TEXT_FOR_CREATE_PAGE.league)
									setIdTeam(2)
									setCopyDataLeagueOrNewSeason()
								}}
							>
								Create league
							</NavLink>
							{
								leagueNames.map((league, i) => (
									<NavLink
										key={i}
										onClick={ () => setCreateButtonForAddSeason(true)}
										to={ `/${encodeURI(league.pathPage)}/${encodeURI(league.leagueName)}/${encodeURI(league.seasons[league.seasons.length - 1].seasonTime)}/table` }
									>
										{ league.leagueName }
									</NavLink>
								))
							}
						</div>
					</div>
					<div
						className="app-header-menu-demo"
						ref={refMenuDemo}
						onClick={ () => {
							setMenuDemo(false)
							setActive(!active)
						}}
					>
						<NavLink
							to={ `/${encodeURI(dummyLeague.pathPage)}/${encodeURI(dummyLeague.leagueName)}/${encodeURI(dummyLeague.seasons[dummyLeague.seasons.length - 1].seasonTime)}/table` }
						>
							Demo version
							{
								!menuDemo ?  <ArrowDownIcon/> : <ArrowUpIcon/>
							}
						</NavLink>
						<div className={`app-header-menu-demo-dropdown-content ${menuDemo ? 'show' : ''}`}>
							<NavLink
								to={`/${encodeURI(dummyLeague.pathPage)}/${encodeURI(dummyLeague.leagueName)}/${encodeURI(dummyLeague.seasons[dummyLeague.seasons.length - 1].seasonTime)}/table` }
							>
								Premier league
							</NavLink>
						</div>
					</div>
				</div>

			</div>
		</div>
	)
}


				{/*<div className="dropdown"*/}
				{/*	ref={refMenuLeague}*/}
				{/*	>*/}
				{/*	<button*/}
				{/*		className="dropbtn"*/}
				{/*        onClick={ () => {*/}
				{/*	        setMenuLeague(!menuLeague)*/}
				{/*			setMenuDemo(false)*/}
				{/*        }}*/}
				{/*	>*/}
				{/*		<NavLink to='/leagues'>*/}
				{/*			Leagues*/}
				{/*		</NavLink>*/}
				{/*		{*/}
				{/*			!menuLeague ? <ArrowDownIcon /> : <ArrowUpIcon/>*/}
				{/*		}*/}
				{/*	</button>*/}
				{/*	<div id="myDropdown"*/}
				{/*	     className="dropdown-content"*/}
				{/*	     onClick={ () => {*/}
				{/*		     setMenuLeague(false)*/}
				{/*			 setActive(!active)*/}
				{/*	     } }>*/}
				{/*		<NavLink to='/new_league'*/}
				{/*		         onClick={() => {*/}
				{/*			         setDataCreate(TEXT_FOR_CREATE_PAGE.league)*/}
				{/*			         setIdTeam(2)*/}
				{/*			         setCopyDataLeagueOrNewSeason()}}>*/}
				{/*			Create league*/}
				{/*		</NavLink>*/}
				{/*		{*/}
				{/*			leagueNames.map((league, i) => (*/}
				{/*						<NavLink key={i}*/}
				{/*						         onClick={ () => setCreateButtonForAddSeason(true)}*/}
				{/*						         to={ `/${ encodeURI(league.leagueName) }/${ encodeURI(league.seasons[0].seasonTime) }/table` }>*/}
				{/*							{ league.leagueName }*/}
				{/*						</NavLink>*/}
				{/*					)*/}
				{/*				)*/}
				{/*		}*/}
				{/*	</div>*/}
				{/*</div>*/}


				// {/*<div className="dropdown"*/}
				// {/*     ref={refMenuDemo}>*/}
				// {/*	<button className="dropbtn"*/}
				// {/*	        onClick={ () => {*/}
				// {/*		        setMenuDemo(!menuDemo)*/}
				// {/*				setMenuLeague(false)*/}
				// {/*	        }}>*/}
				// {/*		<NavLink to={ `/${ encodeURI(dummyLeague.leagueName) }/${ encodeURI(SEASON.seasonTime) }/table` }>*/}
				// {/*			Demo version*/}
				// {/*		</NavLink>*/}
				// {/*		{*/}
				// {/*			!menuDemo ?  <ArrowDownIcon/> : <ArrowUpIcon/>*/}
				// {/*		}*/}
				// {/*	</button>*/}
				// {/*	<div id="myDropdown2"*/}
				// {/*	     className="dropdown-content"*/}
				// {/*	     onClick={ () => {*/}
				// {/*		     setMenuDemo(false)*/}
				// {/*			 setActive(!active) }}>*/}
				// {/*		<NavLink to={ `/${ encodeURI(dummyLeague.leagueName) }/${ encodeURI(SEASON.seasonTime) }/table` }>*/}
				// {/*			Premier league*/}
				// {/*		</NavLink>*/}
				// {/*	</div>*/}
				// {/*</div>*/}