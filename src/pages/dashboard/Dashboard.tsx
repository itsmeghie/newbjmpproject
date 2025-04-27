import { useState, useEffect } from 'react';
import { useTokenStore } from "@/store/useTokenStore";
import { getSummary_Card, getJail } from '@/lib/queries';
import { useQuery } from "@tanstack/react-query";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, LinearScale, CategoryScale, PointElement, LineElement, Filler } from 'chart.js';
import { RxEnterFullScreen } from "react-icons/rx";
import bjmp from '../../assets/Logo/bjmp.png';
import bjmpro from '../../assets/Logo/BJMPRO.png';
import bp from '../../assets/Logo/BP.png';
import lqp from '../../assets/Logo/LQP.png';
import qcjmd from '../../assets/Logo/QCJMD.png';
import population from '../../assets/Icons/population.png';
import rate from '../../assets/Icons/rate.png';
import male from '../../assets/Icons/male.png';
import gay from '../../assets/Icons/gay.png';
import release from '../../assets/Icons/release.png';
import hospital from '../../assets/Icons/hospital.png';
import prison from '../../assets/Icons/prison.png';
import release_pdl from '../../assets/Icons/release_pdl.png'
import trans from '../../assets/Icons/trans.png'
import pdl_enter from '../../assets/Icons/pdl_entered.png'
import exited from '../../assets/Icons/exited.png'
import emergency from '../../assets/Icons/emergency.png'
import malfunction from '../../assets/Icons/malfunction.png'
import illegal from '../../assets/Icons/illegal.png'
import on_duty from '../../assets/Icons/on-duty.png'
import off_duty from '../../assets/Icons/off-duty.png'
import { Title } from './components/SummaryCards';
import { Pie } from 'react-chartjs-2';
import { IoMdRefresh } from 'react-icons/io';
import { RiShareBoxLine } from 'react-icons/ri';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NavLink } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const Dashboard = () => {
    const handle = useFullScreenHandle();
    const token = useTokenStore().token;
    const currentDate = new Date().toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" });
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { data: summarydata } = useQuery({
        queryKey: ['summary-card'],
        queryFn: () => getSummary_Card(token ?? "")
    });

    const { data: jail } = useQuery({
        queryKey: ['jail'],
        queryFn: () => getJail(token ?? "")
    });

    const exportDashboard = () => {
        const element = document.getElementById('dashboard');
    
        if (element) {
            html2canvas(element, {
                backgroundColor: '#F6F7FB',
                scale: 2 
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'pt', 'a4'); 
                const imgWidth = pdf.internal.pageSize.getWidth(); 
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
                const position = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;
    
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); 
                pdf.save('male_dashboard.pdf');
            });
        } else {
            console.error("Dashboard element not found.");
        }
    };
    
    const Card = ({title, image, count} : {title: string, image: string, count: number | string}) => {
        return (
                <div className='rounded-lg flex items-center gap-2 p-2 w-full bg-[#F6F7FB]'>
                    <div className='bg-[#D3DFF0] p-1 rounded-full'>
                        <img src={image} className='w-8' alt={title} />
                    </div>
                    <div>
                        <div className='text-[#1E365D] font-extrabold text-xl'>{count}</div>
                        <p className='text-[#121D26] text-sm'>{title}</p>
                    </div>
                </div>
        )
    }  

    const Card2 = ({title, image, count} : {title: string, image: string, count: number | string}) => {
        return (
                <div className='rounded-lg flex items-center gap-2 p-2 w-full bg-[#F6F7FB]'>
                    <div className='p-1 rounded-full'>
                        <img src={image} className='w-8' alt={title} />
                    </div>
                    <div>
                        <div className='text-[#1E365D] font-extrabold text-xl'>{count}</div>
                        <p className='text-[#121D26] text-sm'>{title}</p>
                    </div>
                </div>
        )
    }  
    
    const genderData = {
        labels: ['Male','Gay', 'Transgender'],
        datasets: [
            {
                label: 'PDL Gender',
                data: [
                summarydata?.success.pdls_based_on_gender.Active.Male || 0,
                summarydata?.success.pdls_based_on_gender.Active["LGBTQ + GAY / BISEXUAL"] || 0,
                summarydata?.success.pdls_based_on_gender.Active["LGBTQ + TRANSGENDER"] || 0,
                
                ],
                backgroundColor: ['#3471EC', '#7ED26C', '#FE319D'],
                borderColor: '#ffffff',
                borderWidth: 2,
            },
            ],
        };
        
        const Option = {
            responsive: true,
            plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    usePointStyle: true, 
                    pointStyle: 'circle', 
                    padding: 30,
                    boxWidth: 12,
                },
            },
            tooltip: {
                callbacks: {
                label: function (context: any) {
                    const label = context.label || '';
                    const value = context.parsed;
                    return `${label}: ${value}`;
                },
                },
            },
            padding: 5,
            },
            cutout: '60%',
        };

        const pdlEnteredExitData = {
            labels: ['Entered', 'Exited'],
            datasets: [
                {
                    label: 'Entry/Exits to Jail Premises of PDLs',
                    data: [
                    summarydata?.success.premises_logs.pdl_logs_today["Time In"] || 0,
                    summarydata?.success.premises_logs.pdl_logs_today["Time Out"] || 0,
                    ],
                    backgroundColor: ['#20BA22', '#', '#97A5BB'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                },
                ],
            };
        
            const visitorEnteredExitData = {
                labels: ['Entered', 'Exited'],
                datasets: [
                    {
                        label: 'Entry/Exits to Jail Premises of Visitors',
                        data: [
                        summarydata?.success.premises_logs.visitor_logs_today["Time In"] || 0,
                        summarydata?.success.premises_logs.visitor_logs_today["Time Out"] || 0,
                        ],
                        backgroundColor: ['#FE8D06', '#', '#97A5BB'],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    },
                    ],
                };

            const PersonelEnteredExitData = {
                labels: ['Entered', 'Exited'],
                datasets: [
                    {
                        label: 'Entry/Exits to Jail Premises of Visitors',
                        data: [
                        summarydata?.success.premises_logs.personnel_logs_today["Time In"] || 0,
                        summarydata?.success.premises_logs.personnel_logs_today["Time Out"] || 0,
                        ],
                        backgroundColor: ['#E73D34', '#', '#97A5BB'],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    },
                ],
            };

            const ServiceEnteredExitData = {
                labels: ['Entered', 'Exited'],
                datasets: [
                    {
                        label: 'Entry/Exits to Jail Premises of Visitors',
                        data: [
                        summarydata?.success.premises_logs.visitor_logs_today.Enter || 0,
                        summarydata?.success.premises_logs.visitor_logs_today.Exit || 0,
                        ],
                        backgroundColor: ['#1CBEDB', '#', '#97A5BB'],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    },
                ],
            };

            const NonRegisterEnteredExitData = {
                labels: ['Entered', 'Exited'],
                datasets: [
                    {
                        label: 'Entry/Exits to Jail Premises of Visitors',
                        data: [
                        summarydata?.success.premises_logs.visitor_logs_today.Enter || 0,
                        summarydata?.success.premises_logs.visitor_logs_today.Exit || 0,
                        ],
                        backgroundColor: ['#E847D8', '#', '#97A5BB'],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    },
                ],
            };
        
            const Options = {
                responsive: true,
                plugins: {
                legend: {
                    position: 'bottom' as const,
                    labels: {
                        usePointStyle: true, 
                        pointStyle: 'circle', 
                        padding: 10,
                        boxWidth: 12,
                    },
                },
                tooltip: {
                    callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: ${value}`;
                    },
                    },
                },
                padding: 10,
                },
                cutout: '60%',
            };

            {/**No Emergency Malfunction */}
            const EmergencyMalfunctionData = {
                labels: ['Emergency','Malfunction of System', 'Illegal Entry/Exit'],
                datasets: [
                    {
                        label: 'Emergency/Malfunction of System/Illegal Entry/Exit Without Registration',
                        data: [
                        0,
                        0,
                        0,
                        ],
                        backgroundColor: ['#F63554', '#F7EA39', '#1EE9E4'],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    },
                    ],
                };
            {/**No Action Taken */}
            const ActionTakenData = {
                labels: ['Action Taken Emergency','Malfunction of System', 'Illegal Entry/Exit'],
                datasets: [
                    {
                        label: 'Action Taken Emergency/Malfunction of System/Illegal Entry/Exit Without Registration',
                        data: [
                        0,
                        0,
                        0,
                        ],
                        backgroundColor: ['#843EEE', '#F7C439', '#20B1EF'],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    },
                    ],
                };

                const onOffDutyPersonnelData = {
                    labels: ['On Duty', 'Off Duty'],
                    datasets: [
                        {
                            label: 'BJMP Personnel On and Off Duty',
                            data: [
                            summarydata?.success.personnel_count_by_status.Active["On Duty"] || 0,
                            summarydata?.success.personnel_count_by_status.Active["Off Duty"] || 0,
                            ],
                            backgroundColor: ['#0D5ACF', '#', '#739EDF'],
                            borderColor: '#ffffff',
                            borderWidth: 2,
                        },
                    ],
                };
    return (
        <div>
            <div id="dashboard">
                <div className='flex justify-end'>
                <NavLink to='/jvms/dashboard2'>
                    <button className="hover:bg-gray-100 text-white px-1">.</button>
                </NavLink>
                </div>
                <FullScreen handle={handle}>
                <div className={`w-full space-y-2 ${handle.active ? "h-screen bg-[#F6F7FB] text-sm p-4" : ""}`}>
                    <div className="bg-white border flex flex-wrap items-center justify-center md:justify-between border-[#1E7CBF]/25 shadow-sm rounded-lg p-5">
                        <div className='flex flex-wrap gap-2'>
                            <img src={bjmp} className='w-16' />
                            <img src={bjmpro} className='w-16' />
                            <img src={qcjmd} className='w-16' />
                            <img src={lqp} className='w-16' />
                            <img src={bp} className='w-16' />
                        </div>
                        <div className='mb-6 md:mb-0 text-center md:text-right'>
                            <h1 className="text-4xl font-extrabold text-[#32507D]">
                                BJMP Quezon City Jail - Male Dormitory Dashboard
                            </h1>
                            <p className="text-sm">{currentDate} at {time}</p>
                        </div>
                    </div>
                    {/* 1ST ROW */}
                    <div className={`w-full flex flex-wrap lg:flex-row gap-2 ${handle.active ? "flex gap-2" : ""}`}>
                            <div className="bg-white border shadow-[#1e7cbf]/25 flex-1 flex flex-col gap-2 justify-center border-[#1E7CBF]/25 shadow-md rounded-lg w-full p-4">
                                <Card image={population} title='Jail Population' count={summarydata?.success.current_pdl_population.Active ?? 0} />
                                <Card image={rate} title='Jail Capacity' count={jail?.jail_capacity ?? 0} />
                                <Card image={release} title='Congestion Rate' count={summarydata?.success.jail_congestion_rates.total_congestion_rate === "Total capacity not set or zero" ? '0' : `${(parseFloat(summarydata?.success.jail_congestion_rates.total_congestion_rate) || 0).toFixed(2)}%`}/>
                            </div>

                            {/* Gender Distribution */}
                            <div className="bg-white border flex-[2] w-full shadow-[#1e7cbf]/25 space-y-2 border-[#1E7CBF]/25 shadow-md rounded-lg p-5">
                                <Title title="PDL Based on their Gender" />
                                <div className='flex flex-col lg:flex-row gap-2'>
                                    <div className='flex-1 bg-[#F6F7FB] w-full  lg:w-[260px] lg:h-[209px] rounded-lg'>
                                        <Pie data={genderData} options={Option}/>
                                    </div>
                                    <div className='flex-1 w-full space-y-2'>
                                        <Card2 image={male} title='Male' count={summarydata?.success.pdls_based_on_gender.Active.Male || 0} />
                                        <Card2 image={gay} title='Gay' count={summarydata?.success.pdls_based_on_gender.Active["LGBTQ + GAY / BISEXUAL"] ?? 0} />
                                        <Card2 image={trans} title='Transgender' count={summarydata?.success.pdls_based_on_gender.Active["LGBTQ + TRANSGENDER"] || 0}/>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border shadow-[#1e7cbf]/25 flex-1 flex flex-col gap-2 justify-center border-[#1E7CBF]/25 shadow-md rounded-lg w-full p-4">
                                <Card image={release_pdl} title='Released PDL' count={summarydata?.success.total_released_pdls.Active ?? 0} />
                                {/*Committed PDL */}
                                <Card2 image={prison} title='Committed PDL' count={summarydata?.success.total_pdl_by_status.Commited.Active ?? 0} />
                                <Card2 image={hospital} title='Hospitalized PDL' count={summarydata?.success.total_hospitalized_pdls.Active || 0}/>
                            </div>

                            <div className="bg-white border flex-[2] w-full shadow-[#1e7cbf]/25 space-y-2 border-[#1E7CBF]/25 shadow-md rounded-lg p-5">
                                <Title title="Entry/Exits to Jail Premises of PDLs" />
                                <div className='flex flex-col md:flex-row gap-2'>
                                        <div className='flex-1 bg-[#F6F7FB] rounded-lg w-full md:w-[200px] md:h-[190px]'>
                                            <Pie data={pdlEnteredExitData} options={Options}/>
                                        </div>
                                    <div className='flex-1 w-full space-y-2'>
                                        <Card2 image={pdl_enter} title='Entered' count={summarydata?.success.premises_logs.pdl_logs_today.Enter || 0} />
                                        <Card2 image={exited} title='Exited' count={summarydata?.success.premises_logs.pdl_logs_today.Exit ?? 0} />
                                    </div>
                                </div>
                            </div>
                    </div>

                    {/* 2ND ROW */}
                    <div className={`w-full flex flex-wrap lg:flex-row gap-2 mt-3 ${handle.active ? "flex gap-3 mt-3" : ""}`}>
                        {/* Entry/Exits to Jail Premises of Visitors */}
                        <div className="bg-white border flex-1 w-full shadow-[#1e7cbf]/25 space-y-2 border-[#1E7CBF]/25 shadow-md rounded-lg p-5">
                                <Title title="Entry/Exits to Jail Premises of Visitors" />
                                <div className='flex flex-wrap lg:flex-row gap-2'>
                                        <div className='flex-1 bg-[#F6F7FB] rounded-lg w-full lg:w-[200px] lg:h-[190px]'>
                                            <Pie data={visitorEnteredExitData} options={Options}/>
                                        </div>
                                    <div className='flex-1 w-full space-y-2'>
                                        <Card2 image={pdl_enter} title='Entered' count={summarydata?.success.premises_logs.visitor_logs_today.Enter || 0} />
                                        <Card2 image={exited} title='Exited' count={summarydata?.success.premises_logs.visitor_logs_today.Exit ?? 0} />
                                    </div>
                                </div>
                            </div>
                            {/*Entry/Exits to Jail Premises of BJMP Personnel */}
                            <div className="bg-white border flex-1 w-full shadow-[#1e7cbf]/25 space-y-2 border-[#1E7CBF]/25 shadow-md rounded-lg p-5">
                                <Title title="Entry/Exits to Jail Premises of BJMP Personnel" />
                                <div className='flex flex-wrap lg:flex-row gap-2'>
                                        <div className='flex-1 bg-[#F6F7FB] rounded-lg w-full lg:w-[200px] lg:h-[190px]'>
                                            <Pie data={PersonelEnteredExitData} options={Options}/>
                                        </div>
                                    <div className='flex-1 w-full space-y-2'>
                                        <Card2 image={pdl_enter} title='Entered' count={summarydata?.success.premises_logs.personnel_logs_today.Enter || 0} />
                                        <Card2 image={exited} title='Exited' count={summarydata?.success.premises_logs.personnel_logs_today.Exit ?? 0} />
                                    </div>
                                </div>
                            </div>

                            {/*Entry/Exits to Jail Premises of Service Provider */}
                            <div className="bg-white border flex-1 w-full shadow-[#1e7cbf]/25 space-y-2 border-[#1E7CBF]/25 shadow-md rounded-lg p-5">
                                <Title title="Entry/Exits to Jail Premises of Service Provider" />
                                <div className='flex flex-wrap lg:flex-row gap-2'>
                                        <div className='flex-1 bg-[#F6F7FB] rounded-lg w-full xl:w-[200px] xl:h-[190px]'>
                                            <Pie data={ServiceEnteredExitData} options={Options}/>
                                        </div>
                                    {/*No service Provider */}
                                    <div className='w-full space-y-2 flex-1'>
                                        <Card2 image={pdl_enter} title='Entered' count={summarydata?.success.premises_logs.pdl_logs_today.Enter || 0} />
                                        <Card2 image={exited} title='Exited' count={summarydata?.success.premises_logs.pdl_logs_today.Exit ?? 0} />
                                    </div>
                                </div>
                            </div>

                            {/*Entry/Exits to Jail Premises of Non Register Visitor  */}
                            <div className="bg-white border flex-1 w-full shadow-[#1e7cbf]/25 space-y-2 border-[#1E7CBF]/25 shadow-md rounded-lg p-5">
                                <Title title="Entry/Exits to Jail Premises of Non Register Visitor " />
                                <div className='flex flex-wrap lg:flex-row gap-2'>
                                        <div className='flex-1 bg-[#F6F7FB] rounded-lg w-full xl:w-[200px] xl:h-[190px]'>
                                            <Pie data={NonRegisterEnteredExitData} options={Options}/>
                                        </div>
                                    <div className='w-full space-y-2 flex-1'>
                                        <Card2 image={pdl_enter} title='Entered' count={summarydata?.success.premises_logs.pdl_logs_today.Enter || 0} />
                                        <Card2 image={exited} title='Exited' count={summarydata?.success.premises_logs.pdl_logs_today.Exit ?? 0} />
                                    </div>
                                </div>
                            </div>
                    </div>

                    {/*3RD ROW */}
                    <div className={`w-full flex flex-col lg:flex-row gap-2 mt-3 ${handle.active ? "flex gap-3 mt-3" : ""}`}>
                        {/*NOTE: No Emergency/Malfunction of System/Illegal Entry/Exit Without Registration */}
                        <div className="bg-white border w-full shadow-[#1e7cbf]/25 space-y-2 border-[#1E7CBF]/25 shadow-md rounded-lg p-5">
                            <Title title="Emergency/Malfunction of System/Illegal Entry/Exit Without Registration" />
                            <div className='flex flex-wrap lg:flex-row gap-2'>
                                <div className='flex-1 lg:w-1/2 px-2 bg-[#F6F7FB] rounded-lg w-full'>
                                    <Pie data={EmergencyMalfunctionData} options={Options}/>
                                </div>
                                <div className='flex-1 lg:w-1/2 w-full space-y-2'>
                                    <Card2 image={emergency} title='Emergency' count={0} />
                                    <Card2 image={malfunction} title='Malfunction of System' count={0} />
                                    <Card2 image={illegal} title='Illegal Entry/Exit' count={0}/>
                                </div>
                            </div>
                        </div>

                        {/*NOTE: No Action Taken Emergency/Malfunction of System/Illegal Entry/Exit Without Registration*/}
                        <div className="bg-white border w-full shadow-[#1e7cbf]/25 space-y-2 border-[#1E7CBF]/25 shadow-md rounded-lg p-5">
                            <Title title="Action Taken Emergency/Malfunction of System/Illegal Entry/Exit Without Registration" />
                            <div className='flex flex-wrap lg:flex-row gap-2'>
                                <div className='flex-1 lg:w-1/2 px-2 bg-[#F6F7FB] rounded-lg w-full'>
                                    <Pie data={ActionTakenData} options={Options}/>
                                </div>
                                <div className='flex-1 lg:w-1/2 w-full space-y-2'>
                                    <Card2 image={emergency} title='Action Taken Emergency' count={0} />
                                    <Card2 image={malfunction} title='Malfunction of System' count={0} />
                                    <Card2 image={illegal} title='Illegal Entry/Exit' count={0}/>
                                </div>
                            </div>
                        </div>

                        {/* BJMP Personnel On and Off Duty */}
                        <div className="bg-white border w-full shadow-[#1e7cbf]/25 space-y-2 border-[#1E7CBF]/25 shadow-md rounded-lg p-5">
                                <Title title="BJMP Personnel On and Off Duty" />
                                <div className='flex flex-wrap lg:flex-row gap-2'>
                                    <div className='flex-1 lg:w-1/2 p-2 bg-[#F6F7FB] rounded-lg w-full'>
                                        <Pie data={onOffDutyPersonnelData} options={Options}/>
                                    </div>
                                    <div className='flex-1 lg:w-1/2 w-full space-y-2'>
                                        <Card2 image={on_duty} title='Entered' count={summarydata?.success.personnel_count_by_status.Active["On Duty"] ?? 0} />
                                        <Card2 image={off_duty} title='Exited' count={summarydata?.success.personnel_count_by_status.Active["Off Duty"] ?? 0} />
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
                    

            </FullScreen>
            </div>
            
            <div className="flex justify-center md:justify-end gap-4 my-2">
            <button className='gap-2 flex text-white items-center px-6 py-1.5 bg-[#1E365D] rounded-full' onClick={exportDashboard}>
                            <RiShareBoxLine /> Export
                        </button>
                <button className='gap-2 flex text-white items-center px-6 py-1.5 bg-[#1E365D] rounded-full'>
                    <IoMdRefresh /> Reset
                </button>
                <button className="gap-2 flex text-white items-center px-4 py-2 bg-[#1E365D] rounded-lg" onClick={handle.enter}>
                    <RxEnterFullScreen className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
