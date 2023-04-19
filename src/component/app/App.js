import { AppHeader } from "../appHeader/AppHeader";
import { Home } from "../home/Home"
import { CreateLeague } from "../createLeague/CreateLeague";
import { FootballHeader } from "../footballHeader/FootballHeader";
import { FootballLeagues } from "../footballLeagues/FootballLeagues";
import { Page404 } from "../page404/Page404";

import { DUMMY_LEAGUE } from "../../DUMMY_LEAGUE";

import {Routes, Route } from "react-router-dom";
import {Fragment, useEffect, useState} from "react";

import './app.scss'

const getRandomColor = () => {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

const NEW_LEAGUE = {
	leagueName: '',
	label: '',
	position: 'league',
	teams: [
		{ id: `1`, fcName: '', label: '', color: getRandomColor()},
		{ id: `2`, fcName: '', label: '', color: getRandomColor()}
	]
}

export const App = () => {

	const [leagues, setLeagues] = useState([])
	const [listLeagueHistory, setListLeagueHistory] = useState([])
	const [copyDataForNewLeagueOrNewSeason, setCopyDataForNewLeagueOrNewSeason] = useState(NEW_LEAGUE)

	const [update, setUpdate] = useState(false)
	const [updateHistory, setUpdateHistory] = useState(false)


	useEffect(() => {
		const historyInLocal = localStorage.getItem('pageHistory')
		const jsonHistory = historyInLocal ? JSON.parse(historyInLocal) : []
		setListLeagueHistory(jsonHistory)
	}, [updateHistory])

	useEffect(() => {
		const localLeague = localStorage.getItem('leagues')
		const jsonLeague = localLeague ? JSON.parse(localLeague) : []
		setLeagues(jsonLeague)
		if (jsonLeague.length === 0) {
			localStorage.removeItem('leagues')
		}
	}, [update])


	const localPageHistory = (league) => {
		const leaguePage = {
			leagueName: league.leagueName,
			path: league.pathPage,
			season: league.seasons[league.seasons.length - 1].seasonTime
		};

		const createHistory = ( props ) => {
			if (props.length >= 10) {
				const updateOldHistory = props.slice(0, 9);
				const newHistory = [leaguePage, ...updateOldHistory];
				localStorage.setItem('pageHistory', JSON.stringify(newHistory))

			} else {
				const newHistory = [leaguePage, ...props];
				localStorage.setItem('pageHistory', JSON.stringify(newHistory))
			}
		}

		const oldLocalPageHistory = localStorage.getItem('pageHistory');
		const jsonOldHistory = oldLocalPageHistory ? JSON.parse(oldLocalPageHistory) : [];
		if (jsonOldHistory.length > 0) {
			const searchSamePageInHistory = jsonOldHistory.filter(page => JSON.stringify(page) !== JSON.stringify(leaguePage))
			createHistory(searchSamePageInHistory);
		} else {
			createHistory(jsonOldHistory);
		}
	}


	return (
		<div className="font-img">

			<AppHeader
				leagues={leagues}
				updateHistory={updateHistory}
				setUpdateHistory={setUpdateHistory}
				localPageHistory={localPageHistory}
				dummyLeague={DUMMY_LEAGUE}
				newLeague={NEW_LEAGUE}
				setCopyDataForNewLeagueOrNewSeason={setCopyDataForNewLeagueOrNewSeason}
			/>

			<Routes>
				<Route
					path='/'
					element={
						<Home
							dummyLeague={DUMMY_LEAGUE}
							newLeague={NEW_LEAGUE}
							listLeagueHistory={listLeagueHistory}
							updateHistory={updateHistory}
							setUpdateHistory={setUpdateHistory}
							localPageHistory={localPageHistory}
							setCopyDataForNewLeagueOrNewSeason={setCopyDataForNewLeagueOrNewSeason}
						/>
					}
				/>

				<Route
					path='/leagues'
					element={
						<FootballLeagues
							leagues={leagues}
							updateHistory={updateHistory}
							setUpdateHistory={setUpdateHistory}
							localPageHistory={localPageHistory}
						/>
					}
				/>

				<Route
					path="/new_league"
					element={
						<CreateLeague
							update={update}
							setUpdate={setUpdate}
							getRandomColor={getRandomColor}
							copyDataForNewLeagueOrNewSeason={copyDataForNewLeagueOrNewSeason}
						/>
					}
				/>

				{
					leagues.map((league) => {
						return league.seasons.map((season, i) => (
							<Fragment key={i}>
								<Route
									key={i}
									path={`${encodeURI(league.pathPage)}/${encodeURI(league.leagueName)}/${encodeURI(season.seasonTime)}/table`}
									element={
										<FootballHeader
											league={ league }
											update={update}
											setUpdate={setUpdate}
											updateHistory={updateHistory}
											setUpdateHistory={setUpdateHistory}
											localPageHistory={localPageHistory}
											setCopyDataForNewLeagueOrNewSeason={setCopyDataForNewLeagueOrNewSeason}
										/>
									}
								/>
								<Route
									key={i}
									path={`${encodeURI(league.pathPage)}/${encodeURI(league.leagueName)}/${encodeURI(season.seasonTime)}/results`}
									element={
										<FootballHeader
											league={ league }
											update={update}
											setUpdate={setUpdate}
											updateHistory={updateHistory}
											setUpdateHistory={setUpdateHistory}
											setCopyDataForNewLeagueOrNewSeason={setCopyDataForNewLeagueOrNewSeason}
										/>
									}
								/>
							</Fragment>
						))
					})
				}
				{
					DUMMY_LEAGUE.seasons.map((season, i) => (
						<Fragment key={i}>
							<Route
								key={i}
								path={`${encodeURI(DUMMY_LEAGUE.pathPage)}/${encodeURI(DUMMY_LEAGUE.leagueName)}/${encodeURI(season.seasonTime)}/table`}
								element={
									<FootballHeader
										update={update}
										updateHistory={updateHistory}
										setUpdateHistory={setUpdateHistory}
										localPageHistory={localPageHistory}
										league={DUMMY_LEAGUE}
										setCopyDataForNewLeagueOrNewSeason={setCopyDataForNewLeagueOrNewSeason}
									/>
								}
							/>
							<Route
								key={i}
								path={`${encodeURI(DUMMY_LEAGUE.pathPage)}/${encodeURI(DUMMY_LEAGUE.leagueName)}/${encodeURI(season.seasonTime)}/results`}
								element={
									<FootballHeader
										update={update}
										updateHistory={updateHistory}
										setUpdateHistory={setUpdateHistory}
										league={DUMMY_LEAGUE}
										setCopyDataForNewLeagueOrNewSeason={setCopyDataForNewLeagueOrNewSeason}
									/>
								}
							/>
						</Fragment>
					))
				}
				<Route
					path="*"
					element={<Page404 />}
				/>
			</Routes>
		</div>
	)
}
