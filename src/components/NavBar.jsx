import React from 'react'
import icon1 from "./assets/icon1.png"
import profile from "./assets/profile-lg.jpg"

import NotificationsNone from '@material-ui/icons/NotificationsNone'
import ExpandMore from '@material-ui/icons/ExpandMore'
export const NavBar = (props) => {
    const today = new Date()
    const month = today.toLocaleString('default', { month: 'short' });
    let day = today.getDate();
    switch (day) {
        case 1 || 21 || 31:
            day = day.toString().concat("st")
            break;
        case 2 || 22:
            day = day.toString().concat("nd")
            break;
        case 3 || 23:
            day = day.toString().concat("rd")
            break;
        default:
            day = day.toString().concat("th")
            break;
    }
    const year = today.getFullYear();
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    //final time
    let time = formatAMPM(today)

    //final date
    const date = month + " " + day + ", " + year
    let userName;
    if (props.name != null) {
        userName = props.name
    } else {
        userName = "Abednego Jilima"
    }
    const doctorName = "Marfo Regan"
    const occupation = "Software Engineer"

    return (
        <div className=' w-full pb-1 md:pb-0 px-2 flex flex-col lg:flex-row justify-between bg-white h-fit  text-center items-center border-[1.2526px 0px 1.2526px 1.2526px] border-solid border-[rgba(217, 217, 217, 0.29)] '>
            <div className='flex items-center justify-between sm:justify-around w-full lg:w-fit lg:justify-center h-full border-b-[1px] lg:border-b-0 '>
                <div className=' pt-[15px] h-full border-r-2 border-r-solid border-r-[#EAE9E9] pr-2 sm:pr-[34px]'>
                    <img src={icon1} alt="Icon" />
                </div>
                <div className=' ml-2 sm:ml-[30px] flex flex-col text-left '>
                    <h1 className='text-[#373131] text-center text-[15px] sm:text-lg md:text-[20px] font-medium '>Medical Appointment with {doctorName}</h1>
                    <div className=' w-full sm:w-fit flex place-content-center sm:place-content-start ' >
                        <h1 className='text-[#bdbcbc] text-[12px] font-medium border-r-[#ACACAC] border-r-2 pr-[5px] '>{date}</h1>
                        <h1 id='time' className='pl-[5px] text-[#bdbcbc] text-[12px] font-medium'>{time}</h1>
                    </div>
                </div>
            </div>
            <div className='w-full sm:w-fit flex flex-col sm:flex-row sm:items-center sm:justify-center h-full'>
                <div className='flex mt-[10px] justify-between '>
                    <div className='bg-[#ecf8f0] rounded-[30px] w-[95px] sm:h-[40px] flex items-center justify-around text-center '>
                        <h1 className=' text-[14px] mt-[8px] font-medium text-[#050D2E'>Online</h1>
                        <div className=' bg-[#3AA05E] rounded-full w-5 h-5 '></div>
                    </div>
                    <div className='relative z-0 cursor-pointer w-[40px] h-[40px] rounded-full border-[1px] border-[#3B3B3B] border-opacity-10 ml-[16px] '>
                        <NotificationsNone className=' mt-2 ' />
                        <div className='absolute z-10 w-2 h-2 ml-5 -mt-5 bg-red-500 rounded-full '></div>
                    </div>
                </div>

                <div className='ml-[18px] flex self-center items-center justify-center cursor-pointer '>
                    <div className=' w-[40px] h-[40px] rounded-full'>
                        <img src={profile} alt="profile" className=' w-full h-full rounded-full box-border object-cover ' />
                    </div>
                    <div className=' text-left ml-[10px] mt-1 flex flex-col'>
                        <h1 className='text-[#3C3C3C] text-[16px] font-medium '>{userName}</h1>
                        <h1 className=' text-[#808080] text-[14px] font-normal -mt-2 ' >{occupation}</h1>
                    </div>
                    <div className='ml-[10px]'>
                        <ExpandMore />
                    </div>
                </div>
            </div>
        </div>
    )
}
