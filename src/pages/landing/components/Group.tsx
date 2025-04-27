import '../css/style.css'

type GroupProps = {
    title: string;
    description: string | string[];
    desc?: string;
    image: string;
}

export const RightGroup = (props: GroupProps) => {
    return (
        <div className="flex bg-[#858585]/10 py-10 px-5 md:px-10 gap-5 lg:gap-14 lg:px-20 flex-col-reverse md:flex-row items-center justify-center md:justify-between w-full">
            <div className="w-full md:w-1/2 flex">
                <div className="flex flex-col space-y-4">
                    <div className="border-l-4 py-3 border-[#82160B]">
                        <h1 className="text-[#1E365D] text-left font-bold text-xl xl:text-3xl ml-2">{props.title}</h1>
                    </div>
                    <div className='xl:text-xl'>
                        <p className="text-[#363731] marker:text-[#363731] text-justify break-all hyphernate">{props.desc}</p>
                    {Array.isArray(props.description) ? (
                        <ul className="list-disc list-inside break-all hyphernate text-[#363731]">
                            {props.description.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#363731] text-justify break-all hyphernate">{props.description}</p>
                    )}
                    </div>
                </div>
            </div>
            <div className="w-full md:w-1/2 bg-cover bg-center">
                <img src={props.image} alt={props.title} className="w-full object-cover rounded-md mb-4"/>
            </div>
        </div>
    )
}

export const LeftGroup = (props: GroupProps) => {
    return (
        <div className="flex bg-white py-10 px-5 md:px-10 gap-5 md:gap-14 lg:px-20 flex-col md:flex-row items-center justify-center md:justify-between w-full">
            <div className="w-full md:w-1/2 bg-cover bg-center">
                <img src={props.image} alt={props.title} className="w-full object-cover rounded-md mb-4"/>
            </div>
            <div className="w-full md:w-1/2 flex">
                <div className="flex flex-col space-y-4">
                    <div className="border-l-4 py-3 border-[#82160B]">
                        <h1 className="text-[#1E365D] text-left font-bold text-xl xl:text-3xl ml-2">{props.title}</h1>
                    </div>
                    <div className='xl:text-xl'>
                        <p className="text-[#363731] marker:text-[#363731] text-justify break-all hyphernate">{props.desc}</p>
                    {Array.isArray(props.description) ? (
                        <ul className="list-disc list-inside break-all hyphernate text-[#363731]">
                            {props.description.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#363731] xl:text-xl text-justify break-all hyphernate">{props.description}</p>
                    )}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export const LeftGroup2 = (props: GroupProps) => {
    return (
        <div className="flex py-10 px-5 md:px-10 gap-5 md:gap-14 lg:px-20 flex-col md:flex-row items-center justify-center md:justify-between w-full">
            <div className="w-full md:w-1/2 bg-cover bg-center">
                <img src={props.image} alt={props.title} className="w-full object-cover rounded-md mb-4"/>
            </div>
            <div className="w-full md:w-1/2 flex">
                <div className="flex flex-col space-y-4">
                    <div className="border-l-4 py-3 border-[#1E365D]">
                        <h1 className="text-[#1E365D] font-bold text-xl xl:text-3xl ml-2 text-left">{props.title}</h1>
                    </div>
                    <div className='xl:text-xl'>
                        <p className="text-[#363731] marker:text-[#363731] text-justify break-all hyphernate">{props.desc}</p>
                    {Array.isArray(props.description) ? (
                        <ul className="list-disc list-inside break-all hyphernate text-[#363731]">
                            {props.description.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#363731] text-justify break-all hyphernate">{props.description}</p>
                    )}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export const RightGroup2 = (props: GroupProps) => {
    return (
        <div className="flex py-10 px-5 md:px-10 gap-5 lg:gap-14 lg:px-20 flex-col-reverse md:flex-row items-center justify-center md:justify-between w-full">
            <div className="w-full md:w-1/2 flex">
                <div className="flex flex-col space-y-4">
                    <div className="border-l-4 py-3 border-[#1E365D]">
                        <h1 className="text-[#1E365D] font-bold text-xl xl:text-3xl ml-2 text-left">{props.title}</h1>
                    </div>
                    <div className='xl:text-xl'>
                        <p className="text-[#363731] marker:text-[#363731] text-justify break-all hyphernate">{props.desc}</p>
                    {Array.isArray(props.description) ? (
                        <ul className="list-disc list-inside break-all hyphernate text-[#363731]">
                            {props.description.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#363731] text-justify break-all hyphernate">{props.description}</p>
                    )}
                    </div>
                </div>
            </div>
            <div className="w-full md:w-1/2 bg-cover bg-center">
                <img src={props.image} alt={props.title} className="w-full object-cover rounded-md mb-4"/>
            </div>
        </div>
    )
}