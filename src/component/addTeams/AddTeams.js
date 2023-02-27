import {Button, Input, Uploader} from 'rsuite';
import { AiOutlineClose } from "react-icons/ai";


import './AddTeams.scss'

export const AddTeams = () => {
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
						<Input className="create-league__input" placeholder="Name of league" type='text'/>
						<Uploader className="create-league__up-loader"
						          action="//jsonplaceholder.typicode.com/posts/" />
						<Button
							className="create-league__button-delete">
							<AiOutlineClose size="20px" color="#7F0013"/>
						</Button>
					</div>
				</div>
				<div className="create-league__body">
					<div className="create-league__name-text">
						Fill team name and add logo
					</div>
					<div className="create-league__add-team">
						<Input className="create-league__input" placeholder="Name of team" width='70px'/>
						<Uploader className="create-league__up-loader"
						          action="//jsonplaceholder.typicode.com/posts/" />
						<Button
							className="create-league__button-delete">
							<AiOutlineClose size="20px" color="#7F0013"/>
						</Button>
					</div>
					<div className="create-league__new-field">
						<Button
							className="create-league__button"
							style={{color: 'blue'}}
							appearance="ghost"
							color={"blue"}>
							+ Add new field
						</Button>
					</div>
					<div className="create-league__submit">
						<Button
							className="create-league__button"
							style={{color: 'green'}}
							appearance="ghost"
							color={"green"}>
							Create league
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}