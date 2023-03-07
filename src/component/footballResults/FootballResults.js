import epl from "../logo/epl.png"
import arsenal from "../logo/arsenal.png"
import astonVilla from "../logo/astonVilla.png"
import bouremounth from "../logo/bouremounth.png"
import brentford from "../logo/brentford.png"
import brighton from "../logo/brighton.png"
import chelsea from "../logo/chelsea.png"
import crystalPalace from "../logo/crystalPalace.png"
import everton from "../logo/everton.png"
import forest from "../logo/forest.png"
import fulham from "../logo/fulham.png"
import leeds from "../logo/leeds.png"
import leicester from "../logo/leicester.png"
import liverpool from "../logo/liverpool.png"
import m_u from "../logo/m_u.png"
import manchester_city from "../logo/manchester_city.png"
import newCastle from "../logo/newCastle.png"
import sauthampton from "../logo/sauthampton.png"
import tottenham from "../logo/tottenham.png"
import westham from "../logo/westham.png"
import wolverhampton from "../logo/wolverhampton.png"

import {useEffect, useState, useRef, useMemo} from "react";
import {Button, SelectPicker, InputNumber, DatePicker} from "rsuite";
import PageNextIcon from '@rsuite/icons/PageNext';
import PagePreviousIcon from '@rsuite/icons/PagePrevious';

import './FootballResults.scss'
import {FootballDemo} from "../footballDemo/FootballDemo";
import {NavLink} from "react-router-dom";

const localLeague = localStorage.getItem('league_APL')
 const team = JSON.parse(localLeague)
export const LEAGUE = team ? team : [{
	league:
		[{leagueName: 'England Premier League',
		label: epl}],
	teams:
		[{id: '1', fcName: 'Arsenal', label: arsenal},
		{id: '2', fcName: 'Aston Villa', label: astonVilla},
		{id: '3', fcName: 'Brighton', label: brighton},
		{id: '4', fcName: 'Brentford', label: brentford},
		{id: '5', fcName: 'Bournemouth', label: bouremounth},
		{id: '6', fcName: 'Crystal Palace', label: crystalPalace},
		{id: '7', fcName: 'Chelsea', label: chelsea},
		{id: '8', fcName: 'Fulham', label: fulham},
		{id: '9', fcName: 'Everton', label: everton},
		{id: '10', fcName: 'Forest', label: forest},
		{id: '11', fcName: 'Manchester City', label: manchester_city},
		{id: '12', fcName: 'Manchester United', label: m_u},
		{id: '13', fcName: 'Newcastle United', label: newCastle},
		{id: '14', fcName: 'Leeds', label: leeds},
		{id: '15', fcName: 'Tottenham', label: tottenham},
		{id: '16', fcName: 'Liverpool', label: liverpool},
		{id: '17', fcName: 'Leicester City', label: leicester},
		{id: '18', fcName: 'Southampton', label: sauthampton},
		{id: '19', fcName: 'West Ham United', label: westham},
		{id: '20', fcName: 'Wolverhampton', label: wolverhampton}]
}];

export const dataMatchDays = (() => {
	const days = [];

	for(let i = 0; i < (LEAGUE[0].teams.length - 1) * 2; i++) {
		days.push({
			value: i + 1,
			label: i + 1
		})
	}
	return days;
})();

const selectDaysData = dataMatchDays.map(day => ({label: day.label, value: day.value}));
const selectFootballClub = LEAGUE[0].teams.map(team => ({value: team.id, label: team.fcName}));


export const FootballResults = () => {

	//------------> useState

	const [matchDay, setMatchDay] = useState(1);
	const [matches, setMatches] = useState([]);
	const [disDays, setDisDays] = useState([])
	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
	const [selectedDropMenuTeams, setSelectedDropMenuTeams] = useState([]);
	const [dayButtonMinus, setDayButtonMinus] = useState(false);
	const [dayButtonPlus, setDayButtonPlus] = useState(false);
	const [seasonEnded, setSeasonEnded] = useState(false);

	const dayKey = useMemo(() => `matchDay_${matchDay}`, [matchDay]);

	//------------> go to matchDay, when field do not have data



	useEffect(() => {
		const inputData = JSON.parse(localStorage.getItem('inputData'))
		if (inputData) {
			if (inputData.length !== dataMatchDays.length) {
				setMatchDay(parseInt(inputData.length) + 1)
			} else {
				setMatchDay(inputData.length)
			}
		}

		let days = [];
		for(let i = inputData ? inputData.length + 1 : 1; i < ( (LEAGUE[0].teams.length - 1) * 2); i++) {
			days.push(i + 1)
		}
		return setDisDays(days)
	}, [])

	//------------> render field, select and input

	useEffect(() => {
		setSelectedDropMenuTeams([])
		const inputData = JSON.parse(localStorage.getItem('inputData'));

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

				for (let i = 0; i < LEAGUE[0].teams.length / 2; i++) {
					createDataResult.push({home: '', homeScore: '', awayScore: '', away: '', matchId: ''})
				}

				setMatches(createDataResult);
				setSaveButtonDisabled(false)

			}
		} else {
			const createDataResult = [];
			for (let i = 0; i < LEAGUE[0].teams.length / 2; i++) {
				createDataResult.push({home: '', homeScore: '', awayScore: '', away: '', matchId: ''})
			}

			setMatches(createDataResult);
			setSaveButtonDisabled(false)

		}

		const localDayKey = localStorage.getItem('dayKey');
		const jsonDayKey = localDayKey ? JSON.parse(localDayKey) : [];
		const dayInLocal = jsonDayKey.find(day => day.matchDay === matchDay)
		if (dayInLocal) {
			setMatches(dayInLocal.matches)
			setSelectedDropMenuTeams(dayInLocal.selectedDropMenuTeams)
		} else {
			return
		}

	}, [matchDay])


	// ------------> save data, if you updated page, or you went to next day

	useEffect(() => {
		const inputData = localStorage.getItem('inputData');
		const inputDataJson = inputData ? JSON.parse(inputData) : [];
		const dayInLocal = inputDataJson.find(day => day.matchDay === matchDay);

		const localDayKey = localStorage.getItem('dayKey');
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
					localStorage.setItem('dayKey', dayMatch)
				} else {
					const dayMatch = JSON.stringify(data)
					localStorage.setItem('dayKey', dayMatch)
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
		const inputData = localStorage.getItem('inputData');
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

			const gamesByTeam = LEAGUE[0].teams.map(team => ({
				id: team.id,
				gamesCount: teamIds.filter(id => id === team.id).length
			}));

			illegalTeams = gamesByTeam
				.filter(team => team.gamesCount >= LEAGUE[0].teams.length - 1)
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
			///
			// const inputData = localStorage.getItem('inputData');
			// const matchDays = inputData ? JSON.parse(inputData) : [];
			//
			// let allMatches = [];
			// matchDays.forEach(matchDay => {
			// 	allMatches = [...allMatches, ...matchDay.matches.map(match => match.matchId)]
			// });
			//
			// const somethingWrong = allMatches.some(matchId => matches.some(match => match.matchId === matchId))
			// if (somethingWrong) {
			// 	return alert('Something wrong!')
			// }
			///
			const inputDataLocal = JSON.parse(localStorage.getItem('inputData'));
			const matchDayData = {matchDay, matches: matches};
			let sumInputData = [];

			if (inputDataLocal) {
				sumInputData = [...inputDataLocal, matchDayData]
				localStorage.setItem('inputData', JSON.stringify(sumInputData))
			} else {
				sumInputData = [matchDayData];
				localStorage.setItem('inputData', JSON.stringify(sumInputData))
			}

			let teams = [...LEAGUE[0].teams]
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
			localStorage.setItem('tableData', JSON.stringify(teams))
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
		localStorage.removeItem('dayKey')
	}

	const clearDataMatches = () => {
		const createMatches = [];

		for (let i = 0; i < LEAGUE[0].teams.length / 2; i++) {
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
					<span style={{paddingLeft: '10px'}}>
					from {dataMatchDays.length}
				</span>
				</div>
			</div>
			<div className="matches-result">
				{
					matches.map((match, i) => (
						<div className="matches-result__match-day">
							<div className="matches-result__football-match"
							     key={i}>
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
							Reset
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
	)
}
