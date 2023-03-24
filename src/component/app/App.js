import { AppHeader } from "../appHeader/AppHeader";
import { Home } from "../home/Home"
import { CreateLeague } from "../createLeague/CreateLeague";
import { FootballTable } from "../footballTable/FootballTable";
import { FootballResults} from "../footballResults/FootballResults";
import { DUMMY_LEAGUE } from "../../DUMMY_LEAGUE";
import { Routes, Route } from "react-router-dom";

import './app.scss'
import {useEffect, useState} from "react";
import {FootballHeader} from "../footballHeader/FootballHeader";

export const App = () => {

	const [leagues, setLeagues] = useState([])
	const [update, setUpdate] = useState(false)

	useEffect(() => {
		const localLeague = localStorage.getItem('leagues')
		if(localLeague) {
			setLeagues(JSON.parse(localLeague))
		}
	}, [update])

	const getRandomColor = () => {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;


	}
	return (
		<div className="font-img">
			<AppHeader update={update} dummyLeague={DUMMY_LEAGUE}/>
				<Routes>
					<Route path='/' element={<Home dummyLeague={DUMMY_LEAGUE} />} />
					<Route path="new_league" element={<CreateLeague update={update} setUpdate={setUpdate}/>} />
					{
						leagues.map(league => {
							return league.seasons.map((season, i) => (
								<>
									<Route
										key={i}
										path={`${encodeURI(league.leagueName)}/${encodeURI(season.seasonTime)}/table`}
										element={<FootballHeader league={ league } update={update} color={getRandomColor}/>}/>
									<Route
										key={i}
										path={`${encodeURI(league.leagueName)}/${encodeURI(season.seasonTime)}/results`}
										element={<FootballHeader league={ league } update={update} color={getRandomColor}/>}/>

								</>
							))
							}
						)
					}
					{
						DUMMY_LEAGUE.seasons.map((season, i) => (
							<>
								<Route path={`${ encodeURI(DUMMY_LEAGUE.leagueName) }/${ encodeURI(season.seasonTime) }/table`}
								       key={i}
								       element={<FootballHeader
									       update={update}
									       league={DUMMY_LEAGUE}
									       color={getRandomColor}/>} />
								<Route path={`${ encodeURI(DUMMY_LEAGUE.leagueName) }/${ encodeURI(season.seasonTime) }/results`}
								       key={i}
								       element={<FootballHeader
									       update={update}
									       league={DUMMY_LEAGUE}
									       color={getRandomColor}/>} />
							</>
						))
					}
					{/*<Route path={`${ encodeURI(DUMMY_LEAGUE.leagueName) }/${ encodeURI(seasons.seasonTime) }`}*/}
					{/*       element={<FootballHeader*/}
					{/*	       league={DUMMY_LEAGUE}*/}
					{/*	       color={getRandomColor}/>} />*/}
					{/*<Route path={`${ encodeURI(DUMMY_LEAGUE.leagueName) }/table`} element={<FootballTable league={ DUMMY_LEAGUE } color={ getRandomColor } />} />*/}
					{/*<Route path={`${ encodeURI(DUMMY_LEAGUE.leagueName) }/results`} element={<FootballResults league={ DUMMY_LEAGUE } color={ getRandomColor } />} />*/}
				</Routes>
		</div>
	)
}
