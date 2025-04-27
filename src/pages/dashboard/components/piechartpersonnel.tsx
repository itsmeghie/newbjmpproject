import { Pie } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface PieData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: (string | CanvasGradient)[];
        borderWidth: number;
    }[];
}

const piedata: PieData = {
    labels: ['Entered', 'Exited'],
    datasets: [
        {
            label: '# of BJMP Personnel',
            data: [12, 19],
            backgroundColor: [
                '#82160B',
                '#F3BFC6'
            ], 
            borderWidth: 1,
        },
    ],
};

const pieoptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
            },
        },
        tooltip: {
            enabled: true,
        },
    },
    cutout: '70%',
};

export const PiechartPersonnel = () => {

    {/*const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, 0, 150);
                gradient.addColorStop(0, '#82160B');
                gradient.addColorStop(1, '#D05856');

                piedata.datasets[0].backgroundColor = [gradient, '#F3BFC6'];
            }
        }
    }, []); */}        
        const doughnutLabel = {
            id: 'doughnutLabel',
            afterDatasetsDraw(chart: any, args: any, plugin: any) {
                const {ctx, data } = chart;

                const centerX = chart.getDatasetMeta(0).data[0].x;
                const centerY = chart.getDatasetMeta(0).data[0].y;

                ctx.save();
                ctx.font = 'bold';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center'; 
                ctx.textBaseline = 'middle';
                ctx.fillText('50% Entered Rate', centerX, centerY);
            }
        }
            
    return (
        <div>
            {/*  <canvas ref={chartRef}/>*/}
            <Pie className="h-[6rem]" data={piedata} options={pieoptions} plugins={[doughnutLabel]}/>
        </div>
    );
};