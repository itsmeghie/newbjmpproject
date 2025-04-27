import { Pie } from "react-chartjs-2"

const piedata = {
    labels: ['Entered', 'Exited'],
    datasets: [
        {
            label: '# of Service Provider Entry/Exits',
            data: [12, 19],
            backgroundColor: [
                '#52688D',
                '#BFC8D7',
            ],
            borderColor: [
                '#52688D',
                '#BFC8D7',
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

export const Piechart = () => {
    return (
        <div>
            <Pie data={piedata} className="h-[6rem]" options={pieoptions} plugins={[doughnutLabel]}/>
        </div>
    )
}
