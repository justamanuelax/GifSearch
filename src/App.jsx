import  { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  
  const [gifs, setgifs] = useState([]);  // To store gif data
  const [search, setSearch] = useState(''); // for search strings
  const [loading, setloading] = useState(false); // for loading state
  const [limit, setlimit] = useState(27); // for limit of gifs
  const API_KEY = "Bb3bDQsR1VwJNC0GNMMAlKVOBWyHvIu5"
   const BASE_URL ="https://api.giphy.com/v1/gifs/search"
  
  
  
  // function to search gifs
  
  const limitmin = 1;
  const limitmax = 100;
  const searchgifs = async () => {
    setloading(true);
    try {
       const response = await axios.get(`${BASE_URL}`, {
        params: {
          api_key: API_KEY,
          q: search,
          limit: limit,
        }
      });
      setgifs(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log("Error fetching data" + error);

    }finally{
      setloading(false);
    }
  } 
  const downloadGif = async (gifUrl, gifid) => {
    try {
      const res = await fetch(gifUrl);
      const blob = await res.blob();
      // create a temporary link element for the gif
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Gif : ${gifid}.gif`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading gif", error);

    }
  }
  const deleteGif = (gifid) => {
    const newGifs = gifs.filter((gif) => gif.id !== gifid);
    setgifs(newGifs); 

  }
  useEffect(() => {
  searchgifs();    
  }, []);

  return (
  <div style={{textAlign: "center", padding: "20px"}}>

    <h1>Search Giphy : </h1> 
    <input 
      type='text' 
      placeholder='search gifs' 
      value={search} 
      onChange={(e) => setSearch(e.target.value)} 
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          searchgifs();
        }
      }}
      style={{
        padding: "10px", 
        width: "500px", 
        marginBottom: "10px", 
        borderRadius: "5px", 
        border: "1px solid #ccc"
      }} 
    />
    
    <button 
      onClick={() => searchgifs(search)} 
      style={{
        padding: "10px",
        margin: "10px",
        backgroundColor: "blue",
        color: "white",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer"
      }}
    >
      Search
    </button>
    <br/>
    <input type='range' value={limit} min={limitmin} max={limitmax} style={{width: "800px"}} onChange={(e) => setlimit(e.target.value)}/>
    <br/>
    <p>Range: <input type='num' style={{width: "30px"}} value={limit} onChange={(e) => setlimit(e.target.value)}/></p>
    <br/>
    {loading ? (
      <p><img src='../public/bally.svg' alt='ballbounce'/></p>
    ) : (
      <div 
        style={{
          display: 'grid', 
          gap: "3px", 
          marginTop: "10px", 
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))"
        }}
      >
        {gifs.map((gif) => (
          <div key={gif.id}>
            <img 
              src={gif.images.fixed_height.url} 
              alt={gif.title} 
              style={{
                width: "120px", 
                height: "120px", 
                objectFit: "cover", 
                borderRadius: "10px"
              }}
            />
            <button onClick={() => downloadGif(gif.images.fixed_height.url, gif.id)} style={{margin: "5px", padding: "3px", color: 'brown', backgroundColor: "#f9f9f9"}}>&nbsp;Download Gif&nbsp;</button>              
            <button onClick={() => deleteGif(gif.id)} style={{margin: "5px", padding: "3px", color: 'red', backgroundColor: "#f9f9f9"}}>&nbsp;Delete Gif&nbsp;</button>          

          </div> 
        ))}
      </div>
    )}
  </div>
  )  
}

export default App
