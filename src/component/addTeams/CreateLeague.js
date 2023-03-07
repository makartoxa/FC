import {useEffect, useMemo, useState} from "react";

import {Button, Input, Uploader} from 'rsuite';
import { AiOutlineClose } from "react-icons/ai";

import './CreateLeague.scss'

export const CreateLeague = () => {
	const [league, setLeague] = useState([])
	const [teams, setTeams] = useState([])
	const [fields, setNewField] = useState(2)

	console.log('league', league);
	console.log('teams', teams);

	useEffect(() => {
		if (teams.length % 2 !== 0) {
			setTeams([...teams,
				{ id: fields , fcName: '', label: ''}])
		} else if (teams.length % 2 === 0) {
			setTeams([...teams,
				{ id: fields - 1, fcName: '', label: ''},
				{ id: fields, fcName: '', label: ''}])
		}
	}, [fields])

	const fillLeague = (value) => {
		const newArray = [{
			leagueName: '',
			label: ''
		}];
		newArray[0].leagueName = value;
		newArray[0].label = value.slice(0, 1);
		setLeague(newArray);
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

	const dataLeague = () => {

	}

	const createLeague = () => {
		if (teams.length === 0) {
			alert("There are two commands must minimum in league ")
		} else if (teams.length % 2 === 0) {
			let newTable = [];
			let newTeams = '';
			let newLeague = '';
			if (league.length === 0 || league.find(name => name.leagueName === '')) {
				alert('You do not add league')
				return
			} else {
				console.log('league', league)
				newLeague = {league: [...league]}
			};


			if (teams.find(team => team.fcName === '')) {
				alert('You do not add all team name ')
				return
			} else {
				console.log('2')
				newTeams = {teams: [...teams]}
			}
			newTable = [Object.assign(newLeague, newTeams)]
			const leagueName = `league_${league[0].leagueName}`
			localStorage.removeItem('dayKey')
			localStorage.setItem(leagueName, JSON.stringify(newTable))
			console.log('newTable', newTable);
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
						       value={league.leagueName}
						       onChange={value => {
							       fillLeague(value)
						       }}/>
					</div>
				</div>
				<div className="create-league__body">
					<div className="create-league__name-text">
						Fill team name and add logo
					</div>
					{
						[...Array(fields)].map((value, i) => newTeamInput(i))
					}
					<div className="create-league__new-field">
						<Button
							className="create-league__button"
							style={{color: 'blue'}}
							appearance="ghost"
							color={"blue"}
							onClick={() => addFields()}>
							+ Add new field
						</Button>
					</div>
					<div className="create-league__submit">
						<Button
							className="create-league__button"
							style={{color: 'green'}}
							appearance="ghost"
							color={"green"}
							onClick={() => createLeague()}>
							Create league
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}