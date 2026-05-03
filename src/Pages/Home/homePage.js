import Navbar from '../../Components/Navbar/navbar';
import Footer from '../../Components/Footer/footer';
import { useEffect, useState } from 'react';
import { useRecordsContext } from '../../Hooks/useRecordContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Rectangle, CartesianGrid, Tooltip } from 'recharts';
import { useAuthContext } from '../../Hooks/useAuthContext';
import './homePage.css';


function HomePage() {
	const { records, dispatch } = useRecordsContext();
	const [filteredRecords, setFilteredRecords] = useState([]);
	const [years, setYears] = useState([]);
	const [selectedYear, setSelectedYear] = useState(null);
	const [open, setOpen] = useState(false);
	const { user, isGuest } = useAuthContext();
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	const [stats, setStats] = useState({
		totalConsumption: 0,
		averagePerMonth: 0,
		highestMonth: null,
		lowestMonth: null,
		comparisonPercent: 0,
		comparisonType: 'same'
	});

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		async function fetchRecords() {
			const response = await fetch('/api/records', {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});

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

		if (isGuest) {
			const guestRecords = JSON.parse(localStorage.getItem('guestRecords'));
			if (guestRecords) {
				dispatch({ type: 'SET_RECORDS', payload: guestRecords });
				const uniqueYears = [...new Set(guestRecords.map(item => item.year))];
				setYears(uniqueYears);
				setSelectedYear(uniqueYears[uniqueYears.length - 1]);
			}
			return;
		}

	}, [dispatch, user, isGuest]);

	useEffect(() => {
		if (!selectedYear) return;

		const fullMonthTemplate = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, amount: 0 }));
		const filtered = records.filter(item => item.year === selectedYear);
		const fullData = fullMonthTemplate.map(monthItem =>
			filtered.find(record => record.month === monthItem.month) || monthItem
		);
		setFilteredRecords(fullData);

		const recordsWithData = filtered.filter(r => r.amount > 0);
		const total = recordsWithData.reduce((sum, r) => sum + r.amount, 0);
		const average = recordsWithData.length > 0 ? total / recordsWithData.length : 0;
		
		const highest = recordsWithData.length > 0 
			? recordsWithData.reduce((max, r) => r.amount > max.amount ? r : max)
			: null;
		
		const lowest = recordsWithData.length > 0
			? recordsWithData.reduce((min, r) => r.amount < min.amount ? r : min)
			: null;

		const previousYear = selectedYear - 1;
		const previousYearRecords = records.filter(item => item.year === previousYear);
		const previousYearTotal = previousYearRecords.reduce((sum, r) => sum + r.amount, 0);
		
		let comparison = 0;
		let compType = 'same';
		if (previousYearTotal > 0 && total > 0) {
			comparison = ((total - previousYearTotal) / previousYearTotal) * 100;
			compType = comparison > 0 ? 'more' : comparison < 0 ? 'less' : 'same';
		}

		setStats({
			totalConsumption: total,
			averagePerMonth: average,
			highestMonth: highest,
			lowestMonth: lowest,
			comparisonPercent: Math.abs(comparison),
			comparisonType: compType
		});

	}, [selectedYear, records]);

	const formatter = (value) => [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	][value - 1];

	const formatterMobile = (value) => {
		const months = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
		const fullMonth = months[value - 1];
		return isMobile ? fullMonth.substring(0, 2) : fullMonth;
	};

	const CustomBar = (props) => (
		<Rectangle
			{...props}
			fill="#2982bd"
			radius={[8, 8, 0, 0]}
		/>
	);

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const fullMonths = [
				"January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
			];
			return (
				<div className="custom-tooltip">
					<p className="tooltip-label">{fullMonths[payload[0].payload.month - 1]}</p>
					<p className="tooltip-value">{payload[0].value} m³</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="home-main">
			<Navbar />
			<div className="records">
				
				<div className="home-left">
					<div className="home-title">Statistics</div>
					
					<div className="stats-container">
						<div className="stat-card">
							<div className="stat-label">This Year</div>
							<div className="stat-value">{stats.totalConsumption.toFixed(1)} m³</div>
						</div>

						<div className="stat-card">
							<div className="stat-label">Total Consumption</div>
							<div className="stat-value">{records ? records.reduce((sum, r) => sum + r.amount, 0).toFixed(1) : '0.0'} m³</div>
						</div>

						<div className="stat-card">
							<div className="stat-label">Average per Month</div>
							<div className="stat-value">{stats.averagePerMonth.toFixed(1)} m³</div>
						</div>

						<div className="stat-card">
							<div className="stat-label">Highest Month</div>
							<div className="stat-value">
								{stats.highestMonth 
									? `${formatter(stats.highestMonth.month)} (${stats.highestMonth.amount} m³)`
									: 'N/A'
								}
							</div>
						</div>

						<div className="stat-card">
							<div className="stat-label">Lowest Month</div>
							<div className="stat-value">
								{stats.lowestMonth 
									? `${formatter(stats.lowestMonth.month)} (${stats.lowestMonth.amount} m³)`
									: 'N/A'
								}
							</div>
						</div>

						{stats.comparisonType !== 'same' && (
							<div className={`stat-card comparison ${stats.comparisonType}`}>
								<div className="stat-label">vs Last Year</div>
								<div className="stat-value">
									{stats.comparisonPercent.toFixed(1)}% {stats.comparisonType}
								</div>
							</div>
						)}

						<div className="stat-card insights">
							<div className="stat-label">💡 Quick Insights</div>
							<div className="insights-content">
								{stats.comparisonType === 'less' && (
									<p>You're using {stats.comparisonPercent.toFixed(1)}% less water than last year.</p>
								)}
								{stats.comparisonType === 'more' && (
									<p>Your consumption increased by {stats.comparisonPercent.toFixed(1)}%. Consider ways to reduce usage.</p>
								)}
								{stats.highestMonth && stats.lowestMonth && stats.highestMonth.month !== stats.lowestMonth.month && (
									<p>Peak usage was in {formatter(stats.highestMonth.month)}. Lowest in {formatter(stats.lowestMonth.month)}.</p>
								)}
								{stats.averagePerMonth > 0 && (
									<p>Your average monthly consumption is {stats.averagePerMonth.toFixed(1)} m³.</p>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="home-right">

					<div className="graph-header">
						<div className="sort-label">Sort by year:</div>
						<div className="dropdown">
							<button className="dropdown-button" onClick={() => setOpen(prev => !prev)}>
								{selectedYear || "No options available."}
								<span className="dropdown-arrow">{open ? '▲' : '▼'}</span>
							</button>

							{open && (
								<div className="dropdown-menu">
									<ul>
										{years.map(year => (
											<li
												key={year}
												className={`dropdown-item ${year === selectedYear ? 'active' : ''}`}
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
					</div>

					<div className="barchart-h-w">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart 
								data={filteredRecords}
								margin={isMobile ? { top: 20, right: 30, left: 0, bottom: 5 } : { top: 20, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
								<XAxis
									dataKey="month"
									tickFormatter={formatterMobile}
									interval={0}
									minTickGap={60}
									type="category"
									tick={{ fill: '#3f3f3f', fontSize: 14, fontFamily: 'Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif' }}
									axisLine={{ stroke: '#ccc' }}
								/>
								<YAxis 
									dataKey="amount"
									tick={{ fill: '#3f3f3f', fontSize: 14, fontFamily: 'Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif' }}
									axisLine={{ stroke: '#ccc' }}
									label={{ value: 'm³', angle: -90, position: 'insideLeft', fill: '#3f3f3f', fontSize: 14, fontFamily: 'Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif' }}
								/>
								<Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(41, 130, 189, 0.1)' }} />
								<Bar 
									dataKey="amount" 
									barSize={40}
									shape={<CustomBar />}
									animationDuration={800}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>

					<div className="monthly-breakdown">
						<div className="breakdown-title">Monthly Breakdown</div>
						<div className="breakdown-table">
							<div className="breakdown-header">
								<div className="breakdown-col">Month</div>
								<div className="breakdown-col">Consumption</div>
								<div className="breakdown-col">Status</div>
							</div>
							{filteredRecords.filter(r => r.amount > 0).map((record) => (
								<div key={record.month} className="breakdown-row">
									<div className="breakdown-col">{formatter(record.month)}</div>
									<div className="breakdown-col">{record.amount} m³</div>
									<div className="breakdown-col">
										{record.amount > stats.averagePerMonth ? (
											<span className="status-high">Above Avg</span>
										) : record.amount < stats.averagePerMonth ? (
											<span className="status-low">Below Avg</span>
										) : (
											<span className="status-normal">Average</span>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default HomePage;