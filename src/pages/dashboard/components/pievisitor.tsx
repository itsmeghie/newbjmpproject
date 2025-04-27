import { ScriptableContext } from "node_modules/chart.js/dist/types";
import { Pie } from "react-chartjs-2"

const pielabels = ['Entered', 'Exited'];

const piedata = {
    labels: ['Entered', 'Exited'],
    datasets: [
        {
            label: 'Service Provider',
            data: pielabels.map(() => 3000),
            backgroundColor: (context: ScriptableContext<'pie'>) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                
                if (!chartArea) {
                    return '#82160B'; 
                }
                
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, '#82160B'); 
                gradient.addColorStop(1, '#3F71C3'); 
                
                return gradient;
            },
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
                font: {
                    size: 10,
                },
            },
        },
        tooltip: {
            enabled: true,
        },
    },
    cutout: '70%',
};

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

export const PiechartVisitor = () => {
    return (
        <div>
            <Pie data={piedata} className="h-[6rem]" options={pieoptions} plugins={[doughnutLabel]}/>
        </div>
    )
}
