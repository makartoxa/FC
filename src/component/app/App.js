import { AppHeader } from "../appHeader/AppHeader";
import { Home } from "../home/Home"
import { FootballDemo } from "../footballDemo/FootballDemo"
import { CreateLeague } from "../addTeams/CreateLeague";
import { FootballTable } from "../footballTable/FootballTable";
import { FootballResults } from "../footballResults/FootballResults";
import { Routes, Route, Navigate } from "react-router-dom";

import './app.scss'

export const App = () => {
	return (
		<div className="font-img">
			<AppHeader/>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path="leagues" element={<CreateLeague />} />
					<Route path="demo" element={<FootballDemo />} >
						<Route index element={<FootballTable />} />
						<Route path="/demo/table" element={<FootballTable />} />
						<Route path="/demo/results" element={<FootballResults />} />
					</Route>
				</Routes>
		</div>
	)
}
