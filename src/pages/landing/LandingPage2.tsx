import { LeftGroup2, RightGroup2 } from "./components/Group"
import { Header, Header2, Header3 } from "./components/Title"
import bg2 from './Images/bg2.png'
import qc from './Images/QC.png'
import monitoring from './Images/MONITORING.png'
import local from './Images/local.png'
import register from './Images/registration.png'
import inmate from './Images/inmate.png' 
import bgbeyond from './Images/bgbeyond.png'
import './css/style.css'

const LandingPage = () => {
  return (
    <div>
      <div className="mt-20">
                <div className="w-full bg-cover flex items-center justify-center md:justify-normal bg-center h-[400px] md:h-[500px] lg:h-[600px] xl:h-[100vh]" style={{backgroundImage: `url(${bg2})`, }}>
                    <div className="w-4xl mx-5 md:mx-20 flex items-center justify-center flex-col">
                        <Header
                            title="Quezon City Jail Management System"
                            description="Empowering Quezon City LGU and BJMP to manage QC Jail Male and Female Dormitories with modern technology and care-driven intelligence."
                        />
                    </div>
                </div>
            </div>
            <div>
                <LeftGroup2
                title="Quezon City LGU x BJMP Collaboration"
                description="The Quezon City Jail Management System is a digital solution built specifically for the needs of the QC Jail Male Dormitory and QC Jail Female Dormitory. In partnership with the Local Government of Quezon City, this system improves inmate care, strengthens visitor protocols, and enhances facility monitoring with real-time intelligence, biometrics, and geospatial technology."
                image={qc} />
                <div className="flex items-center justify-center text-center my-10">
                  <h1 className="font-extrabold text-3xl text-[#1E365D]">What the System Offers</h1>
                </div>
                <RightGroup2 
                image={monitoring}
                title="Gender-Specific Jail Monitoring"
                description={[
                  "Separate data systems for QC Male and Female Dormitories",
                  "Custom dashboards for each dorm facility"]}
                />
                <LeftGroup2 
                image={local}
                title="Local Government Integration"
                description={[
                  "Soon: Data sharing with Quezon City Social Services",
                  "Support for health, legal, and family services coordination"
                ]}
                />
                <RightGroup2 
                image={register}
                title="Visitor Access and Registration"
                description={[
                  "Visitor application with QR and biometric screening",
                  "Automated clearance with LGU and BJMP workflows"
                ]}
                />
                <LeftGroup2 
                image={inmate}
                title="Inmate Profile & Welfare Tracking"
                description={[
                  "Medical, behavioral, and legal records per inmate",
                  "Linked to city services and legal programs"
                ]}
                />
            </div>
            <div className="w-full bg-cover flex items-center justify-center md:justify-normal bg-center md:h-[25rem] lg:h-[30rem]" style={{backgroundImage: `url(${bgbeyond})`, }}>
                <div className="w-4xl mx-5 md:mx-20 flex items-center justify-center flex-col text-justify break-all hyphernate md:text-center">
                  <Header2
                  title="A City That Cares Beyond Bars"
                  description="With the joint commitment of Quezon City LGU and the BJMP, this platform envisions a humane and secure jail system that is transparent, data-driven, and people-centered—protecting the rights of persons deprived of liberty while ensuring community safety and reintegration."
                  />
                </div>
              </div>
              <Header3 
              title="Support Smart Justice in Quezon City"
              description="Start your transformation today. Let’s build a safer, smarter, and more compassionate jail system together."
              />
    </div>
  )
}

export default LandingPage
