import React from "react";
import formats, { ToolbarOption } from './ToolbarOptions';

const renderOptions = (formatData: ToolbarOption): React.ReactElement => {
    const { className, options } = formatData;
    return (
        <select className={className}>
            <option defaultValue=""></option>
            {
                options?.map((value, index) => {
                    return (
                        <option key={index} value={value}></option>
                    )
                })
            }
        </select>
    )
}

const renderSingle = (formatData: ToolbarOption): React.ReactElement => {
    const { className, value } = formatData;
    return (
        <button className={className} value={value}></button>
    )
}

const CustomToolbar: React.FC = () => (
    <div id="toolbar">
        {
            formats.map((classes, groupIndex) => {
                return (
                    <span key={groupIndex} className="ql-formats">
                        {
                            classes.map((formatData, formatIndex) => {
                                return (
                                    <React.Fragment key={formatIndex}>
                                        {formatData.options ? renderOptions(formatData) : renderSingle(formatData)}
                                    </React.Fragment>
                                )
                            })
                        }
                    </span>
                )
            })
        }
    </div>
)

export default CustomToolbar;