import { AppHeader } from "../appHeader/AppHeader";
import { Home } from "../home/Home"
import { CreateLeague } from "../createLeague/CreateLeague";
import { FootballHeader } from "../footballHeader/FootballHeader";
import { FootballLeagues } from "../footballLeagues/FootballLeagues";
import { Page404 } from "../page404/Page404";

import { DUMMY_LEAGUE } from "../../DUMMY_LEAGUE";
import { TEXT_FOR_CREATE_PAGE } from "../../TEXT_FOR_CREATE_PAGE"

import {Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import './app.scss'

export const App = () => {

	const [idTeam, setIdTeam] = useState(2)
	const [leagues, setLeagues] = useState([])
	const [update, setUpdate] = useState(false)
	const [updateHistory, setUpdateHistory] = useState(false)
	const [dataCreate, setDataCreate] = useState(TEXT_FOR_CREATE_PAGE.league)
	const [seasonsActiveLeague, setSeasonsActiveLeague] = useState([])
	const [copyDataLeagueOrNewSeason, setCopyDataLeagueOrNewSeason] = useState()
	const [createButtonForAddSeason, setCreateButtonForAddSeason] = useState(true)
	const [createButtonForCopyLeague, setCreateButtonForCopyLeague] = useState(true)
	const [listLeagueHistory, setListLeagueHistory] = useState()
	const [statusDelete, setStatusDelete] = useState(false)

	useEffect(() => {
		const historyInLocal = localStorage.getItem('pageHistory')
		const jsonHistory = historyInLocal ? JSON.parse(historyInLocal) : null
		setListLeagueHistory(jsonHistory)
	}, [updateHistory])

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
				update={update}
				updateHistory={updateHistory}
				setUpdateHistory={setUpdateHistory}
				localPageHistory={localPageHistory}
				dummyLeague={DUMMY_LEAGUE}
				setDataCreate={setDataCreate}
				setIdTeam={setIdTeam}
				setCreateButtonForAddSeason={setCreateButtonForAddSeason}
				setCreateButtonForCopyLeague={setCreateButtonForCopyLeague}
				setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
			/>

			<Routes>
				<Route
					path='/'
					element={
						<Home
							dummyLeague={DUMMY_LEAGUE}
							setDataCreate={setDataCreate}
							listLeagueHistory={listLeagueHistory}
							updateHistory={updateHistory}
							setUpdateHistory={setUpdateHistory}
							localPageHistory={localPageHistory}
							setIdTeam={setIdTeam}
							setCreateButtonForAddSeason={setCreateButtonForAddSeason}
							setCreateButtonForCopyLeague={setCreateButtonForCopyLeague}
							setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
						/>
					}
				/>

				<Route
					path='/leagues'
					element={
						<FootballLeagues
							leagues={leagues}
							setStatusDelete={setStatusDelete}
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
							color={getRandomColor}
							idTeam={idTeam}
							setIdTeam={setIdTeam}
							seasonsActiveLeague={seasonsActiveLeague}
							copyDataLeagueOrNewSeason={copyDataLeagueOrNewSeason}
							dataCreate={dataCreate}
						/>
					}
				/>

				{
					leagues.map((league, key) => {
						return league.seasons.map((season, i) => (
							<>
								<Route
									key={i}
									path={`${encodeURI(league.pathPage)}/${encodeURI(league.leagueName)}/${encodeURI(season.seasonTime)}/table`}
									element={ statusDelete ? <Navigate to="/leagues" /> :
										<FootballHeader
											setStatusDelete={setStatusDelete}
											league={ league }
											update={update}
											setUpdate={setUpdate}
											updateHistory={updateHistory}
											setUpdateHistory={setUpdateHistory}
											localPageHistory={localPageHistory}
											setDataCreate={setDataCreate}
											setIdTeam={setIdTeam}
											setSeasonsActiveLeague={setSeasonsActiveLeague}
											createButtonForAddSeason={createButtonForAddSeason}
											setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
											color={getRandomColor}
										/>
									}
								/>
								<Route
									key={i}
									path={`${encodeURI(league.pathPage)}/${encodeURI(league.leagueName)}/${encodeURI(season.seasonTime)}/results`}
									element={
										statusDelete ?
										<Navigate to="/leagues" /> :
										<FootballHeader
											setStatusDelete={setStatusDelete}
											league={ league }
											update={update}
											setUpdate={setUpdate}
											setDataCreate={setDataCreate}
											setIdTeam={setIdTeam}
											setSeasonsActiveLeague={setSeasonsActiveLeague}
											createButtonForAddSeason={createButtonForAddSeason}
											setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
											color={getRandomColor}
										/>
									}
								/>
							</>
						))
					})
				}
				{
					DUMMY_LEAGUE.seasons.map((season, i) => (
						<>
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
										setIdTeam={setIdTeam}
										setDataCreate={setDataCreate}
										createButtonForCopyLeague={createButtonForCopyLeague}
										setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
										color={getRandomColor}
									/>
								}
							/>
							<Route
								key={i}
								path={`${encodeURI(DUMMY_LEAGUE.pathPage)}/${encodeURI(DUMMY_LEAGUE.leagueName)}/${encodeURI(season.seasonTime)}/results`}
								element={
									<FootballHeader
										update={update}
										league={DUMMY_LEAGUE}
										setIdTeam={setIdTeam}
										setDataCreate={setDataCreate}
										createButtonForCopyLeague={createButtonForCopyLeague}
										setCopyDataLeagueOrNewSeason={setCopyDataLeagueOrNewSeason}
										color={getRandomColor}
									/>
								}
							/>
						</>
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
