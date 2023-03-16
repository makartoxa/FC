import { Navbar, Nav } from 'rsuite';
import { NavLink } from "react-router-dom";
import './NavBar.scss'

export const CustomNavbar = ({ onSelect, activeKey, ...props }) => {
	return (
		<Navbar {...props}>
			<Nav onSelect={onSelect} activeKey={activeKey}>
				<Nav.Item eventKey="1">
					<NavLink  to='/'>
						Home
					</NavLink>
				</Nav.Item>
				<Nav.Menu title="Leagues" >
					<Nav.Item eventKey="2" >
						<NavLink to='leagues'>Create league</NavLink>
					</Nav.Item>
					<Nav.Menu title="Existing leagues">
						<Nav.Item eventKey="3">
							***
						</Nav.Item>
					</Nav.Menu>
				</Nav.Menu>
				<Nav.Menu title="Demo version" >
					<Nav.Menu title="England Premier league" >
						<Nav.Item eventKey="4">
							<NavLink to='/demo/table' className="link">Table</NavLink>
						</Nav.Item>
						<Nav.Item eventKey="5">
							<NavLink to='/demo/results' className="link">Results</NavLink>
						</Nav.Item>
					</Nav.Menu>
				</Nav.Menu>
			</Nav>
		</Navbar>
	);
};
