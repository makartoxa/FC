import {useEffect, useMemo, useState} from "react";
import {Breadcrumb, Button, Input, Uploader} from 'rsuite';
import { AiOutlineClose } from "react-icons/ai";
import { DatePicker, Space } from 'antd';

import './CreateLeague.scss'


export const CreateLeague = ({ update, setUpdate }) => {
	const [leagueData, setLeagueData] = useState([])
	const [teams, setTeams] = useState([])
	const [fields, setNewField] = useState(2)
	const [addedLeague, setAddedLeague] = useState(false)
	const [date, setDate] = useState()
	const { RangePicker } = DatePicker;
	console.log('data', date);

	useEffect(() => {
		if (teams.length % 2 !== 0) {
			setTeams([...teams,
				{ id: `${fields}` , fcName: '', label: ''}])
		} else if (teams.length % 2 === 0) {
			setTeams([...teams,
				{ id: `${fields - 1}`, fcName: '', label: ''},
				{ id: `${fields}`, fcName: '', label: ''}])
		}
		setAddedLeague(false);
	}, [fields])

	const fillLeague = (value) => {
		let objLeague = {
			leagueName: '',
			label: ''
		};
		objLeague.leagueName = value;
		objLeague.label = value.slice(0, 1);
		setLeagueData(objLeague);
		setAddedLeague(false)
	}

	const fillTeams = (value, i) => {
		const newArray = [...teams];
		const team = newArray.find(team => team.id - 1 === i)
		team.fcName = value;
		team.label = value.slice(0, 1);
		const updateTeams = teams.filter(team => team.id - 1 !== i)
		const newTeams = [...updateTeams, team]
		setTeams(newTeams);
		setAddedLeague(false)
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
				<input type="file"
				       id="avatar"
				       name="avatar"
				       accept="image/png"/>
				<Button
					onClick={() => deleteTeamAndField(i)}
					className="create-league__button-delete">
					<AiOutlineClose size="15px" color="#7F0013"/>
				</Button>
			</div>
		)
	}


	const createLeague = () => {

		if (teams.length === 0) {
			alert("There are two commands must minimum in league ")
		} else if (teams.length % 2 === 0) {
			const oldLeaguesLocal = localStorage.getItem('leagues')
			const oldLeagues = oldLeaguesLocal ? JSON.parse(oldLeaguesLocal) : [];
			let newTeams = '';
			let newLeague = '';
			if (leagueData.length === 0 || leagueData.leagueName === '') {
				alert('You do not add league')
				return
			} else {
				newLeague = leagueData
			};

			if (teams.find(team => team.fcName === '')) {
				alert('You do not add all team name ')
				return
			} else {
				newTeams = {teams: [...teams]}
			}
			const sameNameLeague = oldLeaguesLocal
				? oldLeagues.find(league => league.leagueName === leagueData.leagueName)
				: false;
			console.log('sameNameLeague', sameNameLeague);
			if (sameNameLeague) {
				alert("Same name of league exists")
			} else {
				const newLeagues = [...oldLeagues, Object.assign(newLeague, newTeams)]
				localStorage.setItem('leagues', JSON.stringify(newLeagues))
				setUpdate(!update)
				setAddedLeague(true);
			}
		} else {
			alert("The number of commands must be paired")
		}
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
					<div className="create-league__submit">
						<button
							className="create-league__button-create"
							onClick={() => createLeague()}>
							Create league
						</button>
					</div>
					<div className={`create-league__added ${addedLeague ? 'show' : ''}`}
					     id={'btn'}>
						Your league added to list!
					</div>
				</div>
			</div>
		</div>
	)
}