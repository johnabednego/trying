import React from 'react'

export const HealthInfo = ({ title,background, percentage, percent_bg, value_bg, text}) => {
    return (
        <div className=' drop-shadow-sm rounded-[7px] flex flex-col text-left items-start justify-start mt-[24px] w-[230px] h-fit p-[14px] ' style={{ backgroundColor: background }}>
            <h1 className=' text-[14px] font-medium text-[#222222] '>{title}</h1>
            <div className='mt-[5px] text-left items-start justify-start flex flex-col '>
                <h1 className=' text-[12px] text-[#222222] font-medium '>{percentage}</h1>
                <div className=' rounded-[21px] w-[173px] h-[8px]' style={{ backgroundColor: percent_bg }}>
                    <div className=' rounded-[21px] h-full ' style={{ width: percentage, backgroundColor: value_bg }}></div>
                </div>
                <h1 className=" mt-[14px] text-[14px] font-medium" style={{ color: value_bg }}>{text}</h1>
            </div>
        </div>
    )
}
