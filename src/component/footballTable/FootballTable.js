
import { COLUMNS } from "../../Columns";
import {teamsArray} from "../footballResults/FootballResults";

import { useEffect, useState } from "react";

import './FootballTable.scss'

export const FootballTable = ( ) => {
	const [tableData, setTableData] = useState(teamsArray);

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem('tableData'));
		if (data) {
			const sortData = data.sort((a, b) => {
				let sort = b.points - a.points
				if (b.points === a.points) {
					sort = b.goalsDifference - a.goalsDifference
					if (b.goalsDifference === a.goalsDifference) {
						if (a.name < b.name) {
							return -1;
						}
						if (a.name > b.name) {
							return 1;
						}
					}
				}
				return sort
			});
			setTableData(sortData)
		}
	}, [])

	return (
		<div className="footballTable">
			<div>
				<div className="footballTableHeader">
					<span>England Premier League</span>
				</div>
			</div>
			<div>
				<div className="footballTableBody">
					<div className="table-container">
						<div className="table-header table-row">
								{
								COLUMNS.map((col, i) => (
									<div className={`header-cell cell ${i === 0 ? 'club-cell' : ''}`}>
										{col.Header}
									</div>
								))
							}
						</div>
						<div className="table-data">
							{
								tableData.map((club, i) => (
									<div className="table-row">
										<div className="cell club-cell">
											<div style={{width: '20px', textAlign: 'center'}}>
												{ i + 1 }
											</div>
											<div style={{padding: '5px'}}>
												<img src={club.label} width="25px" height="25px" align="middle"/>
											</div>
											{club.name}
										</div>
										<div className="cell">
											{club.games ?? 0}
										</div>
										<div className="cell">
											{club.goalsPlus ?? 0}
										</div>
										<div className="cell">
											{club.goalsMinus ?? 0}
										</div>
										<div className="cell">
											{club.goalsDifference ?? 0}
										</div>
										<div className="cell" style={{fontWeight: 'bold'}}>
											{club.points ?? 0}
										</div>
									</div>
								))
							}

						</div>
					</div>
				</div>
			</div>
		</div>
	)
}