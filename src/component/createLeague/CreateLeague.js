import { useEffect, useState } from "react";
import { Message, Button, Input } from 'rsuite';
import { AiOutlineClose } from "react-icons/ai";
import { DatePicker, Space } from 'antd';
import moment from "moment";
import { TEXT_FOR_CREATE_PAGE } from "../../TEXT_FOR_CREATE_PAGE"

import './CreateLeague.scss'

export const CreateLeague = ({
	                             update,
	                             setUpdate,
	                             copyDataForNewLeagueOrNewSeason }) => {

	const [idTeam, setIdTeam] = useState(2)
	const [dataLeague, setDataLeague] = useState({})
	const [dataTeams, setDataTeams] = useState([])
	const [addId, setAddId] = useState(false)
	const [dateTime, setDateTime] = useState()

	const [message, setMessage] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [isWarningPeriod, setIsWarningPeriod] = useState(false)
	const [isWarningSamePeriod, setIsWarningSamePeriod] = useState(false)
	const [isWarning, setIsWarning] = useState(false)
	const [isError, setIsError] = useState(false)

	const { RangePicker } = DatePicker;
	const dateStart = dateTime ? moment(dateTime[0]['$d']).format('MMM YYYY') : false;
	const dateEnd = dateTime ? moment(dateTime[1]['$d']).format('MMM YYYY') : false;
	const seasonPeriod = dateStart && dateEnd ? { seasonTime: `${dateStart} - ${dateEnd}` } : false

	useEffect(() => {
		if (copyDataForNewLeagueOrNewSeason) {
			setDataLeague({
				leagueName: copyDataForNewLeagueOrNewSeason.leagueName,
				label: copyDataForNewLeagueOrNewSeason.label,
				pathPage: 'league',
				colorLeague: getRandomColor()
			})
		} else {
			setDataLeague({
				leagueName: '',
				label: '',
				pathPage: 'league',
				colorLeague: getRandomColor()
			})
		}
	}, [copyDataForNewLeagueOrNewSeason])

	useEffect(() => {
		if (copyDataForNewLeagueOrNewSeason) {
			setDataTeams(copyDataForNewLeagueOrNewSeason.teams)
			setIdTeam(copyDataForNewLeagueOrNewSeason.teams.length);
		} else if (!copyDataForNewLeagueOrNewSeason) {
			const nameTeams = [
				{ id: `${idTeam - 1}`, fcName: '', label: '', color: getRandomColor()},
				{ id: `${idTeam}`, fcName: '', label: '', color: getRandomColor()}
			]
			setDataTeams(nameTeams)
		}
	}, [copyDataForNewLeagueOrNewSeason])

	useEffect(() => {
		if (addId) {
			if (dataTeams.length % 2 === 0) {
				return setDataTeams([...dataTeams,
					{ id: `${idTeam - 1}` , fcName: '', label: '', color: getRandomColor()},
					{ id: `${idTeam}` , fcName: '', label: '', color: getRandomColor()}
				]);
			} else {
				setDataTeams([...dataTeams, {id: `${idTeam}`, fcName: '', label: '', color: getRandomColor()}])
			}
		}
	}, [idTeam])

	const getRandomColor = () => {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	const addIdTeams = () => {
		if (dataTeams.length % 2 === 0) {
			setIdTeam(idTeam + 2)
		} else if (dataTeams.length % 2 !== 0) {
			setIdTeam(idTeam + 1)
		}
	}

	const deleteTeamAndField = (i) => {
		const newTeams = dataTeams.filter(team => team !== dataTeams[i])
		setDataTeams(newTeams);
	}

	const clearFields = (league) => {
		setDataLeague({
			leagueName: league ? league : '',
			label: '',
			pathPage: 'league',
			colorLeague: getRandomColor()
		})
		setDataTeams([
			{ id: `${idTeam - 1}` , fcName: '', label: '', color: getRandomColor()},
			{ id: `${idTeam}` , fcName: '', label: '', color: getRandomColor()}
		]);
		setDateTime(null);

	}


	const createLeague = () => {

		messages()

		if (dataTeams.length === 0) {

			setIsError(true)

		} else if (dataTeams.length % 2 === 0) {

			const oldLeaguesLocal = localStorage.getItem('leagues')
			const oldLeagues = oldLeaguesLocal ? JSON.parse(oldLeaguesLocal) : [];
			let newTeams = '';
			let newLeague = '';

				if (dataLeague.length === 0 || dataLeague.leagueName === '') {
					return setIsWarning(true)

				} else {
					newLeague = dataLeague
				}

					if (dataTeams.find(team => team.fcName === '')) {
						return setIsWarning(true)

					} else {
						newTeams = {teams: [...dataTeams]}
					}

			const sameNameLeague = oldLeaguesLocal
				? oldLeagues.find(league => league.leagueName === dataLeague.leagueName)
				: false;

			if (sameNameLeague) {
				if ( seasonPeriod ) {
					const allSeasonPeriodSameLeague = sameNameLeague.seasons.map(el => el.seasonTime);
					const dateNewPeriod = allSeasonPeriodSameLeague.map(el => ( new Date(el.slice(11, 19)) > new Date(dateStart)) )
					const samePeriodOfLeague = dateNewPeriod.find(el => el === true)

					if ( samePeriodOfLeague) {
						return setIsWarningSamePeriod(true)

					} else if (!samePeriodOfLeague) {

						const oldLeaguesFilter = oldLeagues.filter(el => el !== sameNameLeague)
						const addSeasonsSameLeague = [...sameNameLeague.seasons, Object.assign(seasonPeriod, newTeams)]
						const updateLeague = {
							leagueName: sameNameLeague.leagueName,
							label: sameNameLeague.label,
							pathPage: 'league',
							colorLeague: getRandomColor(),
							seasons: addSeasonsSameLeague
						}
						const newLeagues = [...oldLeaguesFilter, updateLeague]
						localStorage.setItem('leagues', JSON.stringify(newLeagues))
						setUpdate(!update)
						clearFields(sameNameLeague.leagueName)
						setIdTeam(2)
						setIsSuccess(true)
					}
				} else {
					return setIsWarningPeriod(true)
				}

			} else {
				if (seasonPeriod) {
					const period = { seasons: [Object.assign(seasonPeriod, newTeams)] };
					const pathPage = { pathPage: 'league' }
					const newLeagues = [...oldLeagues, Object.assign(newLeague, pathPage, period)]
					localStorage.setItem('leagues', JSON.stringify(newLeagues))
					setUpdate(!update)
					clearFields()
					setIdTeam(2)
					setIsSuccess(true)
				} else {
					return setIsWarningPeriod(true)
				}
			}

		} else {
			setIsError(true)
		}
	}

	const messages = () => {
		setMessage(true)
		setTimeout(() => {
			setMessage(false)
			setIsSuccess(false)
			setIsError(false)
			setIsWarning(false)
			setIsWarningPeriod(false)
			setIsWarningSamePeriod(false)
		}, 4000);
	}

	return (
		<div className="create-league">
			<div className="create-league__header">
				{
					copyDataForNewLeagueOrNewSeason ? TEXT_FOR_CREATE_PAGE.season.title : TEXT_FOR_CREATE_PAGE.league.title
				}
			</div>
			<div className="create-league__container">
				<div className="create-league__name-league">
					<div className="create-league__name-text">
						{
							copyDataForNewLeagueOrNewSeason ? TEXT_FOR_CREATE_PAGE.season.titleOfLeague : TEXT_FOR_CREATE_PAGE.league.titleOfLeague
						}
					</div>
					<div className="create-league__add-team">
						<Input className="create-league__input league"
						       placeholder="Name of league" type='text'
						       disabled={!!copyDataForNewLeagueOrNewSeason}
						       onChange={value => {
								   const newDataLeague = {};
							       newDataLeague.leagueName = value;
							       newDataLeague.label = value.slice(0, 1);
								   newDataLeague.colorLeague = getRandomColor();
							       setDataLeague(newDataLeague);
						       }}/>
					</div>
				</div>
				<div className="create-league__data-text">
					Fill the time of season
					<Space direction="vertical" size={12}>
						<RangePicker picker="month"
						             format={"MMM YYYY"}
						             value={dateTime}
						             onChange={(value) => setDateTime(value)}
						             bordered={false}/>
					</Space>
				</div>
				<div className="create-league__body">
					<div className="create-league__name-text">
						Fill name of team and add logo
					</div>
					{
						dataTeams.map((team, i) => (
							<div className="create-league__add-team"
							     key={i}>
								<Input className="create-league__input"
								       placeholder="Name of team"
								       value={team.fcName}
								       onChange={value => {
									       const newArray = [...dataTeams];
									       newArray[i].fcName = value
									       newArray[i].label = value.slice(0, 1);
									       setDataTeams(newArray);

								       }}/>
								<Button
									className="create-league__button-delete"
									onClick={() => deleteTeamAndField(i)}
								>
									<AiOutlineClose
										size="15px"
										color="#7F0013"
									/>
								</Button>
							</div>

						))
					}
					<div className="create-league__new-field">
						<button
							className="create-league__button-add"
							color={"blue"}
							onClick={() => {
								setAddId(true)
								addIdTeams()
							}}
						>
							+ Add new field
						</button>
					</div>
					{ message && (
						<div className="create-league__added">
							{ isSuccess && (
								<Message showIcon type="success" header="Success">
									{
										copyDataForNewLeagueOrNewSeason ? TEXT_FOR_CREATE_PAGE.season.result : TEXT_FOR_CREATE_PAGE.league.result
									}
								</Message>)
							}
							{ isWarning && (
								<Message showIcon type="warning" header="Warning">
									All fields must be filled
								</Message>)
							}
							{ isWarningPeriod && (
								<Message showIcon type="warning" header="Warning">
									You do not fill period of season
								</Message>)
							}
							{
								isWarningSamePeriod && (
									<Message showIcon type="warning" header="Warning">
										Such a period of season exists
									</Message>
								)
							}
							{isError && (
								<Message showIcon type="error" header="Error">
									There are two commands must minimum in league and <br/>
									number of commands must be paired
								</Message>)
							}
						</div>
					)
					}
					<div className="create-league__submit">
						<button
							className="create-league__button-create"
							onClick={() => createLeague()}
						>
							{
								copyDataForNewLeagueOrNewSeason ? TEXT_FOR_CREATE_PAGE.season.button : TEXT_FOR_CREATE_PAGE.league.button
							}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}