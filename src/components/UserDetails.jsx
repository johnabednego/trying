import React from 'react'
import profile from "./assets/profile-lg.jpg"
import { EmailOutlined, PhoneOutlined, DateRangeOutlined, ListAltOutlined } from '@material-ui/icons'
import { Info } from './Info'
import {HealthInfo} from './HealthInfo'

export const UserDetails = () => {
    return (
        <div className='pb-[400px]'>
        <div className='  -mt-[40vh] z-10 absolute drop-shadow-sm px-[32px] py-[24px] bg-[#FFFFFF] w-full h-fit rounded-[8px] '>
            <div className='items-start text-left '>
                <h1 className='text-black text-[24px] font-medium '>Marfo Regan</h1>
                <h1 className=' text-[#828282] text-[16px] font-medium '>25 Years, Male</h1>
            </div>
            <hr />
            <div className='pt-[10px] flex'>
                <img src={profile} alt="Profile" className=' w-[110px] h-[110px] rounded-[8px] ' />
                <div className=' flex  w-full justify-around '>
                    <div className='flex flex-col'>
                        <Info Icon={EmailOutlined} title="Email" value="Marforegan@gmail.com" />
                        <Info Icon={PhoneOutlined} title="Phone" value="(704) 555-1246" />
                    </div>
                    <div className='flex flex-col'>
                        <Info Icon={DateRangeOutlined} title="Date of Birth" value="20 August 1997" />
                        <Info Icon={ListAltOutlined} title="Diseases" value="Cardiology" />
                    </div>
                </div>
            </div>
            <div className='flex justify-between flex-wrap '>
                <HealthInfo title="Blood Pressure"
                background="#E8FFF0" percentage="35%"
                percent_bg="#a1ddb6" value_bg="#3AA05E" 
                text="141/90 mmhg" 
                />
                <HealthInfo title="Body Temperature"
                background="#FAEDFF" percentage="35%"
                percent_bg="#efcffc" value_bg="#DD95F9" 
                text="29℃" 
                />
                <HealthInfo title="Body Mass Index"
                background="#EAFAFE" percentage="35%"
                percent_bg="#85cdf9" value_bg="#0B9BF4" 
                text="25kg/m2" 
                />
                <HealthInfo title="Blood Sugar"
                background="#FFF9E9" percentage="35%"
                percent_bg="#ffd480" value_bg="#FFA901" 
                text="7.8 mmol/L" 
                />
            </div>
        </div>
        </div>
    )
}
