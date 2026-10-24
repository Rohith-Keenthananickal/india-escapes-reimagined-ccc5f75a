import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  color: string;
}

const STATS: StatItem[] = [
  { label: 'Verified Homestays', value: 200, suffix: '+', color: 'text-pink-600' },
  { label: 'Destinations', value: 50, suffix: '+', color: 'text-pink-600' },
  { label: 'Happy Guests', value: 5000, suffix: '+', color: 'text-emerald-600' },
  { label: 'Local Hosts', value: 300, suffix: '+', color: 'text-blue-600' },
  { label: 'Unique Experiences', value: 120, suffix: '+', color: 'text-amber-600' },
  { label: 'Years of Service', value: 10, suffix: '+', color: 'text-purple-600' },
];

export const AnimatedStats = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
      {STATS.map((stat) => (
        <div className="text-center p-3 rounded-xl bg-white shadow-sm border border-gray-100" key={stat.label}>
          <div className={`text-2xl md:text-3xl font-extrabold ${stat.color}`}>
            {inView ? (
              <CountUp end={stat.value} duration={1.8} suffix={stat.suffix} />
            ) : (
              `0${stat.suffix}`
            )}
          </div>
          <div className="text-xs md:text-sm text-gray-600 mt-1 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedStats;
