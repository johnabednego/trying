import React from 'react';
import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import Video  from './pages/Video'
import Home from './pages/Home'

export default function App() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Home />}></Route>
				<Route path="/:url" element={<Video />} />
				<Route path="*" element={<div><h2>404 Page not found etc</h2></div>}/>
				</Routes>
		</Router>
	)
}
