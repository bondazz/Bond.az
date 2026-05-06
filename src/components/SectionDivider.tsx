import React from 'react';
import './SectionDivider.css';

interface SectionDividerProps {
    title?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ title }) => {
    return (
        <div className="section-divider-container">
            <div className="divider-wrapper">
                <div className="divider-line side-left"></div>
                <div className="divider-center-element">
                    <div className="glow-orb"></div>
                    <div className="center-logo-box"></div>
                    {title && (
                        <div className="divider-title-box">
                            <span className="divider-text">{title}</span>
                        </div>
                    )}
                </div>
                <div className="divider-line side-right"></div>
            </div>
            <div className="divider-blur-background"></div>
        </div>
    );
};

export default SectionDivider;
