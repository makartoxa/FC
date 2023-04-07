import { useEffect, useState } from "react";
import { Button, SelectPicker, InputNumber } from "rsuite";
import { NavLink } from "react-router-dom";

import PageNextIcon from '@rsuite/icons/PageNext';
import PagePreviousIcon from '@rsuite/icons/PagePrevious';

import './FootballResults.scss'

export const FootballResults = ({ activeLeague,
	                                seasonOfLeague,
	                                teamsOfSeason,
	                                dayKey,
	                                dataInput,
	                                dataTable }) => {

	//------------> useState

	const [matchDay, setMatchDay] = useState(1);
	const [matches, setMatches] = useState([]);
	const [disDays, setDisDays] = useState([])
	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
	const [selectedDropMenuTeams, setSelectedDropMenuTeams] = useState([]);
	const [dayButtonMinus, setDayButtonMinus] = useState(false);
	const [dayButtonPlus, setDayButtonPlus] = useState(false);
	const [seasonEnded, setSeasonEnded] = useState(false);

	const dataMatchDays = (() => {
		const days = [];
		for(let i = 0; i < (teamsOfSeason.length - 1) * 2; i++) {
			days.push({
				value: i + 1,
				label: i + 1
			})
		}
		return days;
	})();

	const selectDaysData = dataMatchDays.map(day => ({label: day.label, value: day.value}));
	const selectFootballClub = teamsOfSeason.map(team => ({value: team.id, label: team.fcName}));

	//------------> go to matchDay, when field do not have data

	useEffect(() => {
		const inputData = JSON.parse(localStorage.getItem(dataInput))
		if (inputData) {
			if (inputData.length !== dataMatchDays.length) {
				setMatchDay(parseInt(inputData.length) + 1)
			} else {
				setMatchDay(inputData.length)
			}
		}

		let days = [];
		for(let i = inputData ? inputData.length + 1 : 1; i < ( (teamsOfSeason.length - 1) * 2); i++) {
			days.push(i + 1)
		}
		return setDisDays(days)
	}, [])

	//------------> render field, select and input

	useEffect(() => {
		setSelectedDropMenuTeams([])
		const inputData = JSON.parse(localStorage.getItem(dataInput));

		if (matchDay === 1) {
			setDayButtonMinus(true)
		} else {
			setDayButtonMinus(false)
		}

		if (matchDay === dataMatchDays.length) {
			setDayButtonPlus(true)
		} else if (matchDay === (inputData ? inputData.length + 1 : 1)) {
			setDayButtonPlus(true)
		} else {
			setDayButtonPlus(false)
		}

		if (inputData) {
			const currentDay = inputData.find(day => day.matchDay === matchDay);
			if (currentDay) {
				setSaveButtonDisabled(true);
				setMatches(currentDay.matches);
			} else {
				const createDataResult = [];

				for (let i = 0; i < teamsOfSeason.length / 2; i++) {
					createDataResult.push({home: '', homeScore: '', awayScore: '', away: '', matchId: ''})
				}

				setMatches(createDataResult);
				setSaveButtonDisabled(false)

			}
		} else {
			const createDataResult = [];
			for (let i = 0; i < teamsOfSeason.length / 2; i++) {
				createDataResult.push({home: '', homeScore: '', awayScore: '', away: '', matchId: ''})
			}

			setMatches(createDataResult);
			setSaveButtonDisabled(false)

		}

		const localDayKey = localStorage.getItem(dayKey);
		const jsonDayKey = localDayKey ? JSON.parse(localDayKey) : [];
		const dayInLocal = jsonDayKey.find(day => day.matchDay === matchDay)
		if (dayInLocal) {
			setMatches(dayInLocal.matches)
			setSelectedDropMenuTeams(dayInLocal.selectedDropMenuTeams)
		}
	}, [matchDay, seasonOfLeague])

	// ------------> save data, if you updated page, or you went to next day

	useEffect(() => {
		const inputData = localStorage.getItem(dataInput);
		const inputDataJson = inputData ? JSON.parse(inputData) : [];
		const dayInLocal = inputDataJson.find(day => day.matchDay === matchDay);

		const localDayKey = localStorage.getItem(dayKey);
		const jsonDayKey = localDayKey ? JSON.parse(localDayKey) : [];
		const doubleDayInLocal = jsonDayKey.find(day => day.matchDay !== matchDay)

		if (matches.length > 0) {
			const data = [{matchDay: matchDay, matches: matches, selectedDropMenuTeams: selectedDropMenuTeams}]
			if (dayInLocal) {
				return
			} else {
				if (doubleDayInLocal) {
					const deleteDoubleDay = jsonDayKey.filter(day => day.matchDay !== matchDay)
					const push = [...deleteDoubleDay, data]
					const dayMatch = JSON.stringify(push)
					localStorage.setItem(dayKey, dayMatch)
				} else {
					const dayMatch = JSON.stringify(data)
					localStorage.setItem(dayKey, dayMatch)
				}
			}
		}

		getAvailableOptions();
	}, [matches])

	//------------> function button, getPoints, selectTeam, disableTeam

	const getPoints = (firstScore, secondScore) => {
		let points = 0;

		if (firstScore === secondScore) {
			points = 1;
		} else if (firstScore > secondScore) {
			points = 3
		}

		return points;
	}

	const handleMinus = () => {
		setMatchDay(parseInt(matchDay) - 1);
	};

	const handlePlus = () => {
		setMatchDay(parseInt(matchDay) + 1);
	};

	const chooseClub = (match, i, value, name) => {
		const newArray = [...match];
		newArray[i][name] = value;
		newArray[i].matchId = newArray[i].home && newArray[i].away ? newArray[i].home + '-' + newArray[i].away : newArray[i][name]
		setMatches(newArray);
		disabledItemsDropMenu(match, value)
	};

	const disabledItemsDropMenu = (match, id, value, name) => {
		let arr = [{team: value, id, name}];
		const searchSameTeam = selectedDropMenuTeams.find(el => el.id === id && el.name === name);

		if (!searchSameTeam) {
			setSelectedDropMenuTeams([...selectedDropMenuTeams, ...arr])
		} else {
			const arrNew = [];

			selectedDropMenuTeams.filter(team => {
				if (team.id !== id || team.name !== name) {
					arrNew.push(team)
				}
			})
			setSelectedDropMenuTeams([...arrNew, ...arr])
		}
	};

	const getAvailableOptions = (placement, oppositeValue) => {
		const inputData = localStorage.getItem(dataInput);
		const matchDays = inputData ? JSON.parse(inputData) : [];

		let allMatches = [];
		matchDays.forEach(matchDay => {
			allMatches = [...allMatches, ...matchDay.matches.map(match => match.matchId)]
		});

		let illegalTeams = [];

		if (oppositeValue) {
			switch (placement) {
				case 'home': {
					illegalTeams = allMatches
						.filter(matchId => matchId.endsWith(`-${oppositeValue}`))
						.map(matchId => matchId.replace(`-${oppositeValue}`, ''))
					break;
				}
				case 'away': {
					illegalTeams = allMatches
						.filter(matchId => matchId.startsWith(`${oppositeValue}-`))
						.map(matchId => matchId.replace(`${oppositeValue}-`, ''))
					break;
				}
			}
		} else {
			let teamIds = [];
			switch (placement) {
				case 'home': {
					teamIds = allMatches.map(matchId => matchId.split('-')[0])
					break;
				}
				case 'away': {
					teamIds = allMatches.map(matchId => matchId.split('-')[1])
					break;
				}
			}

			const gamesByTeam = teamsOfSeason.map(team => ({
				id: team.id,
				gamesCount: teamIds.filter(id => id === team.id).length
			}));

			illegalTeams = gamesByTeam
				.filter(team => team.gamesCount >= teamsOfSeason.length - 1)
				.map(team => team.id)
		}

		return [...selectedDropMenuTeams.map(el => el.team), ...illegalTeams].filter(id => id);
	}

	//------------> reset, clear, save

	const saveResult = (match) => {
		const filterField = match.map(el => !el.home || !el.homeScore || !el.awayScore || !el.away)
		if (filterField[0] || filterField[1]) {
			return alert('Error, not all fields are filled, please fill in all fields')
		} else {
			const inputDataLocal = JSON.parse(localStorage.getItem(dataInput));
			const matchDayData = {matchDay, matches: matches};
			let sumInputData = [];

			if (inputDataLocal) {
				sumInputData = [...inputDataLocal, matchDayData]
				localStorage.setItem(dataInput, JSON.stringify(sumInputData))
			} else {
				sumInputData = [matchDayData];
				localStorage.setItem(dataInput, JSON.stringify(sumInputData))
			}

			let teams = [...teamsOfSeason]
			sumInputData.forEach(matchDayData => {
				matchDayData.matches.forEach(match => {

					const restTeams = teams.filter(team => team.id !== match.home && team.id !== match.away);

					const homeTeam = teams.find(team => team.id === match.home);
					const awayTeam = teams.find(team => team.id === match.away);
					teams = [
						...restTeams,
						{
							...homeTeam,
							games: homeTeam.games ? homeTeam.games + 1 : 1,
							points: homeTeam.points ? homeTeam.points + getPoints(match.homeScore, match.awayScore) : getPoints(match.homeScore, match.awayScore),
							goalsPlus: homeTeam.goalsPlus ? homeTeam.goalsPlus + Number(match.homeScore) : Number(match.homeScore),
							goalsMinus: homeTeam.goalsMinus ? homeTeam.goalsMinus + Number(match.awayScore) : Number(match.awayScore),
							goalsDifference: homeTeam.goalsDifference ? homeTeam.goalsDifference + (match.homeScore - match.awayScore) : match.homeScore - match.awayScore
						},
						{
							...awayTeam,
							games: awayTeam.games ? awayTeam.games + 1 : 1,
							points: awayTeam.points ? awayTeam.points + getPoints(match.awayScore, match.homeScore) : getPoints(match.awayScore, match.homeScore),
							goalsPlus: awayTeam.goalsPlus ? awayTeam.goalsPlus + Number(match.awayScore) : Number(match.awayScore),
							goalsMinus: awayTeam.goalsMinus ? awayTeam.goalsMinus + Number(match.homeScore) : Number(match.homeScore),
							goalsDifference: awayTeam.goalsDifference ? awayTeam.goalsDifference + (match.awayScore - match.homeScore) : match.awayScore - match.homeScore

						}
					];
				})
			})

			const newDisDays = disDays.slice(1, disDays.length)
			localStorage.setItem(dataTable, JSON.stringify(teams))
			setSaveButtonDisabled(true)
			setSelectedDropMenuTeams([]);
			setDisDays(newDisDays)
			if (matchDay === dataMatchDays.length) {
				setDayButtonPlus(true)
				setSeasonEnded(true)
			} else {
				setDayButtonPlus(false)
			}

		}
		localStorage.removeItem(dayKey)
	}

	const clearDataMatches = () => {
		const createMatches = [];

		for (let i = 0; i < teamsOfSeason.length / 2; i++) {
			createMatches.push({home: '', homeScore: '', awayScore: '', away: '', matchId: ''})
		}
		setMatches(createMatches);
		setSelectedDropMenuTeams([]);
	}

	const reset = () => {
		const response = window.confirm("Are you sure you want to delete all data? It will be impossible to restore them!");

		if (response) {
			alert("Data completely deleted");
			localStorage.clear();
			window.location.reload();
		} else {
			alert("Сancel");
		}
	}

	return (
		<div className='matches-container'>
			<div className="football-container-results">
				<div className="matches-day">
					<div className="matches-day__text-menu">
						Match Day #
					</div>
					<div className="matches-day__menu-day">
						<Button onClick={handleMinus}
						        disabled={dayButtonMinus}>
							<PagePreviousIcon />
						</Button>
						<SelectPicker
							className="matches-day__choose-day"
							value={matchDay}
							data={selectDaysData}
							disabledItemValues={disDays}
							onChange={setMatchDay}
							cleanable={false}
							searchable={false}
						/>
						<Button onClick={handlePlus}
						        disabled={dayButtonPlus}>
							<PageNextIcon />
						</Button>
					</div>
					<div style={{paddingLeft: '10px'}}>
						from {dataMatchDays.length}
					</div>
				</div>
				<div className="matches-result">
					{
						matches.map((match, i) => (
							<div className="matches-result__match-day" key={i}>
								<div className="matches-result__football-match">
									<div>
										<SelectPicker
											className="matches-result__menu-clubs"
											placeholder='Choose home team'
											placement={"auto"}
											data={selectFootballClub}
											value={match.home}
											disabled={saveButtonDisabled}
											disabledItemValues={getAvailableOptions('home', match.away)}
											onChange={value => {
												chooseClub(matches, i, value, 'home')
												disabledItemsDropMenu(matches, i, value, 'home')
											}}
										/>
									</div>
									<div className="matches-result__input-block">
										<div className="matches-result__input">
											<InputNumber
												min={0}
												max={1000}
												placeholder={'Score'}
												value={match.homeScore}
												disabled={saveButtonDisabled}
												onChange={(value, event) => {
													const newArray = [...matches];
													newArray[i].homeScore = value;
													setMatches(newArray);
												}}
											/>
										</div>
										<span className="matches-result__inputElement">-</span>
										<div className="matches-result__input">
											<InputNumber
												min={0}
												max={1000}
												placeholder={'Score'}
												value={match.awayScore}
												disabled={saveButtonDisabled}
												onChange={(value,e) => {
													const newArray = [...matches];
													newArray[i].awayScore = value;
													setMatches(newArray);
												}}
											/>
										</div>
									</div>
									<div>
										<SelectPicker
											className="matches-result__menu-clubs"
											placeholder='Choose away team'
											placement={"auto"}
											data={selectFootballClub}
											value={match.away}
											disabledItemValues={getAvailableOptions('away', match.home)}
											disabled={saveButtonDisabled}
											onChange={value => {
												chooseClub(matches, i, value, 'away')
												disabledItemsDropMenu(matches, i, value, 'away')
											}}
										/>

									</div>
								</div>
							</div>
						))
					}
					<div className="matches-result__block-save">
						<div className="matches-result__button">
							<Button
								style={{color: '#9F0013'}}
								onClick={() => reset()}
								appearance="ghost"
								color="red">
								<NavLink style={{textDecoration: 'none', color: 'red'}} to='/' >Reset</NavLink>
							</Button>
						</div>
						<div className="matches-result__button">
							<Button
								style={{color: '#a6a605'}}
								onClick={() => clearDataMatches()}
								disabled={saveButtonDisabled}
								appearance="ghost"
								color="yellow">
								Clear
							</Button>
						</div>
						<div className="matches-result__button">
							<Button
								style={{color: '#3a9306'}}
								onClick={() => saveResult(matches)}
								disabled={saveButtonDisabled}
								appearance="ghost"
								color="green">
								Submit
							</Button>
						</div>
					</div>
					<div className={`matches-result__ended ${seasonEnded ? 'active' : ''}`}>
						The season is over, thanks for being with us!
					</div>
				</div>

			</div>
		</div>
	)
}
