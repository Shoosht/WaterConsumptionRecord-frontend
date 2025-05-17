import Navbar from '../../Components/Navbar/navbar';
import { useEffect, useState } from 'react';
import { useRecordsContext } from '../../Hooks/useRecordContext';
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Rectangle
} from 'recharts';
import './homePage.css';

function HomePage() {
    const {records, dispatch} = useRecordsContext()
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [open, setOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            const response = await fetch('/api/records');
            const json = await response.json();

            if (response.ok) {
                dispatch({type: 'SET_RECORDS', payload: json})
                const uniqueYears = [...new Set(json.map((item) => item.year))];
                setYears(uniqueYears);
                setSelectedYear(uniqueYears[uniqueYears.length - 1]);
            }
        };

        fetchRecords();
    }, [dispatch]);

    useEffect(() => {
        if (selectedYear) {
            const filtered = records.filter((item) => item.year === selectedYear);
            setFilteredRecords(filtered);
        }
    }, [selectedYear, records]);

    const formatter = (value) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[Number(value) - 1];
    };

    const toggleMenu = () => {
        setOpen((prev) => !prev);
    };

    const handleSelectYear = (year) => {
        setSelectedYear(year);
        setOpen(false);
    };

   
    const CustomBar = (props) => {
        const { x, y, width, height, index, payload } = props;
        const isHovered = index === hoveredIndex;

        const handleBarClick = () => {
            console.log("clicked bar ", payload._id)
        }

        return (
            <Rectangle
                x={x}
                y={y}
                width={width}
                height={height}
                fill={isHovered ? "#ffa500" : "#8884d8"}
                stroke={isHovered ? "#ff6600" : "none"}
                onMouseOver={() => setHoveredIndex(index)}
                onMouseOut={() => setHoveredIndex(null)}
                onClick={handleBarClick}
            />
        );
    };

    return (
        <div>
            <Navbar />
            <div className="records">
                <div className="dropdown">
                    <button className="dropdown-button" onClick={toggleMenu}>
                        {selectedYear || "No options available."}
                    </button>

                    {open && (
                        <div className="dropdown-menu">
                            <ul>
                                {years.map((year) => (
                                    <li
                                        key={year}
                                        className="dropdown-item"
                                        onClick={() => handleSelectYear(year)}
                                    >
                                        {year}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="barchart-h-w">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredRecords}>
                            <XAxis dataKey="month" tickFormatter={formatter} />
                            <YAxis dataKey="amount" />
                            <Bar
                                dataKey="amount"
                                shape={(props) => <CustomBar {...props} />}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default HomePage;