import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import type { Movement } from '../../../lib/romData';
import { ImageAngleMeasurer } from '../../../core/components/ImageAngleMeasurer';

interface MeasurementPanelProps {
    activeMov: Movement | undefined;
    activeVal: number;
    handleChange: (val: string | number) => void;
    handleFast: (pct: number) => void;
    handlePhoto: (angle: number) => void;
}

export const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
    activeMov,
    activeVal,
    handleChange,
    handleFast,
    handlePhoto
}) => {
    const [showPhoto, setShowPhoto] = useState(false);

    const onPhotoConfirmed = (angle: number) => {
        handlePhoto(angle);
        setShowPhoto(false);
    };

    return (
        <div className="w-full md:w-2/3">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">

                {/* Panel Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-800">
                        {activeMov?.name ?? '동작 선택'}
                    </h3>
                    <div className="icon-text bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-sm font-medium text-slate-600">
                            정상 범위 <span className="font-bold text-slate-900 ml-1">{activeMov?.normalRange}°</span>
                        </span>
                    </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-center items-center">

                    {/* 1. Giant Typography Angle Display */}
                    <div className="mb-12 flex items-baseline justify-center">
                        <span className={`text-8xl font-black tracking-tighter ${activeVal > 0 ? 'text-blue-600' : 'text-slate-300'} transition-colors duration-300`}>
                            {activeVal}
                        </span>
                        <span className="text-4xl font-bold text-slate-300 ml-2 mb-6">°</span>
                    </div>

                    {/* 2. Range Slider (Shadcn UI style) */}
                    <div className="w-full max-w-md mb-12 relative">
                        <div className="flex justify-between text-sm font-semibold text-slate-400 mb-4 px-1">
                            <span>0°</span>
                            <span className="text-emerald-500">{activeMov?.normalRange}°</span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max={Math.max(180, activeMov?.normalRange || 180)}
                            value={activeVal}
                            onChange={(e) => handleChange(e.target.value)}
                            className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-100 accent-blue-600"
                            style={{
                                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(activeVal / Math.max(180, activeMov?.normalRange || 180)) * 100}%, #f1f5f9 ${(activeVal / Math.max(180, activeMov?.normalRange || 180)) * 100}%, #f1f5f9 100%)`
                            }}
                        />
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            input[type=range]::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                appearance: none;
                                width: 28px;
                                height: 28px;
                                border-radius: 50%;
                                background: white;
                                border: 2px solid #2563eb;
                                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                                cursor: pointer;
                                margin-top: -12px;
                                transition: transform 0.1s;
                            }
                            input[type=range]::-webkit-slider-thumb:hover {
                                transform: scale(1.1);
                            }
                            input[type=range]::-webkit-slider-runnable-track {
                                height: 4px;
                                border-radius: 2px;
                            }
                        `}} />

                        {/* Normal Range Marker Line */}
                        {activeMov && (
                            <div
                                className="absolute top-10 w-0.5 h-6 bg-emerald-400 -mt-1 rounded-full z-0"
                                style={{ left: `${(activeMov.normalRange / Math.max(180, activeMov?.normalRange || 180)) * 100}%` }}
                            />
                        )}
                    </div>

                    {/* 3. Segmented Control (Fast Input) */}
                    <div className="w-full max-w-md bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-8 shadow-inner">
                        {[25, 50, 75].map(pct => {
                            const targetVal = Math.round(((activeMov?.normalRange ?? 0) * pct) / 100);
                            const isSelected = activeVal === targetVal && activeVal > 0;

                            return (
                                <button
                                    key={pct}
                                    onClick={() => handleFast(pct)}
                                    className={`
                                        flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200
                                        ${isSelected
                                            ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/50'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                                    `}
                                >
                                    {pct}%
                                </button>
                            );
                        })}
                        <button
                            onClick={() => handleFast(100)}
                            className={`
                                flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5
                                ${activeVal === activeMov?.normalRange && activeVal > 0
                                    ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                            `}
                        >
                            정상
                        </button>
                    </div>

                    {/* 4. Photo Measurement Secondary Button */}
                    <button
                        onClick={() => setShowPhoto(!showPhoto)}
                        className={`
                            w-full max-w-md py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-200
                            ${showPhoto
                                ? 'bg-slate-800 text-white shadow-md hover:bg-slate-700'
                                : 'bg-white text-slate-700 border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 shadow-sm'}
                        `}
                    >
                        <Camera className={`w-5 h-5 ${showPhoto ? 'text-slate-300' : 'text-slate-400'}`} />
                        {showPhoto ? '사진 측정 모드 닫기' : '사진으로 정밀 측정하기'}
                    </button>

                    {showPhoto && (
                        <div className="w-full max-w-md mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
                                <ImageAngleMeasurer onAngleConfirmed={onPhotoConfirmed} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
