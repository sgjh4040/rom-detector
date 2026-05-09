import React from 'react';
import { JOINTS } from '../../../lib/romData';

interface JointSelectorProps {
    selectedJointIds: string[];
    toggleJoint: (jointId: string) => void;
}

export const JointSelector: React.FC<JointSelectorProps> = ({
    selectedJointIds, toggleJoint
}) => {
    return (
        <div className="mb-6">
            <h2 className="mt-6 mb-2">관절 선택
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                    (복수 선택 가능)
                </span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {JOINTS.map((joint) => {
                    const selected = selectedJointIds.includes(joint.id);
                    return (
                        <button key={joint.id} type="button"
                            className={`btn ${selected ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => toggleJoint(joint.id)}>
                            {selected ? '✓ ' : ''}{joint.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
