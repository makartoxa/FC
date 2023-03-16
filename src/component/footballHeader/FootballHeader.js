import './FootballHeader.scss'
import TrashIcon from "@rsuite/icons/Trash";
import { NavLink } from "react-router-dom";

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
				<div className="football-container-header-league__delete">
					<TrashIcon />
				</div>
			</div>
			<div className="football-container-header-nav">
				<NavLink className="football-container-header-nav__button" to={`/${ encodeURI(league.leagueName) }/table`}>Table</NavLink>
				<NavLink className="football-container-header-nav__button" to={`/${ encodeURI(league.leagueName) }/results`}>Results</NavLink>
			</div>

		</>
	)
}