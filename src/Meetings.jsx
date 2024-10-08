import { useState, useMemo, useCallback } from "react";
import useFetch from "./useFetch";

export default function Meetings() {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [hoverRowKey, setHoverRowKey] = useState(null);
  const { data } = useFetch("/data");
  const getUsers = useCallback((data) => {
    return [
      { user_id: 0, user_name: "Select User" },
      ...data.map(({ user_id, user_name }) => ({
        user_id,
        user_name,
      })),
    ];
  }, []);
  const getMeetingsInWorkingHours = useCallback((data) => {
    return data
      .map(({ user_id, user_name, working_hours, events }) =>
        events
          .filter((event) => isEventWithinWorkingHours(event, working_hours))
          .map(({ title, start, end }) => ({
            user_id,
            user_name,
            title,
            time: formatTime(start, end, working_hours.time_zone),
            key: user_id + user_name + title + start + end,
          }))
      )
      .flat();
  }, []);

  const meetingsInWorkingHours = useMemo(
    () => getMeetingsInWorkingHours(data ?? []),
    [data, getMeetingsInWorkingHours]
  );
  const users = useMemo(() => getUsers(data ?? []), [data, getUsers]);
  const displayedMeetings = selectedUserId
    ? meetingsInWorkingHours.filter(({ user_id }) => user_id === selectedUserId)
    : meetingsInWorkingHours;

  return (
    <div className="flex-column container">
      <div className="flex">
        <header>Meetings</header>
        <select
          onChange={(e) => {
            setSelectedUserId(Number(e.target.value));
          }}
        >
          {users.map(({ user_id, user_name }) => (
            <option key={user_id} value={user_id}>
              {user_name}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Meeting</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {displayedMeetings.map(({ user_name, title, time, key }) => (
            <tr
              key={key}
              onMouseEnter={() => setHoverRowKey(key)}
              onMouseLeave={() => setHoverRowKey(null)}
              className={`${hoverRowKey === key ? "highlight" : ""}`}
            >
              <td>{user_name}</td>
              <td>{title}</td>
              <td>{time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function isEventWithinWorkingHours(event, workingHours) {
    return true;
  }

  function formatTime(start, end, timeZone) {
    return start + " - " + end + " " + timeZone;
  }
}
