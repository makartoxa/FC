import React, {useState} from 'react';

import './Page404.scss'

export const Page404 = () => {
	const [show, setShow] = useState(false)

	setTimeout(() => {
		setShow(true);
	}, 300)

	return (
		<>
			{ show &&
				<div className="page404">
					<h2>404</h2>
					<h1>Page Not Found</h1>
					<p>The specified file was not found on this website. Please check the URL for mistakes and try again.</p>
				</div>
			}
		</>
	);
};

