// AlbumContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AlbumContext = createContext();

export const AlbumProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/Andersson76/xustedApp/main/XustedMusicApp/assets/data/albums.json"
      )
      .then((response) => {
        setAlbums(response.data);
      })
      .catch((error) => {
        console.error("Axios error:", error);
      });
  }, []);

  return (
    <AlbumContext.Provider value={{ albums }}>{children}</AlbumContext.Provider>
  );
};
