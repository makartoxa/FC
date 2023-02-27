
import { COLUMNS } from "../../Columns";
import { TEAMS } from "../footballResults/FootballResults";
import epl from "../logo/epl.png"

import { useEffect, useState } from "react";
import SortDownIcon from '@rsuite/icons/SortDown';
import SortUpIcon from '@rsuite/icons/SortUp';

import './FootballTable.scss'

const DEFAULT_SORT_BY = {
	column: 'points',
	direction: 'default' // 'down', 'up', 'default'
}

const sortByDefault = (a, b) => {
	let sort = b.points - a.points

	if (!sort) {
		console.log('1');
		sort = b.goalsDifference - a.goalsDifference

		if (!sort) {
			console.log('2');
			const nameA = a.fcName.toLowerCase();
			const nameB = b.fcName.toLowerCase();

			if (nameB < nameA) {
				console.log('3');
				sort = 1;
			} else if (nameB > nameA) {
				console.log('4');
				sort = -1
			} else {
				sort = 0;
			}
		}
	}

	return sort
}

//@ts-ignore
export function FootballTable() {
	const [tableData, setTableData] = useState(TEAMS);
	const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY)

	const getStorageData = () => {
		const local = localStorage.getItem('tableData');
		return local ? JSON.parse(local) : TEAMS;
	}

	useEffect(() => {
		setTableData(getStorageData().sort(sortByDefault))
	}, [])

	useEffect(() => {
		const data = getStorageData();

		const newData = [...data].sort((a, b) => {
			if (sortBy.column === 'fcName') {
				const nameA = a.fcName.toLowerCase();
				const nameB = b.fcName.toLowerCase();
				switch (sortBy.direction) {
					case 'down':
						if (nameA < nameB) {
							return -1;
						} else if (nameA > nameB) {
							return 1
						}

						return 0;
					case 'up':
						if (nameA > nameB) {
							return -1;
						} else if (nameA < nameB) {
							return 1
						}

						return 0;
					default:
						return sortByDefault(a, b);
				}
			} else {
				switch (sortBy.direction) {
					case 'down':
						return b[sortBy.column] - a[sortBy.column]
					case 'up':
						return a[sortBy.column] - b[sortBy.column]
					default:
						return sortByDefault(a, b);
				}
			}
		})
		setTableData(newData);
	}, [sortBy])

	const sortData = (column) => {
		if (sortBy.column === column) {
			switch (sortBy.direction) {
				case 'down':
					setSortBy({ ...sortBy, direction: 'up' })
					break;
				case 'up':
					setSortBy({ ...sortBy, direction: 'default' });
					break;
				case 'default':
					setSortBy({ ...sortBy, direction: 'down' });
					break;
			}
		} else {
			setSortBy({
				column,
				direction: 'down'
			})
		}
	}

	const getArrow = (column) => {
		if (column === sortBy.column) {
			switch (sortBy.direction) {
				case 'down':
					return <SortDownIcon />
				case 'up':
					return <SortUpIcon />
				case 'default':
					return null;
			}
		}
	}

	return (
		<div className="football-container">
			<div className="football-container-header">
				<img src={ epl } width="75px"/>
				<span>England Premier League</span>
			</div>
			<div className="football-container-body-scroll">
				<div className="football-container-body">
					<div className="table-header">
						{
							COLUMNS.map((col, i) => (
								<div className={`table-header__cell ${i === 0 ? 'table-header__club-cell' : ''}`}
								     key={col.key}
								     onClick={() => sortData(col.key)}>
									{col.label}
									{getArrow(col.key)}
								</div>
							))
						}
					</div>
					<div className="table-data-scroll">
						<div className="table-data">
							{
								tableData.map((club, i) => (
									<div className="table-header"
									     key={club.id}>
										<div className="table-header__club-cell">
											<div className="table-header__cell-number">
												{ i + 1 }
											</div>
											<div className="table-header__cell-label">
												<img className="table-header__cell-label-img" src={club.label} width="25px" height="25px" align="middle"/>
											</div>
											<div className="table-header__club">
												{club.fcName}
											</div>
											{/*{club.fcName.length <= 10 ? club.fcName : `${club.fcName.slice(0, 10)}...`}*/}
										</div>
										<div className="table-header__cell">
											{club.games ?? 0}
										</div>
										<div className="table-header__cell">
											{club.goalsPlus ?? 0}
										</div>
										<div className="table-header__cell">
											{club.goalsMinus ?? 0}
										</div>
										<div className="table-header__cell">
											{club.goalsDifference ?? 0}
										</div>
										<div className="table-header__cell"
										     style={{fontWeight: '600'}}>
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