import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

let initializeUser = localStorage.getItem("socket-user")
  ? JSON.parse(localStorage.getItem("socket-user"))
  : { username: "", id: 0 };
function App() {
  const [user, setUser] = useState(initializeUser);
  const [socket] = useState(io("http://localhost:8000"));
  const [isActive, setIsActive] = useState(
    localStorage.getItem("socket-user") ? true : false
  );
  const [message, setMessage] = useState("");
  const [recivedMsgs, setRecievedMsgs] = useState([]);
  const [activeFriends, setActiveFriends] = useState([]);
  const [msgReciver, setMsgReciver] = useState("Men");
  useEffect(() => {
    if (localStorage.getItem("socket-user")) {
      socket?.emit("user:active", user);
      setIsActive(true);
    } else {
      isActive && socket?.emit("user:active", user);
      isActive && localStorage.setItem("socket-user", JSON.stringify(user));
    }
  }, [socket, isActive]);

  //For active friends
  socket.on("notifier:active-friends", ({ activeFriends }) => {
    let activeFrdsExcMe = activeFriends.filter(
      (frd) => frd.username !== user.username
    );
    setActiveFriends(activeFrdsExcMe);
    setMsgReciver(activeFrdsExcMe[0].username);
  });

  socket.on("message:receive", (data) => {
    setRecievedMsgs([...recivedMsgs, { ...data }]);
  });

  const sendMessage = () => {
    let receiverSocketId = activeFriends.filter(
      (frd) => frd.username === msgReciver
    )[0].socketId;

    socket.emit("message:send", { receiverSocketId, message });
    setMessage("");
  };

  return (
    <div className="App">
      <h1>Hello !</h1>
      {isActive ? (
        <h3>Welcome {user.username}</h3>
      ) : (
        <>
          <input
            value={user.username}
            type={"text"}
            onChange={(e) => {
              setUser((user) => ({ ...user, username: e.target.value }));
            }}
          />
          <button
            onClick={() => {
              setIsActive(true);
              setUser((user) => ({
                ...user,
                id: Math.floor(Math.random() * Date.now()),
              }));
            }}
          >
            Enter
          </button>
        </>
      )}
      {isActive && (
        <>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button onClick={() => sendMessage()}>Send Message</button>
        </>
      )}
      {isActive && (
        <>
          <h2>All Active Friends </h2>

          <select
            value={msgReciver}
            onChange={(e) => {
              setMsgReciver(e.target.value);
            }}
          >
            {activeFriends.map((frd, i) => (
              <option key={i} value={frd.username}>
                {frd.username}
              </option>
            ))}
          </select>
        </>
      )}
      {isActive && (
        <>
          <h2>All messages :</h2>
          {recivedMsgs.map((msg, i) => (
            <p>{msg.message}</p>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
