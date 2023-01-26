import React from 'react'

export const VideoText = ({ handleUserDetails, profile, username }) => {
    return (
        <span onClick={handleUserDetails}  className=' cursor-pointer flex items-center justify-center align-top py-2 absolute z-10  h-fit bg-[#666666] rounded-[44px] -mt-[48vh] sm:-mt-[51vh] ' style={{ width: "fit-content", height: "fit-content", paddingLeft: "6px", paddingRight: "12px", borderLeft: "ridge"}} >
            <h1 className='w-[25px] h-[25px] rounded-full'>
                <img src={profile} alt="profile" className=' w-[25px] h-[25px] rounded-full box-border object-cover ' />
            </h1>
            <h1 className=' ml-2 mt-1 font-medium text-white text-[14px] '>{username}</h1>
        </span>
    )
}
