import registration from '../../assets/registration.png'
import administration from '../../assets/administration.png'
import alpha from '../../assets/Alpha.png'
import log from '../../assets/Log.png'
import scanner from '../../assets/scanner.png'
import statistic from '../../assets/Statistic.png'
import status from '../../assets/Status.png'
import database from '../../assets/Database.png'
import location from '../../assets/location.png'
import threat from '../../assets/threat.png'
import incident from '../../assets/incident.png'
import users from '../../assets/Users.png'
import support from '../../assets/support.png'
import setting from '../../assets/settings.png'
import cctv from '../../assets/cctv.png'
import cctv_database from '../../assets/cctv-database.png'
import { NavLink } from 'react-router-dom'

type CardTypes = {
    title: string;
    image?: string;
    link: string;
}
const Cards = ({title, image, link}: CardTypes) => {
    const isDisabled = link === '';

    return (
        <div>
                <div className={`min-w-32 w-48 flex-1 h-[10rem] rounded-[10px] text-[#272727] text-center shadow-lg border border-gray-200 transition-all ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white/25 hover:scale-105 ease-in-out'}`}>
                    <div className="flex flex-col items-center justify-center py-5 px-4 gap-2">
                        {isDisabled ? (
                        <div className='flex items-center justify-center flex-col'>
                            <img src={image} alt={title} className="opacity-50" />
                            <h1 className="font-semibold text-gray-500">{title}</h1>
                        </div>
                        ) : (
                        <NavLink to={link} className="flex flex-col items-center justify-center gap-2">
                            <img src={image} alt={title} />
                            <h1 className="font-semibold">{title}</h1>
                        </NavLink>
                        )}
                    </div>
                </div>
            
        </div>
    )
}
const Incidentcard = ({title, image, link}: CardTypes) => {
    const isDisabled = link === '';

    return (
        <div>
                <div className={`min-w-32 w-48 flex-1 h-[10rem] rounded-[10px] text-[#272727] text-center shadow-lg border border-gray-200 transition-all ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white/25 hover:scale-105 ease-in-out'}`}>
                    <div className="flex flex-col items-center justify-center pt-8 px-4 gap-2">
                        {isDisabled ? (
                        <div className='flex items-center justify-center flex-col'>
                            <img src={image} alt={title} className="opacity-50" />
                            <h1 className="font-semibold text-gray-500">{title}</h1>
                        </div>
                        ) : (
                        <NavLink to={link} className="flex flex-col items-center justify-center gap-2">
                            <img src={image} alt={title} />
                            <h1 className="font-semibold">{title}</h1>
                        </NavLink>
                        )}
                    </div>
                </div>
            
        </div>
    )
}

const Home1 = () => {
    return (
        <div className="flex flex-wrap gap-20 justify-center xl:mx-52">
            <Cards link='/jvms/registration' title="Registration" image={registration} />
            <Cards link='/jvms/users' title="Administration" image={administration} />
            <Cards link='/jvms/dashboard' title='Statistic Dashboard' image={statistic} />
            <Cards link='/jvms/alpha-list' title='Alpha List' image={alpha} />
            <Cards link='/jvms/log-monitoring' title='Log Monitoring' image={log} />
            <Cards link='/jvms/reports' title='Status Reports' image={status} />
            <Cards link='/jvms/screening' title='Scanner' image={scanner} />
            <Cards link='/jvms/database' title='Databases' image={database} />
            <Cards link='' title='CCTV Monitor' image={cctv}/>
            <Cards link='' title='CCTV Database' image={cctv_database} />
            <Cards link='/jvms/map' title='Location Access' image={location}/>
            <Cards link='/jvms/threats' title='Threats' image={threat} />
            <Incidentcard link='/jvms/incidents' title='Incidents' image={incident}/>
            <Cards link='/jvms/users' title='Users' image={users} />
            <Cards link='/jvms/supports' title='Support' image={support} />
            <Cards link='/jvms/settings' title='Settings' image={setting} />
        </div>
    )
}

export default Home1
