import React, { useContext } from 'react';
import { Calendar as RSuiteCalendar, Whisper, Popover, Badge } from 'rsuite';
import { UserDataContext } from "../../../context/UserDataContext";
import "./Calendar.css"

function CalendarComponent() {
  const { calendars } = useContext(UserDataContext);

  function getTodoList(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return calendars.filter(entry => {
      // Extract the date part from the entry's date and compare it to the current date string
      const entryDate = entry.date.split('T')[0];
      return entryDate === dateString;
    }).map(entry => {
        
      return { time: 'N/A', title: entry.entry };
    });
  }

  function renderCell(date) {
    const list = getTodoList(date);
    const displayList = list.filter((item, index) => index < 2);

    if (list.length) {
      const moreCount = list.length - displayList.length;
      const moreItem = (
        <li>
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                {list.map((item, index) => (
                  <p key={index}>
                    <b>{item.time}</b> - {item.title}
                  </p>
                ))}
              </Popover>
            }
          >
            <a>{moreCount} more</a>
          </Whisper>
        </li>
      );

      return (
        <ul className="calendar-todo-list">
          {displayList.map((item, index) => (
            <li key={index}>
              <Badge /> <b>{item.time}</b> - {item.title}
            </li>
          ))}
          {moreCount ? moreItem : null}
        </ul>
      );
    }

    return null;
  }

  return (
    <div>
      <h1>CALENDAR COMING HERE</h1>
      <RSuiteCalendar bordered renderCell={renderCell} />
    </div>
  );
}

export default CalendarComponent;
