import { IoRadioButtonOn } from "react-icons/io5";
import { IoMdRadioButtonOn } from "react-icons/io";

import { MdFilterAltOff } from "react-icons/md";

import { VscRefresh } from "react-icons/vsc";

interface ControlButtonsProps {
    clusterMarkers: boolean;
    // showFilterDrawer: boolean;
    setClusterMarkers: React.Dispatch<React.SetStateAction<boolean>>;
    // setShowFilterDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControlButtons = ({ clusterMarkers, setClusterMarkers }: ControlButtonsProps) => {
    return (
        <div className='bg-[rgba(236,236,236,0.8)] rounded-full absolute bottom-[2%] z-[500] left-2 px-1 py-4 flex flex-col gap-2'>
            <button
                onClick={() => { window.location.reload() }}
                className='bg-[rgba(241,241,241,0.8)] rounded-full p-1 hover:bg-gray-400 transition-all ease-in-out shadow-allSide'
            >
                <VscRefresh size={25} />
            </button> {/*refresh */}

            <button
                className='bg-[rgba(241,241,241,0.8)] rounded-full p-1 hover:bg-gray-400 transition-all ease-in-out shadow-allSide'
                onClick={() => setClusterMarkers(prev => !prev)}
            >
                {clusterMarkers ? <IoMdRadioButtonOn size={25} /> : <IoRadioButtonOn size={25} />}
            </button> {/*toggle cluser mode */}

            <button
                className='bg-[rgba(241,241,241,0.8)] rounded-full p-1 hover:bg-gray-400 transition-all ease-in-out shadow-allSide'
            >
                <MdFilterAltOff size={25} />
            </button> {/*toggle filter drawer */}
        </div>
    )
}

export default ControlButtons