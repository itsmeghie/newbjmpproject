import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const ChartCard = ({ title, data }: { title: string; data: any[] }) => (
  <div className="w-full h-auto p-4">
    <h2 className="text-md font-semibold mb-2 text-[#32507D]">{title}</h2>
    <div className="w-full aspect-[2/1]"> {/* Maintain 2:1 aspect ratio */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="PDL" stackId="a" fill="#8884d8" />
          <Bar dataKey="Visitor" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Personnel" stackId="a" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ChartCard;
