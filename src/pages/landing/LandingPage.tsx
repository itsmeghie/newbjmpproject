import { RightGroup } from "./components/Group"
import { LeftGroup } from "./components/Group"
import { Header, Header2 } from "./components/Title"
import bg from './Images/secure.png'
import face from './Images/face.png'
import realtime from './Images/realtime.png'
import screening from './Images/screening.png'
import seamless from './Images/seamless.png'
import vision from './Images/vision.png'
import facility from './Images/facility.png'


const LandingPage = () => {
  return (
    <div>
      <div className="mt-20">
                <div className="w-full bg-cover flex items-center justify-center md:justify-normal bg-center h-[400px] md:h-[500px] lg:h-[600px] xl:h-[100vh]" style={{backgroundImage: `url(${bg})`, }}>
                    <div className="w-[48rem] mx-5 md:mx-20 flex items-center justify-center flex-col">
                        <Header
                            title="Secure, Smart, and Streamlined Jail Operations"
                            description="Modernize PDL and visitor management with integrated biometrics, real-time tracking, and intelligent dashboards — built for safety, efficiency, and accountability."
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center text-center my-10">
                  <h1 className="font-extrabold text-3xl text-[#1E365D]">Key Features</h1>
                </div>
            <div>
                <RightGroup 
                title="Unified Identity Management"
                description={[
                  "Register persons deprived of liberty (PDL), officers, visitors with biometrics (face, fingerprint, iris)",
                  "Secure identity verification and history tracking"
                ]}
                image={face}
                />
                <LeftGroup 
                title="Real-Time Monitoring & Dashboards"
                description={[
                  "PDL headcount and alerts",
                  "GIS-based jail mapping and occupancy monitoring"
                ]}
                image={realtime}
                />
                <RightGroup 
                title="Visitor Management & Screening"
                description={[
                  "Visitor registration with QR code and biometric verification",
                  "Automated watchlist matching and approval system"
                ]}
                image={screening}
                />
                <LeftGroup 
                title="Facility Intelligence"
                description={[
                  "Jail profiles with geospatial boundaries, photos, and statistics",
                  "Incident logging and analytical insights"
                ]}
                image={facility}
                />
                <RightGroup 
                title="Seamless Integration"
                description={[
                  "Soon: Law enforcement and court database interoperability",
                  "Bulk CSV uploads and OpenAPI-ready integration"
                ]}
                image={seamless}
                />
            </div>
            <div className="w-full bg-cover flex items-center justify-center bg-center md:h-[25rem] lg:h-[30rem]" style={{backgroundImage: `url(${vision})`, }}>
                <div className="w-4xl px-5 md:px-20 flex items-center justify-center flex-col text-justify break-all hyphernate md:text-center">
                  <Header2
                  title="Vision Statement"
                  desc={'"Transforming Jail Operations with Transparency, Technology, and Trust."'}
                  description="Empowering jail authorities with real-time insights, identity verification, and streamlined operations—reducing risk, enhancing compliance, and improving outcomes."
                  />
                </div>
              </div>
              <div className="flex items-center justify-center text-center my-10">
                  <h1 className="font-extrabold text-3xl text-[#1E365D]">Ready to digitize your jail facility?</h1>
                </div>
    </div>
  )
}

export default LandingPage
