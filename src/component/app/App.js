import { AppHeader } from "../appHeader/AppHeader";
import { FootballTable } from "../footballTable/FootballTable";
import { FootballResults } from "../footballResults/FootballResults";
import { Routes, Route } from "react-router-dom";

import './app.scss'

export const App = () => {
	return (
		<div className="font-img">
			<AppHeader/>
				<Routes>
					<Route path='/' element={<FootballTable />} />

					<Route path='/results' element={<FootballResults />} />
				</Routes>
		</div>
	)
}
