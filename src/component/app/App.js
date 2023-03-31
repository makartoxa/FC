import { AppHeader } from "../appHeader/AppHeader";
import { Home } from "../home/Home"
import { CreateLeague } from "../createLeague/CreateLeague";
import { FootballHeader } from "../footballHeader/FootballHeader";

import { DUMMY_LEAGUE } from "../../DUMMY_LEAGUE";
import { TEXT_FOR_CREATE_PAGE } from "../../TEXT_FOR_CREATE_PAGE"

import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";


import './app.scss'

export const App = () => {

	const [idTeam, setIdTeam] = useState(2)
	const [leagues, setLeagues] = useState([])
	const [update, setUpdate] = useState(false)
	const [dataCreate, setDataCreate] = useState(TEXT_FOR_CREATE_PAGE.league)
	const [copyDataLeagueOrNewSeason, setCopyDataLeagueOrNewSeason] = useState()
	const [createButtonForAddSeason, setCreateButtonForAddSeason] = useState(true)
	const [createButtonForCopyLeague, setCreateButtonForCopyLeague] = useState(true)

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
	console.log('copyDataLeagueOrNewSeason', copyDataLeagueOrNewSeason);

	return (
		<div className="font-img">
			<AppHeader update={update}
			           dummyLeague={DUMMY_LEAGUE}
			           setDataCreate={setDataCreate}
			           setIdTeam={setIdTeam}
			           setCreateButtonForAddSeason={setCreateButtonForAddSeason}
			           setCreateButtonForCopyLeague={setCreateButtonForCopyLeague}
			           setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason} />
				<Routes>
					<Route path='/'
					       element={<Home dummyLeague={DUMMY_LEAGUE}
					                      setDataCreate={setDataCreate}
					                      setIdTeam={setIdTeam}
					                      setCreateButtonForAddSeason={setCreateButtonForAddSeason}
					                      setCreateButtonForCopyLeague={setCreateButtonForCopyLeague}
					                      setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason} />} />
					<Route path="new_league"
					       element={<CreateLeague update={update}
					                              setUpdate={setUpdate}
					                              idTeam={idTeam}
					                              setIdTeam={setIdTeam}
					                              copyDataLeagueOrNewSeason={copyDataLeagueOrNewSeason}
					                              dataCreate={dataCreate}/>} />
					{
						leagues.map((league, key) => {
							return league.seasons.map((season, i) => (
								<Route key={key}>
									<Route
										key={i}
										path={`${encodeURI(league.leagueName)}/${encodeURI(season.seasonTime)}/table`}
										element={<FootballHeader league={ league }
										                         update={update}
										                         setDataCreate={setDataCreate}
										                         setIdTeam={setIdTeam}
										                         createButtonForAddSeason={createButtonForAddSeason}
										                         setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
										                         color={getRandomColor} />} />
									<Route
										key={i}
										path={`${encodeURI(league.leagueName)}/${encodeURI(season.seasonTime)}/results`}
										element={<FootballHeader league={ league }
										                         update={update}
										                         setDataCreate={setDataCreate}
										                         setIdTeam={setIdTeam}
										                         createButtonForAddSeason={createButtonForAddSeason}
										                         setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
										                         color={getRandomColor} />} />
								</Route>
							))
						})
					}
					{
						DUMMY_LEAGUE.seasons.map((season, i) => (
							<Route key={i}>
								<Route path={`${ encodeURI(DUMMY_LEAGUE.leagueName) }/${ encodeURI(season.seasonTime) }/table`}
								       key={i}
								       element={<FootballHeader update={update}
								                                league={DUMMY_LEAGUE}
								                                setIdTeam={setIdTeam}
								                                setDataCreate={setDataCreate}
								                                createButtonForCopyLeague={createButtonForCopyLeague}
								                                setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
								                                color={getRandomColor} />} />
								<Route path={`${ encodeURI(DUMMY_LEAGUE.leagueName) }/${ encodeURI(season.seasonTime) }/results`}
								       key={i}
								       element={<FootballHeader update={update}
								                                league={DUMMY_LEAGUE}
								                                setIdTeam={setIdTeam}
								                                setDataCreate={setDataCreate}
								                                createButtonForCopyLeague={createButtonForCopyLeague}
								                                setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
								                                color={getRandomColor} />} />
							</Route>
						))
					}
				</Routes>
		</div>
	)
}
