import { NavLink } from "react-router-dom";
import ArrowDownIcon from '@rsuite/icons/ArrowDown';

import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";

import './AppHeader.scss';

export const AppHeader = ({ update, dummyLeague }) => {
	const [active, setActive] = useState(false);
	const [leagueNames, setleagueNames] = useState([]);
	const [menuLeague, setMenuLeague] = useState(false);
	const [menuDemo, setMenuDemo] = useState(false);

	useEffect(() => {
		const localLeagues = localStorage.getItem('leagues');
		const dataLeagues = localLeagues ? JSON.parse(localLeagues) : '';
		if (localLeagues) {
			const league = dataLeagues.map(item => item.leagueName)
			setleagueNames(league)
		}
	}, [update])


	window.onclick = function(event) {
		if (!event.target.matches('.dropbtn')) {
			let dropdowns = document.getElementsByClassName("dropdown-content show");
			let i;
			for (i = 0; i < dropdowns.length; i++) {
				let openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('show')) {
					openDropdown.classList.remove('show')
					setMenuLeague(false);
					setMenuDemo(false);
				}
			}
		}

	}


	return (
		<div className="app-header">
			<div className="app-header-title">
				<div className="app-header-title__name">
					Football
				</div>
				<NavLink to='/' >
					information portal
				</NavLink>
			</div>
			<div className={`app-header-menu ${active ? 'active' : ''}`}>
				<div className="app-header-menu__home">
					<NavLink onClick={ () => setActive(!active) }
					         to='/'>
						Home
					</NavLink>
				</div>
				<div className={`dropdown ${menuLeague ? 'show-background' : ''}`}>
					<button className="dropbtn"
					        onClick={ () => {
						        setMenuLeague(!menuLeague)
								setMenuDemo(false)
					        }}>
						Leagues <ArrowDownIcon />
					</button>
					<div id="myDropdown"
					     className={`dropdown-content ${menuLeague ? 'show' : ''}`}
					     onClick={ () => setActive(!active) }>
						<NavLink to='/new_league'>
							Create league
						</NavLink>
						{
							leagueNames.map((league, i) => (
								<NavLink key={ i }
								         to={ `/${ encodeURI(league) }/table` }>
									{ league }
								</NavLink>
							))
						}
					</div>
				</div>
				<div className={`dropdown ${menuDemo ? 'show-background' : ''}`}>
					<button className="dropbtn"
					        onClick={ () => {
						        setMenuDemo(!menuDemo)
								setMenuLeague(false)
					        }}>
						Demo version <ArrowDownIcon />
					</button>
					<div id="myDropdown2"
					     className={`dropdown-content ${menuDemo ? 'show' : ''}`}
					     onClick={ () => setActive(!active) }>
						<NavLink to={ `/${ encodeURI(dummyLeague.leagueName) }/table` }>
							Premier league
						</NavLink>
					</div>
				</div>
			</div>
			<div className="app-header-menu__mobile-btn"
			     onClick={ () => setActive(!active) }>
				{
					active
						? <AiOutlineClose size="25px" color="#0e8ac7" />
						: <AiOutlineMenu size="25px" color="#0e8ac7" />
				}
			</div>
		</div>
	)
}
