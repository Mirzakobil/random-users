import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CSVLink } from 'react-csv';

function App() {
  const [users, setUsers] = useState([]);
  const [errorsPerRecord, setErrorsPerRecord] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [locale, setLocale] = useState('en');
  const [numberOfUsers, setNumberOfUsers] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://randomuser.me/api/?results=${numberOfUsers}&page=${page}&locale=${locale}&exc=${errorsPerRecord}`
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers((prevUsers) => [...prevUsers, ...data.results]);
        setIsLoading(false);
        if (data.info.page >= data.info.pages) {
          setHasMore(false);
        }
      });
  }, [page, numberOfUsers, locale, errorsPerRecord]);

  const handleErrorsPerRecordChange = (event) => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    setErrorsPerRecord(event.target.value);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const handleLocaleChange = (event) => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    setLocale(event.target.value);
  };

  const handleNumberOfUsersChange = (event) => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    setNumberOfUsers(event.target.value);
  };
  console.log(users);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1>Random Users Generator</h1>
      <div>
        <label htmlFor="errors-per-record">
          Errors Per Record: {errorsPerRecord}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={errorsPerRecord}
          class="slider"
          id="myRange"
          onChange={handleErrorsPerRecordChange}
        />

        <label htmlFor="locale-select">Select a locale:</label>
        <select id="locale-select" onChange={handleLocaleChange} value={locale}>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
        <label htmlFor="number-of-users">Number of Users:</label>
        <input
          id="number-of-users"
          type="number"
          value={numberOfUsers}
          onChange={handleNumberOfUsersChange}
          min={1}
          max={20}
        />
      </div>
      {users.length > 0 && (
        <>
          <CSVLink data={users} target="_blank" className="flex justify-end">
            <div className="flex gap-2 hover:text-emerald-500">
              <button>Export to CSV</button>
            </div>
          </CSVLink>
        </>
      )}
      <InfiniteScroll
        dataLength={users.length}
        next={handleLoadMore}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <table>
          <thead>
            <tr
              style={{
                padding: '15px',
              }}
            >
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.login.uuid}>
                <td
                  style={{
                    padding: '15px',
                  }}
                >
                  {user.id.value}
                </td>
                <td
                  style={{
                    padding: '15px',
                  }}
                >
                  {user.name.first} {user.name.last}
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  {user.location.city} {user.location.street.name}{' '}
                  {user.location.street.number}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>

      {isLoading && <div>Loading...</div>}
    </div>
  );
}

export default App;
