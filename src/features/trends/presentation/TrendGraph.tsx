import React from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import '../../../styles/Trends.css';

interface DataPoint {
    label: string;
    value: number;
}

interface TrendGraphProps {
    data: DataPoint[];
    /** Y축 상한 기준 (차트 스케일 계산용) */
    normalRange?: number;
    /** 기준선을 그릴 값 — 지정하지 않으면 normalRange 위치에 그린다.
     *  VAS 처럼 "낮을수록 좋음" 지표는 targetValue={0}을 전달해서 기준선을 하단에 그린다. */
    targetValue?: number;
    unit?: string;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({
    data,
    normalRange = 180,
    targetValue,
    unit = '°',
}) => {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 opacity-40">
                데이터가 없습니다.
            </div>
        );
    }

    const referenceValue = targetValue ?? normalRange;
    const referenceLabel =
        targetValue !== undefined
            ? `목표 ${targetValue}${unit}`
            : `정상 ${normalRange}${unit}`;

    const maxVal = Math.max(...data.map((d) => d.value), normalRange, referenceValue);
    const yMax = Math.ceil(maxVal * 1.1);

    return (
        <div
            className="relative w-full neumo-inset rounded-3xl"
            style={{ padding: '32px 16px 16px', overflow: 'visible' }}
        >
            <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 8, right: 60, bottom: 0, left: -8 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                        <XAxis
                            dataKey="label"
                            stroke="currentColor"
                            opacity={0.6}
                            tick={{ fontSize: 11, fontWeight: 700, fill: 'currentColor' }}
                            tickLine={false}
                            axisLine={{ opacity: 0.2 }}
                        />
                        <YAxis
                            stroke="currentColor"
                            opacity={0.6}
                            domain={[0, yMax]}
                            allowDecimals={false}
                            tick={{ fontSize: 11, fontWeight: 600, fill: 'currentColor' }}
                            tickLine={false}
                            axisLine={{ opacity: 0.2 }}
                            width={32}
                        />
                        <Tooltip
                            cursor={{
                                stroke: '#000000',
                                strokeWidth: 1,
                                strokeDasharray: '2 2',
                                opacity: 0.4,
                            }}
                            contentStyle={{
                                background: '#ffffff',
                                border: '1px solid rgba(0, 0, 0, 0.06)',
                                borderRadius: 10,
                                padding: '6px 10px',
                                fontSize: 13,
                                fontWeight: 700,
                                color: '#000000',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
                            }}
                            labelStyle={{
                                color: 'var(--text-secondary)',
                                fontWeight: 600,
                                fontSize: 11,
                                marginBottom: 2,
                            }}
                            formatter={(value) => [`${value}${unit}`, '값']}
                        />
                        <ReferenceLine
                            y={referenceValue}
                            stroke="var(--success)"
                            strokeDasharray="6 6"
                            strokeWidth={1.5}
                            opacity={0.6}
                            label={{
                                value: referenceLabel,
                                position: 'right',
                                fill: 'var(--success)',
                                fontSize: 11,
                                fontWeight: 700,
                                opacity: 0.9,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#000000"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            dot={{
                                fill: '#ffffff',
                                stroke: '#000000',
                                strokeWidth: 3,
                                r: 6,
                            }}
                            activeDot={{
                                fill: '#000000',
                                stroke: '#000000',
                                strokeWidth: 3,
                                r: 8,
                            }}
                            style={{
                                filter:
                                    'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2))',
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
