import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
const axios = require("axios");

function Searching() {
	const [keyword, setKeyword] = useState("");
	const [trip, setTrip] = useState([]);
	const [showButton, setShowButton] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		window.addEventListener("scroll", () => {
			if (window.pageYOffset > 300) {
				setShowButton(true);
			} else {
				setShowButton(false);
			}
		});

		const params = new URLSearchParams(window.location.search);
		const k = params.get("keyword")
		setKeyword(k);
		search(k);
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		params.delete("keyword");
		if (keyword) {
			params.append("keyword", keyword);
		}
		navigate({
			pathname: "/trips",
			search: `?${params.toString()}`,
		});
	}, [keyword, navigate]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const search = (k) => {
		k = k == null ? "" : k;
		axios
			.get(`http://localhost:9000/trips?keyword=${k}`)
			.then((response) => {
				setTrip(response.data);
			})
			.catch((error) => {
				console.log("Error : " + error);
			});
		scrollToTop();
	};

	return (
		<div className="App">
			<header className="App-header">
				<h1 className="App-title">เที่ยวไหนดี</h1>
				<div className="Search-area">
					<input
						type="text"
						placeholder="หาที่เที่ยวแล้วไปกัน..."
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						onKeyDown={(e) => {
							if (e.key == "Enter") {
								e.preventDefault();
								search(keyword);
							}
						}}
						className="Search-bar"
					/>
					<i
						class="Clear fas fa-times"
						onClick={() => setKeyword("")}
					/>
				</div>
			</header>

			<body className="Container">
				{trip.map((e) => {
					return (
						<div className="Card">
							<div className="Card-title">
								<a href={e.url}>{e.title}</a>
							</div>
							<p className="Card-description">
								{e.description}
								{" ... "}
								<a className="Read-more" href={e.url}>
									{"อ่านต่อ"}
								</a>
							</p>
							<div className="Card-tag">
								{"หมวด : "}
								{e.tags.map((t) => (
									<span
										onClick={() => {
											setKeyword(t);
											search(t);
										}}
									>
										<u>{t}</u>{" "}
									</span>
								))}
							</div>
							<div className="row">
								{e.photos.map((p) => {
									return (
										<div className="column">
											<img
												src={p}
												style={{ height: "150px" }}
											/>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</body>
			{showButton && (
				<button onClick={scrollToTop} className="Back-to-top">
					<i class="fas fa-chevron-circle-up"></i>
				</button>
			)}
		</div>
	);
}

export default Searching;
