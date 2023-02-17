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

import {useEffect, useState} from "react";
import {Button, SelectPicker} from "rsuite";

import './FootballResults.scss'


const teams = [
	{id: '1', name: 'Arsenal', label: arsenal},
	{id: '2', name: 'Aston Villa', label: astonVilla},
	{id: '3', name: 'Brighton', label: brighton},
	{id: '4', name: 'Brentford', label: brentford},
	{id: '5', name: 'Bournemouth', label: bouremounth},
	{id: '6', name: 'Crystal Palace', label: crystalPalace},
	{id: '7', name: 'Chelsea', label: chelsea},
	{id: '8', name: 'Fulham', label: fulham},
	{id: '9', name: 'Everton', label: everton},
	{id: '10', name: 'Forest', label: forest},
	{id: '11', name: 'Manchester City', label: manchester_city},
	{id: '12', name: 'Manchester United', label: m_u},
	{id: '13', name: 'Newcastle United', label: newCastle},
	{id: '14', name: 'Leeds', label: leeds},
	{id: '15', name: 'Tottenham', label: tottenham},
	{id: '16', name: 'Liverpool', label: liverpool},
	{id: '17', name: 'Leicester City', label: leicester},
	{id: '18', name: 'Southampton', label: sauthampton},
	{id: '19', name: 'West Ham United', label: westham},
	{id: '20', name: 'Wolverhampton', label: wolverhampton}
];

export const dataMatchDays = (() => {
	const days = [];

	for(let i = 0; i < (teams.length - 1) * 2; i++) {
		days.push({
			value: i + 1,
			label: i + 1
		})
	}

	return days;
})();

export const teamsArray = teams.sort((a, b) => {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
})

const selectDaysData = dataMatchDays.map(day => ({label: day.label, value: day.value}));
const selectFootballClub = teamsArray.map(team => ({value: team.id, label: team.name}));

const getPoints = (firstScore, secondScore) => {
	let points = 0;

	if (firstScore === secondScore) {
		points = 1;
	} else if (firstScore > secondScore) {
		points = 3
	}

	return points;
}


export const FootballResults = () => {

// useState
	const [matchDay, setMatchDay] = useState(1);
	const [matches, setMatches] = useState([])
	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
	const [selectedDropMenuTeams, setSelectedDropMenuTeams] = useState([])


	useEffect(() => {
		setSelectedDropMenuTeams([])
		const inputData = JSON.parse(localStorage.getItem('inputData'));
		if (inputData) {
			const currentDay = inputData.find(day => day.matchDay === matchDay);

			if (currentDay) {
				setSaveButtonDisabled(true);
				setMatches(currentDay.matches);
			} else {
				const createDataResult = [];

				for (let i = 0; i < teamsArray.length / 2; i++) {
					createDataResult.push({home: '', homeScore: '', awayScore: '', away: '', matchId: ''})
				}
				setMatches(createDataResult);
				setSaveButtonDisabled(false)

			}
		} else {
			const createDataResult = [];

			for (let i = 0; i < teamsArray.length / 2; i++) {
				createDataResult.push({home: '', homeScore: '', awayScore: '', away: '', matchId: ''})
			}
			setMatches(createDataResult);
			setSaveButtonDisabled(false)

		}
	}, [matchDay])


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


	const chooseClub = (match, i, value, name) => {
		console.log('i', i);
		const newArray = [...match];
		newArray[i][name] = value;
		newArray[i].matchId = newArray[i].home && newArray[i].away ? newArray[i].home + '-' + newArray[i].away : newArray[i][name]
		setMatches(newArray);
		disabledItemsDropMenu(match, value)
	};

	console.log('matches', matches);

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

			let teams = [...teamsArray]
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

			if (inputDataLocal) {

			}

			localStorage.setItem('tableData', JSON.stringify(teams))
			setSaveButtonDisabled(true)
			setSelectedDropMenuTeams([]);

		}
	}

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

			const gamesByTeam = teams.map(team => ({
				id: team.id,
				gamesCount: teamIds.filter(id => id === team.id).length
			}));

			illegalTeams = gamesByTeam
				.filter(team => team.gamesCount >= teams.length - 1)
				.map(team => team.id)
		}

		return [...selectedDropMenuTeams.map(el => el.team), ...illegalTeams].filter(id => id);
	}


	return (
		<div className='football-results'>
			<div className="match-day">
				<div className="text-menu">Match Day #</div>
				<SelectPicker
					className="dropdown-menu-day"
					value={matchDay}
					data={selectDaysData}
					onChange={setMatchDay}
					cleanable={false}
					searchable={false}
				/>
			</div>
			<div className="results">
				{
					matches.map((match, i) => (
						<div className="result-football-match-day">
							<div className="football-match"
							     key={i}>
								<div>
									<SelectPicker
										className="dropdown-menu-clubs"
										placeholder='Chose FC'
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
								<div>
									<input
										className="enter-check"
										type="number"
										value={match.homeScore >= 0 && match.homeScore.length < 2 ? match.homeScore : ''}
										disabled={saveButtonDisabled}
										aria-label="Text input with segmented dropdown button"
										onChange={(e) => {
											const newArray = [...matches];
											newArray[i].homeScore = e.target.value;
											setMatches(newArray);
										}}
									/>
									<span style={{margin: '5px'}}>-</span>
									<input
										className="enter-check"
										type="number"
										value={match.awayScore >= 0  && match.awayScore.length < 2 ? match.awayScore : ''}
										disabled={saveButtonDisabled}
										aria-label="Text input with segmented dropdown button"
										onChange={(e) => {
											const newArray = [...matches];
											newArray[i].awayScore = e.target.value;
											setMatches(newArray);
										}}
									/>
								</div>
								<div>
									<SelectPicker
										className="dropdown-menu-clubs"
										placeholder='Chose FC'
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
				<div className="result-block-save">
					<Button
						style={{color: '#9F0013'}}
						onClick={() => saveResult(matches)}
						disabled={saveButtonDisabled}
						appearance="ghost"
						color="red">
						Submit
					</Button>
				</div>

			</div>

		</div>
	)
}
