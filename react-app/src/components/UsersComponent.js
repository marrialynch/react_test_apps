import { useEffect, useState } from "react";
import "./css/user_style.css";

const DEFAULT_DELAY = 2;
const DELAY_TIME = 5;
const ABORT_ERROR = "AbortError";
const TIMEOUT_ERROR =
  "Timeout! More than 5 sec has passed. Previous fetched data will be displayed.";

export default function UsersComponent(props) {
  const [searchVal, setSearchVal] = useState("");

  const [delayTime, setDelayTime] = useState(DEFAULT_DELAY);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(true);

  const [date, setDate] = useState([]);

  useEffect(() => {
    if (reload) {
      setReload(false);
      fetchData();
    }
  }, [reload]);

  const fetchData = async () => {
    setIsLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 3000);
    await fetch("https://reqres.in/api/users?delay=" + delayTime, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((json) => {
        setUserData(json.data);
        setIsLoading(false);
        setDate(new Date());
        clearTimeout(timeout);
      })
      .catch((error) => {
        if (error && error.name === ABORT_ERROR) {
          alert(TIMEOUT_ERROR);
        }
        setIsLoading(false);
        clearTimeout(timeout);
      });
  };

  const validateSearchValue = (user, searchVal) => {
    return (
      searchVal === null ||
      searchVal === "" ||
      user.first_name.includes(searchVal) ||
      user.last_name.includes(searchVal) ||
      user.email.includes(searchVal)
    );
  };

  const funcionAreaRender = () => {
    return (
      <div className="float-container">
        <div>
          Search by:{" "}
          <input
            id="search"
            type="text"
            placeholder="Search by name or email"
            value={searchVal}
            onChange={(event) => setSearchVal(event.target.value)}
          />
        </div>
        <button onClick={() => setReload(true)} disabled={isLoading}>
          Reload Data
        </button>
        <button onClick={() => setDelayTime(DELAY_TIME)}>
          Set Delay Time to 5 sec
        </button>
        Current Delay: {delayTime}
        <div>Last data load time: {date.toLocaleString()}</div>
      </div>
    );
  };

  const userDataRender = () => {
    return (
      <ul>
        {userData &&
          userData.map((user, index) =>
            validateSearchValue(user, searchVal) ? userRender(user) : null
          )}
      </ul>
    );
  };

  const userRender = (user) => {
    return (
      <li key={user.id}>
        <div className="float-container">
          <div className="float-child">
            <img src={user.avatar} alt={user.first_name} />
          </div>
          <div className="float-child">
            Name: {user.first_name} {user.last_name}
            <p>Email: {user.email}</p>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div>
      <br />
      {funcionAreaRender()}
      <hr />
      {isLoading ? <div>Loading ...</div> : userDataRender()}
    </div>
  );
}
