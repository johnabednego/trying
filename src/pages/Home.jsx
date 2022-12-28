import React, { Component } from 'react';
import { Input, Button } from '@material-ui/core';
import { NavBar } from '../components/NavBar';
import "./Home.css"

class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			url: ''
		}
	}

	handleChange = (e) => this.setState({ url: e.target.value })

	join = () => {
		if (this.state.url !== "") {
			var url = this.state.url.split("/")
			window.location.href = `/${url[url.length - 1]}`
		} else {
			url = Math.random().toString(36).substring(2, 7)
			window.location.href = `/${url}`
		}
	}

	render() {
		return (
			<div className="container2">
				<NavBar />

				<div>
					<h1 className=' pt-6 text-[30px] sm:text-[45px]'>Health Direct Global (HDG)</h1>
					<p style={{ fontWeight: "200" }}>HDG provides a Video conference meeting that lets you stay in touch with all your friends.</p>
					<p style={{ fontWeight: "200" }}>Click on <span className=' text-[25px] font-semibold ' >Go</span> to start a new meeting or Enter a meeting Url to join!</p>
				</div>

				<div className='px-[5%]'>
					<div className='drop-shadow-lg w-full sm:m-auto sm:w-[30%] sm:px-0 sm:min-w-[400px] ' style={{
						background: "white", height: "auto", padding: "20px",
						textAlign: "center", marginTop: "100px"
					}}>
						<p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>Start or join a meeting</p>
						<Input placeholder="URL" onChange={e => this.handleChange(e)} />
						<Button variant="contained" onClick={this.join} style={{ margin: "20px", backgroundColor: "#5593f7", color: "white" }}>Go</Button>
					</div>
				</div>
			</div>
		)
	}
}

export default Home;