import React from 'react';

export const CesFlutterPage: React.FC = () => {
    return (
        <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <iframe
                src={`${import.meta.env.BASE_URL}flutter_app_web/index.html`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="CES Flutter Player"
            />
        </div>
    );
};
