import React, { useState, useEffect } from "react";
import "./App.css";
import categories from "./categories";
import regions from "./countries.json";
import moment from "moment";

function countries() {
  Object.keys(regions)
    .sort()
    .map((value, key) => <p key={key}>{value}</p>);
}

const App = () => {
  const [data, setData] = useState([]);
  // const [isloading, setIsloading] = useState(true);

  const image = "https://via.placeholder.com/150";
  const apiKey = process.env.API_KEY;

  useEffect(() => {
    const fetchPosts = async () => {
      const url =
        "https://api.currentsapi.services/v1/latest-news?country=gb&apiKey=" +
        apiKey;
      const response = await fetch(url);
      const articles = await response.json();
      setData(articles.news);
    };
    // setIsloading(false);
    fetchPosts();
  }, []);

  const formattedTime = (date) => {
    const newDate = new Date(date).toISOString();
    const newTime = moment(newDate).fromNow();
    return newTime;
  };

  const sortedList = (post) =>
    post.sort((a, b) => new Date(b.published) - new Date(a.published));

  return (
    <>
      <header>Header</header>
      <main>
        <div className="sidebar">
          <h2>Categories</h2>
          <ul>
            {categories.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="container">
          <h2>Fetch news from Currents API</h2>
          <div className="card">
            {sortedList(data) &&
              data.map((post) => (
                <div key={post.id} className="cardItem">
                  <h5 className="title">{post.title}</h5>
                  <img
                    style={{ width: "100%" }}
                    src={image}
                    alt="Placeholder image"
                  />
                  {/* <p className="description">{post.description}</p> */}
                  <p>{formattedTime(post.published)}</p>
                </div>
              ))}
          </div>
        </div>
      </main>
      <footer className="footer">(c) Josh Uvi</footer>
    </>
  );
};

export default App;
