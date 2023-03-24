import { useEffect, useState } from "react";
import { Message, Button, Input, Uploader } from 'rsuite';
import { AiOutlineClose } from "react-icons/ai";
import { DatePicker, Space } from 'antd';

import './CreateLeague.scss'
import moment from "moment";


export const CreateLeague = ({ update, setUpdate }) => {

	const [leagueData, setLeagueData] = useState([])
	const [teams, setTeams] = useState([])
	const [fields, setNewField] = useState(2)
	const [date, setDate] = useState()
	const [message, setMessage] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [isWarningPeriod, setIsWarningPeriod] = useState(false)
	const [isWarningSamePeriod, setIsWarningSamePeriod] = useState(false)
	const [isWarning, setIsWarning] = useState(false)
	const [isError, setIsError] = useState(false)

	const { RangePicker } = DatePicker;
	const dateStart = date ? moment(date[0]['$d']).format('MMM YYYY') : false;
	const dateEnd = date ? moment(date[1]['$d']).format('MMM YYYY') : false;
	const seasonPeriod = dateStart && dateEnd ? { seasonTime: `${dateStart} - ${dateEnd}` } : false

	useEffect(() => {
		if (teams.length % 2 !== 0) {
			setTeams([...teams,
				{ id: `${fields}` , fcName: '', label: ''}])
		} else if (teams.length % 2 === 0) {
			setTeams([...teams,
				{ id: `${fields - 1}`, fcName: '', label: ''},
				{ id: `${fields}`, fcName: '', label: ''}])
		}
	}, [fields])

	const fillLeague = (value) => {
		let objLeague = {
			leagueName: '',
			label: ''
		};
		objLeague.leagueName = value;
		objLeague.label = value.slice(0, 1);
		setLeagueData(objLeague);
	}

	const fillTeams = (value, i) => {
		const newArray = [...teams];
		const team = newArray.find(team => team.id - 1 === i)
		team.fcName = value;
		team.label = value.slice(0, 1);
		const updateTeams = teams.filter(team => team.id - 1 !== i)
		const newTeams = [...updateTeams, team]
		setTeams(newTeams);
	}

	const addFields = () => {
		if (teams.length % 2 === 0) {
			setNewField(fields + 2);
			return
		} else {
			setNewField(fields + 1);
		}
	}

	const deleteTeamAndField = (i) => {
		document.getElementById(i).remove()
		const newTeams = teams.filter(team => team.id - 1 !== i)
		setTeams(newTeams);
	}

	const newTeamInput = (i) => {
		return (
			<div id={i}
			     className="create-league__add-team"
			     key={i}>
				<Input className="create-league__input"
				       placeholder="Name of team"
				       value={teams.fcName}
				       onChange={value => {
					       fillTeams(value, i)
				       }}/>
				<Button
					onClick={() => deleteTeamAndField(i)}
					className="create-league__button-delete">
					<AiOutlineClose size="15px" color="#7F0013"/>
				</Button>
			</div>
		)
	}


	const createLeague = () => {

		messages()

		if (teams.length === 0) {

			setIsError(true)

		} else if (teams.length % 2 === 0) {

			const oldLeaguesLocal = localStorage.getItem('leagues')
			const oldLeagues = oldLeaguesLocal ? JSON.parse(oldLeaguesLocal) : [];
			let newTeams = '';
			let newLeague = '';


				if (leagueData.length === 0 || leagueData.leagueName === '') {
					setIsWarning(true)
					return
				} else {
					newLeague = leagueData
				};

					if (teams.find(team => team.fcName === '')) {
						setIsWarning(true)
						return
					} else {
						newTeams = {teams: [...teams]}
					}

			const sameNameLeague = oldLeaguesLocal
				? oldLeagues.find(league => league.leagueName === leagueData.leagueName)
				: false;

			if (sameNameLeague) {
				if (seasonPeriod) {
					const allSeasonPeriod = sameNameLeague.seasons.map(el => el.seasonTime);
					const sameSeasonPeriod = allSeasonPeriod.map(el => el === seasonPeriod.seasonTime)
					if (sameSeasonPeriod.find(el => el === true)) {
						return setIsWarningSamePeriod(true)
					} else {
						const oldLeaguesFilter = oldLeagues.filter(el => el !== sameNameLeague)
						const addSeasonsSameLeague = [...sameNameLeague.seasons, Object.assign(seasonPeriod, newTeams)]
						const updateLeague = {
							leagueName: sameNameLeague.leagueName,
							label: sameNameLeague.label,
							seasons: addSeasonsSameLeague
						}
						const newLeagues = [...oldLeaguesFilter, updateLeague]
						localStorage.setItem('leagues', JSON.stringify(newLeagues))
						setUpdate(!update)
						setIsSuccess(true)
						return
					}
				} else {
					return setIsWarningPeriod(true)
				}

			} else {
				if (seasonPeriod) {
					const period = {seasons: [Object.assign(seasonPeriod, newTeams)]};
					const newLeagues = [...oldLeagues, Object.assign(newLeague, period)]
					localStorage.setItem('leagues', JSON.stringify(newLeagues))
					setUpdate(!update)
					setIsSuccess(true)
					return
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
		}, 6000);
	}

	return (
		<div className="create-league">
			<div className="create-league__header">
				Create a football league
			</div>
			<div className="create-league__container">
				<div className="create-league__name-league">
					<div className="create-league__name-text">
						Fill name of league
					</div>
					<div className="create-league__add-team">
						<Input className="create-league__input league"
						       placeholder="Name of league" type='text'
						       value={leagueData.leagueName}
						       onChange={value => {
							       fillLeague(value)
						       }}/>
					</div>
				</div>
				<div style={{display:'flex', alignItems:'center',gap: '10px', justifyContent: 'center', flexDirection: 'column', paddingBottom: '20px'}}>
					Fill seasons period
					<Space direction="vertical" size={12}>
						<RangePicker picker="month"
						             format={"MMM YYYY"}
						             onChange={(value) => setDate(value)}
						             bordered={false}/>
					</Space>
				</div>
				<div className="create-league__body">
					<div className="create-league__name-text">
						Fill team name and add logo
					</div>
					<div className="create-league__new-field">
						<button
							className="create-league__button-add"
							color={"blue"}
							onClick={() => addFields()}>
							+ Add new field
						</button>
					</div>

					{
						[...Array(fields)].map((value, i) => newTeamInput(i))
					}
					{ message && (
						<div className="create-league__added">
							{ isSuccess && (
								<Message showIcon type="success" header="Success">
									Your league added to list!
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
							onClick={() => createLeague()}>
							Create league
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}