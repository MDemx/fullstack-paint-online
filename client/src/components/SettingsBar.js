import React from 'react';
import '../styles/Toolbar.scss'
import toolState from "../store/toolState";

export const SettingsBar = () => {
    return (
        <div className='settings-bar'>
            <div className='settings-bar__item'>
                <label htmlFor="line-width">Line width</label>
                <input
                    onChange={e => toolState.setLineWidth(e.target.value)}
                    id="line-width"
                    type="number"
                    defaultValue={1} min={1} max={50}
                />
            </div>
            <div className='settings-bar__item'>
                <label htmlFor="stroke-color">Stroke color</label>
                <input type="color" id="stroke-color" onChange={e => toolState.setStrokeColor(e.target.value)}/>
            </div>
        </div>
    );
};