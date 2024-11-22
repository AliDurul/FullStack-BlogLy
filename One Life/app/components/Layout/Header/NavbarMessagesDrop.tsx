import { MessageNoDataAvaibleIcon, MessagesCloseIcon, MessagesIcon, NotificationCongratulationsIcon, NotificationInfo, NotificationSomeThingWrong, NotificationWarning, ViewAllActivityIcon } from '@/app/icons';
import React, { useState } from 'react'
import Dropdown from '../Dropdown';

const NavbarMessagesDrop = () => {
 const [messages, setMessages] = useState([
		{
			id: 1,
			image: <NotificationCongratulationsIcon />,
			title: 'Congratulations!',
			message: 'Your OS has been updated.',
			time: '1hr',
		},
		{
			id: 2,
			image: <NotificationInfo />,
			title: 'Did you know?',
			message: 'You can switch between artboards.',
			time: '2hr',
		},
		{
			id: 3,
			image: <NotificationSomeThingWrong />,
			title: 'Something went wrong!',
			message: 'Send Reposrt',
			time: '2days',
		},
		{
			id: 4,
			image: <NotificationWarning />,
			title: 'Warning',
			message: 'Your password strength is low.',
			time: '5days',
		},
	]);

 const removeMessage = (value: number) => {
		setMessages(messages?.filter((user) => user.id !== value));
	};
  return (
   <div className="dropdown shrink-0">
   <Dropdown
    offset={[0, 8]}
    placement='bottom-end'
    btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
    button={
     <MessagesIcon />
    }
   >
    <ul className="w-[300px] !py-0 text-xs text-dark dark:text-white-dark sm:w-[375px]">
     <li className="mb-5" onClick={(e) => e.stopPropagation()}>
      <div className="relative !h-[68px] w-full overflow-hidden rounded-t-md p-5 text-white hover:!bg-transparent">
       <div className="bg- absolute inset-0 h-full w-full bg-[url(/assets/images/menu-heade.jpg)] bg-cover bg-center bg-no-repeat"></div>
       <h4 className="relative z-10 text-lg font-semibold">Messages</h4>
      </div>
     </li>
     {messages.length > 0 ? (
      <>
       <li onClick={(e) => e.stopPropagation()}>
        {messages?.map((message) => {
         return (
          <div key={message.id} className="flex items-center py-3 px-5">
           <div >{message.image}</div>
           <span className="px-3 dark:text-gray-500">
            <div className="text-sm font-semibold dark:text-white-light/90">{message.title}</div>
            <div>{message.message}</div>
           </span>
           <span className="whitespace-pre rounded bg-white-dark/20 px-1 font-semibold text-dark/60 ltr:ml-auto ltr:mr-2 rtl:mr-auto rtl:ml-2 dark:text-white-dark">
            {message.time}
           </span>
           <button type="button" className="text-neutral-300 hover:text-danger" onClick={() => removeMessage(message.id)}>
            <MessagesCloseIcon />
           </button>
          </div>
         );
        })}
       </li>
       <li className="mt-5 border-t border-white-light text-center dark:border-white/10">
        <button type="button" className="group !h-[48px] justify-center !py-4 font-semibold text-primary dark:text-gray-400">
         <span className="group-hover:underline ltr:mr-1 rtl:ml-1">VIEW ALL ACTIVITIES</span>
         <ViewAllActivityIcon />
        </button>
       </li>
      </>
     ) : (
      <li className="mb-5" onClick={(e) => e.stopPropagation()}>
       <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
        <div className="mx-auto mb-4 rounded-full text-white ring-4 ring-primary/30">
         <MessageNoDataAvaibleIcon />
        </div>
        No data available.
       </button>
      </li>
     )}
    </ul>
   </Dropdown>
  </div>
  )
}

export default NavbarMessagesDrop