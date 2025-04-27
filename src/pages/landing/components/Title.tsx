type TitleProps = {
    title: string;
    desc?: string;
    description?: string;
};

export const Header = (props: TitleProps) => { 
    return (
        <div className="flex flex-col text-white space-y-4 md:w-[800px] justify-center h-screen">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold">{props.title}</h1>
            <p className="font-semibold lg:text-3xl">{props.description}</p>
        </div>
    )
}

export const Header2 = (props: TitleProps) => { 
    return (
        <div className="flex flex-col text-white space-y-4 justify-center py-20">
            <h1 className="text-3xl text-center md:text-4xl font-extrabold">{props.title}</h1>
            <h2 className="text-lg md:text-2xl font-bold">{props.desc}</h2>
            <p className="md:text-lg font-semibold">{props.description}</p>
        </div>
    )
}

export const Header3 = (props: TitleProps) => { 
    return (
        <div className="flex flex-col text-white text-center px-5 space-y-4 justify-center py-20">
            <h1 className="text-3xl text-[#1E365D] font-extrabold">{props.title}</h1>
            <p className="text-lg text-black font-medium">{props.description}</p>
        </div>
    )
}