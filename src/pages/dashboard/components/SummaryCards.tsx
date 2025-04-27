export const CardCount = ({ img, title, count }: { img: string; title: string; count: number | string }) => {
    return (
        <div className="flex items-center gap-4 bg-[#F2F6FB] w-full rounded-md py-3 px-5">
            <img src={img} className="w-8 h-8" alt={title} />
            <div>
                <p className="text-[#2962FF] font-extrabold text-2xl">
                    {count !== null && count !== undefined ? count : 0}
                </p>
                <p className="text-xs text-[#121D26]">{title}</p>
            </div>
        </div>
    );
};

export const Title = ({title}: {title: string}) => {
    return (
        <div className="bg-[#F2F6FB] text-[#1E365D] text-center w-full p-2 rounded-md">
            <h1 className="font-extrabold text-[16px]">{title}</h1>
        </div>
    )
}