import React from 'react'

export const Info = ({Icon, title, value}) => {
    return (
        <div className='flex pt-[9px] '>
            <div className=' mt-[6px] rounded-full items-center justify-center  bg-[#cff4fc]  w-[28px] h-[28px] '>
                <div className='  items-center justify-center '>
                    <Icon style={{ width: "20px", height: "20px", color: "#31D0F4" }} />
                </div>
            </div>
            <div className=' text-left pl-[8px] flex flex-col '>
                <h1 className=' text-[14px] font-medium text-[#828282] '>{title}</h1>
                <h1 className='text-[14px] font-medium text-black '>{value}</h1>
            </div>
        </div>
    )
}
