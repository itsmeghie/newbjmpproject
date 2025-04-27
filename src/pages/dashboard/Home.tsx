import { getSummary_Card } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, LinearScale, CategoryScale, PointElement, LineElement, Filler } from 'chart.js';
import {  Bar, Line } from 'react-chartjs-2';
import { useQuery } from "@tanstack/react-query";
import { Title } from "./components/SummaryCards"; 
import { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { NavLink } from "react-router-dom";
import { RxEnterFullScreen } from "react-icons/rx";
import ChartCard from "./components/ChartCard";
import { PiPrinterFill } from "react-icons/pi";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const Home = () => {
    const handle = useFullScreenHandle();
    const token = useTokenStore().token;
    const currentDate = new Date().toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" });
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [logType, setLogType] = useState<'daily' | 'monthly'>('daily');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const todayMonth = new Date().toISOString().slice(0, 7);
    const [startMonth, setStartMonth] = useState<string>(todayMonth);
    const [endMonth, setEndMonth] = useState<string>(todayMonth);


    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { data: summarydata } = useQuery({
        queryKey: ['summary-card'],
        queryFn: () => getSummary_Card(token ?? "")
    });

    const premisesLogs = summarydata?.success?.premises_logs;
    const rawDailyLogs = premisesLogs?.daily_logs ?? {};
    const rawMonthlyLogs = premisesLogs?.monthly_logs ?? {};

    const extractChartData = (logs: any = {}) => {
        const pdl = logs?.pdl_logs || {};
        const visitor = logs?.visitor_logs || {};
        const personnel = logs?.personnel_logs || {};

        return [
            { type: "Time In", PDL: pdl["Time In"] ?? 0, Visitor: visitor["Time In"] ?? 0, Personnel: personnel["Time In"] ?? 0 },
            { type: "Time Out", PDL: pdl["Time Out"] ?? 0, Visitor: visitor["Time Out"] ?? 0, Personnel: personnel["Time Out"] ?? 0 },
        ];
    };

    const mergeLogs = (monthlyLogs: any, start: string, end: string) => {
        type LogType = "pdl_logs" | "visitor_logs" | "personnel_logs";
        type FieldType = "Time In" | "Time Out";

        const initialData: Record<LogType, Record<FieldType, number>> = {
            pdl_logs: { "Time In": 0, "Time Out": 0, },
            visitor_logs: { "Time In": 0, "Time Out": 0, },
            personnel_logs: { "Time In": 0, "Time Out": 0, }
        };

        const result: Record<LogType, Record<FieldType, number>> = JSON.parse(JSON.stringify(initialData));

        const months = Object.keys(monthlyLogs || {}).filter(month => month >= start && month <= end);

        months.forEach(month => {
            const log = monthlyLogs[month];
            (["pdl_logs", "visitor_logs", "personnel_logs"] as LogType[]).forEach(type => {
                (["Time In", "Time Out"] as FieldType[]).forEach(field => {
                    result[type][field] += log?.[type]?.[field] ?? 0;
                });
            });
        });

        return result;
    };

    const dailyLogs = logType === 'daily' ? rawDailyLogs[selectedDate] : {};
    const monthlyLogs = logType === 'monthly' ? mergeLogs(rawMonthlyLogs, startMonth, endMonth) : {};

    const chartData = logType === 'daily'
        ? extractChartData(dailyLogs)
        : extractChartData(monthlyLogs);

    const totalCapacity = summarydata?.success.total_capacity || 1; 
    const committedPercentage = ((summarydata?.success.current_pdl_population.Active || 0) / totalCapacity) * 100;

    const colors = [
        '#44568F', '#71A0D4', '#7EBDC2', '#F2D388', '#C98474',
        '#874C62', '#DB5461', '#686D76', '#1A1A40', '#D72323',
        '#3F72AF', '#F9F7F7', '#112D4E', '#A1C6EA', '#C4E0F9',
        '#F67280', '#355C7D', '#6C5B7B', '#C06C84'
    ];

    const activeStatus = summarydata?.success.personnel_count_by_status.Active || 0;
    const rankData = summarydata?.success.personnel_count_by_rank.Active || 0;
    const dutyLabels = Object.keys(activeStatus); 
    const dutyData = dutyLabels.map(label => activeStatus[label]);

    const backgroundColors = dutyLabels.map((_, i) => colors[i % colors.length]);

    const rankLabels = Object.keys(rankData);
    const rankValues = rankLabels.map(rank => rankData[rank]);

    const typeData = summarydata?.success.personnel_count_by_type?.Active || {};

const typeLabels = Object.keys(typeData);
const typeValues = typeLabels.map(type => typeData[type]);

    
    const getCongestionColor = (rate:any) => {
        if (rate >= 100) return 'bg-red-500';
        if (rate >= 80) return 'bg-orange-500';
        if (rate >= 60) return 'bg-yellow-500';
        if (rate >= 40) return 'bg-yellowgreen-500';
        return 'bg-green-500';
        };

        const genderData = {
            labels: ['Male', 'Female', 'LGBTQ+'],
            datasets: [{
                label: 'PDL Gender',
                data: [
                    summarydata?.success.pdls_based_on_gender.Active.Male || 0,
                    summarydata?.success.pdls_based_on_gender.Active.Female || 0,
                    (summarydata?.success.pdls_based_on_gender.Active["LGBTQ + TRANSGENDER"] || 0) +
                    (summarydata?.success.pdls_based_on_gender.Active["LGBTQ + GAY / BISEXUAL"] || 0) +
                    (summarydata?.success.pdls_based_on_gender.Active["LGBTQ + LESBIAN / BISEXUAL"] || 0),
                ],
                backgroundColor: ['#4A90E2', '#E94E77', '#F6BB42'],
                borderColor: '#fff',
                borderWidth: 1,
                barThickness: 50,
                maxBarThickness: 50,
            }],
        };

        const lineData = {
            labels: ['January', 'February', 'March', 'April'],
            datasets: [{
                label: 'Hospitalized PDL',
                data: [summarydata?.success.total_hospitalized_pdls.Active || 0],
                backgroundColor: '#675095',
                fill: true,
            }],
        };

        const serviceProviderData = {
            labels: ['January', 'February', 'March', 'April'],
            datasets: [
                {
                    label: 'Entered Service Provider',
                    data: [
                        summarydata?.success.premises_logs.pdl_logs_today["Time In"] || 0,
                    ],
                    backgroundColor: '#C98474',
                    yAxisID: 'y5',
                    fill: true,
                },
                {
                    label: 'Exited Service Provider',
                    data: [
                        summarydata?.success.premises_logs.pdl_logs_today["Time Out"] || 0,
                    ],
                    backgroundColor: '#44568F',
                    yAxisID: 'y6',
                    fill: true,
                }
            ],
        };

        const PersonnelTypeData = {
            labels: typeLabels,
            datasets: [{
                label: 'Personnel Type',
                data: typeValues,
                backgroundColor: backgroundColors,
                fill: true,
            }],
            };
    
            const PersonnelRankData = {
            labels: rankLabels,
            datasets: [{
                label: 'Personnel Rank',
                data: rankValues,
                backgroundColor: backgroundColors,
                fill: true,
            }],
        };
    
        const piedata = {
            labels: ['PDL', 'Visitor', 'Personnel'],
            datasets: [
                {   
                    data: [
                        summarydata?.success.person_count_by_status.PDL.Active || 0,
                        summarydata?.success.person_count_by_status.Visitor.Active || 0,
                        summarydata?.success.person_count_by_status.Personnel.Active || 0 ,
                    ],
                    backgroundColor: ['#675095', '#077ABA', '#D47920'],
                },
            ],
        };
    
        const PersonnelDutyData = {
            labels: dutyLabels,
            datasets: [{
                label: 'BJMP Active Personnel Status',
                data: dutyData,
                backgroundColor: backgroundColors,
                fill: true,
            }],
        };

        {/*No Api for total incidents */}
        const incidentData = {
            labels: [
                "Emergency / Malfunction of System",
                "Illegal Entry/Exit (No Registration)"
                ],
                datasets: [
                {
                    label: "Total Incidents",
                    data: [
                    0,
                    0
                    ],
                    backgroundColor: ["#F59E0B", "#EF4444"],
                    borderColor: "#ffffff",
                    borderWidth: 1,
                    barThickness: 50,
                    maxBarThickness: 50,
                },
                ],
            };

            {/* No Emergency Malfunction */}
            const actionData = {
                labels: ["Resolved", "Pending"],
                datasets: [
                    {
                        label: "Emergency / Malfunction",
                        data: [
                        0,
                        0,
                        ],
                        backgroundColor: ["#10B981", "#FBBF24"],
                        barThickness: 50,
                        borderColor: '#fff',
                        borderWidth: 1,
                        maxBarThickness: 50,
                    },
                    {
                        label: "Illegal Entry/Exit",
                        data: [
                        0,
                        0,
                        ],
                        backgroundColor: ["#3B82F6", "#F87171"],
                        barThickness: 50,
                        borderColor: '#fff',
                        borderWidth: 1,
                        maxBarThickness: 50,
                    },
                    ],
                };
    

    return (
        <div className="bg-white">
            <FullScreen handle={handle}>
                <div className={`w-full space-y-5 bg-white ${handle.active ? "h-screen text-sm overflow-auto px-10 pt-5" : ""}`}>
                    <div className="flex flex-wrap justify-between">
                        <div className='mb-6 md:mb-0 text-center md:text-left'>
                            <h1 className="text-2xl font-bold text-gray-700">
                                BJMP Quezon City Jail Dashboard
                            </h1>
                            <p className="text-xs">{currentDate} at {time}</p>
                        </div>
                        <div className="flex flex-col justify-center md:flex-row gap-5 items-center">
                            {!handle.active && ( 
                            <div className="w-full">
                                <input
                                    type="Search"
                                    placeholder="Search Anything.."
                                    className="bg-white w-full md:w-[23.5rem] text-gray-500 py-2 px-3 border border-gray-200 outline-none"
                                />
                            </div>
                            )}
                            <div className={`md:flex hidden ${handle.active ? "hidden" : ""}`}>
                                <NavLink to='/jvms/dashboard2'>
                                    <button className="bg-gray-500 text-white px-6 py-2 ">Dashboard</button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white border border-gray-200 p-4 transition-transform transform hover:scale-105">
                            <h2 className="text-sm font-semibold text-gray-500">Jail Population</h2>
                            <div className="flex justify-between mt-2">
                                <p className="text-2xl font-bold text-gray-700">{summarydata?.success.current_pdl_population.Active ?? 0}</p>
                                <div className={`flex place-items-center text-xs font-medium rounded-full px-6 ${
                                    committedPercentage >= 100 ? 'bg-red-500' :
                                    committedPercentage >= 80 ? 'bg-orange-500' :
                                    committedPercentage >= 60 ? 'bg-yellow-500' :
                                    committedPercentage >= 40 ? 'bg-yellowgreen-500' :
                                    'bg-green-500'
                                }`}>
                                    {committedPercentage.toFixed(2)}%
                                </div>
                            </div>
                            
                        </div>
                        <div className="bg-white border border-gray-200 p-4 transition-transform transform hover:scale-105">
                            <h2 className="text-sm font-semibold text-gray-500">Congestion Rate</h2>
                            <div className="flex justify-between mt-2">
                                <p className="text-2xl font-bold text-gray-700">
                                    {summarydata?.success.jail_congestion_rates.total_congestion_rate === "Total capacity not set or zero" ? '0' 
                                        : `${(parseFloat(summarydata?.success.jail_congestion_rates.total_congestion_rate) || 0).toFixed(2)}%`}
                                </p>
                                <div className={`flex place-items-center text-xs font-medium rounded-full px-6 ${getCongestionColor(parseFloat(summarydata?.success.jail_congestion_rates.total_congestion_rate))}`}>
                                {summarydata?.success.jail_congestion_rates.total_congestion_rate === "Total capacity not set or zero" ? '0%' : `${(parseFloat(summarydata?.success.jail_congestion_rates.total_congestion_rate) || 0).toFixed(2)}%`}</div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 transition-transform transform hover:scale-105">
                            <h2 className="text-sm font-semibold text-gray-500">Released PDL</h2>
                            <div className="flex justify-between mt-2">
                                <p className="text-2xl font-bold text-gray-700">{summarydata?.success.total_released_pdls.Active ?? 0}</p>
                                <div className="bg-gray-100 flex place-items-center text-xs font-medium rounded-full px-6">0%</div>
                            </div>
                            
                        </div>
                        <div className="bg-white border border-gray-200 p-4 transition-transform transform hover:scale-105">
                            <h2 className="text-sm font-semibold text-gray-500">Committed PDL</h2>
                            <div className="flex justify-between mt-2">
                                <p className="text-2xl font-bold text-gray-700">
                                    {summarydata?.success.current_pdl_population.Active ?? 0}
                                </p>
                                <div className={`flex place-items-center text-xs font-medium rounded-full px-6 ${
                                    committedPercentage >= 100 ? 'bg-red-500' :
                                    committedPercentage >= 80 ? 'bg-orange-500' :
                                    committedPercentage >= 60 ? 'bg-yellow-500' :
                                    committedPercentage >= 40 ? 'bg-yellowgreen-500' :
                                    'bg-green-500'
                                }`}>
                                    {committedPercentage.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`w-full ${handle.active ? "flex gap-5" : ""}`}>
                        <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="Gender Distribution" />
                                <Bar data={genderData} />
                            </div>
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="Hospitalized PDL" />
                                <Line data={lineData} options={{ responsive: true }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="Entered & Exited PDL/Visitor/Personnel" />
                                <div className={`flex justify-between mt-2 items-center ${handle.active ? "hidden" : ""}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label className="text-sm font-medium text-[#32507D]">Log Type:</label>
                                        <select
                                            className="border px-2 py-1 rounded text-sm"
                                            value={logType}
                                            onChange={(e) => setLogType(e.target.value as 'daily' | 'monthly')}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    {logType === 'daily' ? (
                                        <div className="flex items-center gap-3">
                                            <label className="text-sm font-medium text-[#32507D]">Select Date:</label>
                                            <input
                                                type="date"
                                                className="border px-2 py-1 rounded text-sm"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <label className="text-sm font-medium text-[#32507D]">Start Month:</label>
                                            <input
                                                type="month"
                                                className="border px-2 py-1 rounded text-sm"
                                                value={startMonth}
                                                onChange={(e) => setStartMonth(e.target.value)}
                                            />
                                            <label className="text-sm font-medium text-[#32507D]">End Month:</label>
                                            <input
                                                type="month"
                                                className="border px-2 py-1 rounded text-sm"
                                                value={endMonth}
                                                onChange={(e) => setEndMonth(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <ChartCard
                                        title={
                                            logType === 'daily'
                                                ? `Daily Log Overview (${selectedDate})`
                                                : `Monthly Log Overview (${startMonth} to ${endMonth})`
                                        }
                                        data={chartData}
                                    />
                                </div>
                                
                            </div>
                            
                         {/* Note: No Service Provider */}
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="Entered/Exited Service Provider" />
                                <Line data={serviceProviderData} />
                            </div>
                            
                        </div>
                    </div>
                    <div className={`w-full ${handle.active ? "flex gap-5" : ""}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 mb-6">
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="Personnel Type" />
                                <Line data={PersonnelTypeData} options={{ responsive: true }}/>
                            </div>
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="Individuals/Intities Status" />
                                <Line data={piedata}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 mb-6">
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="Personnel Rank" />
                                <Line data={PersonnelRankData} options={{ responsive: true }}/>
                            </div>
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="BJMP Personnel Status" />
                                <Line data={PersonnelDutyData}/>
                            </div>
                        </div>
                        </div>
                        <div className={`w-full ${handle.active ? "flex gap-5" : ""}`}>
                        {/* Note: No Incident/ Emergency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 mb-6">
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="Emergency/Malfunction of System/Illegal Entry/Exit Without Registration" />
                                <Bar data={incidentData} options={{ responsive: true }} />
                            </div>
                            <div className="bg-white border border-gray-200 w-full p-4">
                                <Title title="Action Taken Emergency/Malfunction of System/Illegal Entry/Exit Without Registration" />
                                <Bar data={actionData} options={{ responsive: true }} />
                            </div>
                        </div>
                    </div>
                </div>
            </FullScreen>
            <div className="flex justify-end gap-4 my-2">
                <div className="flex bottom-0 gap-5 float-right">
                    <button className="gap-2 flex text-white items-center px-6 py-2 bg-slate-600"><PiPrinterFill className="text-xl" /> Print</button>
                    <button className="gap-2 flex text-white items-center px-6 py-2 bg-slate-600" onClick={handle.enter}>
                        <RxEnterFullScreen className="text-xl" /> View
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home
