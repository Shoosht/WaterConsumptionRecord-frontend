import Navbar from '../../Components/Navbar/navbar';
import { useEffect, useState } from 'react';
import { useRecordsContext } from '../../Hooks/useRecordContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Rectangle } from 'recharts';
import { useAuthContext } from '../../Hooks/useAuthContext';
import './homePage.css';


function HomePage() {
	const { records, dispatch } = useRecordsContext();
	const [filteredRecords, setFilteredRecords] = useState([]);
	const [years, setYears] = useState([]);
	const [selectedYear, setSelectedYear] = useState(null);
	const [open, setOpen] = useState(false);
	const [hoverInfo, setHoverInfo] = useState(null);
	const { user } = useAuthContext()

 	useEffect(() => {
		async function fetchRecords() {
			const response = await fetch('/api/records', {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			}
			);

			const json = await response.json();

			if (response.ok) {
				dispatch({ type: 'SET_RECORDS', payload: json });
				const uniqueYears = [...new Set(json.map(item => item.year))];
				setYears(uniqueYears);
				setSelectedYear(uniqueYears[uniqueYears.length - 1]);
			}
		}

		if (user) {
			fetchRecords();
		}

	}, [dispatch, user]);

	useEffect(() => {
		if (!selectedYear) return;

		const fullMonthTemplate = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, amount: 0 }));
		const filtered = records.filter(item => item.year === selectedYear);
		const fullData = fullMonthTemplate.map(monthItem =>
			filtered.find(record => record.month === monthItem.month) || monthItem
		);
		setFilteredRecords(fullData);
	}, [selectedYear, records]);

	const formatter = (value) => [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	][value - 1];

	const CustomBar = ({ x, y, width, height, index, payload }) => (
		<Rectangle
			x={x}
			y={y}
			width={width}
			height={height}
			fill={hoverInfo?.index === index ? "#224a94 " : "#2982bd"}
			onMouseOver={() => setHoverInfo({ x, y, width, height, index, payload })}
			onMouseOut={() => setHoverInfo(null)}
		/>
	);

    const handleDeleteClick = async () => {
		if (!user) {
			return
		}

        const response = await fetch('/api/records/' + hoverInfo.payload._id, {
            method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${user.token}`
			}
        })

        const json = await response.json()

        if(response.ok){
            dispatch({type: 'DELETE_RECORD', payload: json});
            setHoverInfo(null);
        }

    }

	return (
		<div>
			<Navbar />
			<div className="records">
				<div className="dropdown">
					<button className="dropdown-button" onClick={() => setOpen(prev => !prev)}>
						{selectedYear || "No options available."}
					</button>

					{open && (
						<div className="dropdown-menu">
							<ul>
								{years.map(year => (
									<li
										key={year}
										className="dropdown-item"
										onClick={() => {
											setSelectedYear(year);
											setOpen(false);
										}}
									>
										{year}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>

				<div className="barchart-h-w" style={{ position: "relative", height: "400px" }}>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={filteredRecords}>
							<XAxis
								dataKey="month"
								tickFormatter={formatter}
								interval={0}
								minTickGap={60}
								type="category"
							/>
							<YAxis dataKey="amount" />
							<Bar dataKey="amount" barSize={40}
                                  shape={props => <CustomBar {...props} />} />
						</BarChart>
					</ResponsiveContainer>

					{hoverInfo && (
						<div
							onMouseLeave={() => setHoverInfo(null)}
							style={{
								display: 'flex',
								position: 'absolute',
								left: hoverInfo.x,
								top: hoverInfo.y,
								width: hoverInfo.width,
								height: hoverInfo.height,
								justifyContent: 'space-around',
							}}
						>
							<button
								className="record-edit-button"
								style={{
									position: 'absolute',
									left: hoverInfo.width / 2 - 40,
									top: hoverInfo.height / 2 - 16,
									zIndex: 10,
									width: hoverInfo.width,
									height: '32px',
								}}
								onClick={() => console.log("editing ", hoverInfo.payload._id)}
							>
								Edit
							</button>
							<button
								className="record-delete-button"
								style={{
									marginTop: '26px',
									position: 'absolute',
									left: hoverInfo.width / 2 - 40,
									top: hoverInfo.height / 2 + 16,
									zIndex: 10,
									width: hoverInfo.width + 16,
									height: '32px',
								}}
								onClick={() => {handleDeleteClick()}}
							>
								Delete
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default HomePage;
