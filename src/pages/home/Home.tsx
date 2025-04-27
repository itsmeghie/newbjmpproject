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
    return (
        <div>
            
                <div className="min-w-32 w-48 flex-1 h-[10rem] bg-white/25 rounded-[10px] text-[#272727] text-center transition-all hover:scale-105 ease-in-out shadow-lg border border-gray-200">
                    <div className="flex flex-col items-center justify-center py-5 px-4 gap-2">
                        <NavLink to={link}>
                            <img src={image} alt={title} />
                        </NavLink>
                        <h1 className="font-semibold">{title}</h1>
                    </div>
                </div>
            
        </div>
    )
}

const Home1 = () => {
    return (
        <div className="flex flex-wrap gap-20 justify-center xl:mx-52">
            <Cards link='/jvms/registration' title="Registration" image={registration} />
            <Cards link='' title="Administration" image={administration} />
            <Cards link='' title='Statistic Dashboard' image={statistic} />
            <Cards link='' title='Alpha List' image={alpha} />
            <Cards link='/jvms/log-monitoring' title='Log Monitoring' image={log} />
            <Cards link='/jvms/reports' title='Status Reports' image={status} />
            <Cards link='' title='Scanner' image={scanner} />
            <Cards link='/jvms/database' title='Databases' image={database} />
            <Cards link='' title='CCTV Monitor' image={cctv}/>
            <Cards link='' title='CCTV Database' image={cctv_database} />
            <Cards link='' title='Location Access' image={location}/>
            <Cards link='/jvms/threats' title='Threats' image={threat} />
            <Cards link='/jvms/incidents' title='Incidents' image={incident}/>
            <Cards link='/jvms/users' title='Users' image={users} />
            <Cards link='/jvms/supports' title='Support' image={support} />
            <Cards link='/jvms/settings' title='Settings' image={setting} />
        </div>
    )
}

export default Home1
