import './FootballHeader.scss'
import TrashIcon from "@rsuite/icons/Trash";
import CopyIcon from '@rsuite/icons/Copy';
import { NavLink } from "react-router-dom";
import {SelectPicker} from "rsuite";
import {useState} from "react";

export const FootballHeader = ({ league, color }) => {

	return (
		<>
			<div className="football-container-header">
				<div className="football-container-header-league">
					{ league.label.length > 1  ? (
						<>
							<img className="football-container-header-league__label" style={{ objectFit: 'contain' }} src={ league.label } width="75px" height="50px"/>
							<div className="football-container-header-league__name">{ league.leagueName }</div>
						</>
					) : (
						<>
							<div className="football-container-header-league__label" style={{backgroundColor: color()}}>{ league.label }</div>
							<div className="football-container-header-league__name">{ league.leagueName }</div>
						</>
					)
					}
				</div>
				<div className="football-container-header-league__group-button">
					<div className="football-container-header-league__copy">
						<button className="football-container-header-league__buttons">
							<CopyIcon />
						</button>
					</div>
					<div className="football-container-header-league__delete">
						<button className="football-container-header-league__buttons">
							<TrashIcon />
						</button>
					</div>
				</div>
			</div>
			<div className="football-container-header-seasons">
				Seasons
				<SelectPicker
					/>
			</div>
			<div className="football-container-header-nav">
				<NavLink className="football-container-header-nav__button" to={`/${ encodeURI(league.leagueName) }/table`}>Table</NavLink>
				<NavLink className="football-container-header-nav__button" to={`/${ encodeURI(league.leagueName) }/results`}>Results</NavLink>
			</div>
		</>
	)
}