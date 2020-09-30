import { getState, setState } from "statezero";
import Axios from 'axios';

// Initialize all state paths used by app as empty.
export const setEmptyState = () => {
  setState("cookie", false);
  setState("currentUser", null);
  setState("loginForm", { name: "", password: "" });
  setState("registerForm", { name: "", password: "" });
  setState("addMovieForm", { name: "", locations: "\"Location\"", location: "", bluray: false, dvd: false });
  setState("selectedFile", null);
  setState("floor", false);
  setState("locationList", []);
  setState("movieList", []);
  setState("source", "");
  setState("planLoad", false);
};

export const readCookie = () => {
  const url = "/auth/check-session";
  fetch(url).then(res => {
    if (res.status === 200) return res.json();
    else return Promise.resolve({});
  }).then(json => {
    if (json && json.currentUser) {
      setState("currentUser", json.currentUser);
      setState("floor", json.floor);
    }
    setState("cookie", true);
  }).catch(error => {
    alert(error);
  });
};

export const updateForm = field => {
  const { className, name, value } = field;
  // set className.name = value in state
  setState(`${className}.${name}`, value);
};

export const updateCheckBox = field => {
  const { className, name, checked } = field;
  setState(`${className}.${name}`, checked);
}

export const register = (e) => {
  e.preventDefault();
  console.log("try register");
  const request = new Request("/auth/register", {
    method: "post",
    body: JSON.stringify(getState("registerForm")),
    headers: {
      'Accept': "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });
  setState("registerForm.password", "");
  fetch(request).then(res => {
    return res.json();
  }).then(json => {
    if (json.error) alert(json.error);
  }).catch(error => {
    alert("something went wrong :(");
  });
}

export const login = (e) => {
  e.preventDefault();
  const request = new Request("/auth/login", {
    method: "post",
    body: JSON.stringify(getState("loginForm")),
    headers: {
      'Accept': "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });
  setState("loginForm.password", "");
  // Send the request with fetch()
  fetch(request).then(res => {
    return res.json();
  }).then(json => {
    if (json.currentUser) {
      setState("currentUser", json.currentUser);
      setState("floor", json.floor);
    } else alert(json.error);
  }).catch(error => {
    alert("something went wrong :(");
  });
}

export const logout = () => {
  const url = "/auth/logout";
  fetch(url).then(res => {
    setEmptyState();
    setState("cookie", true);
  }).catch(error => {
    alert(error);
  });
};

export const getLocations = () => {
  console.log("get locations");
  const url = "/locations";
  fetch(url).then(res => {
    if (res.status === 200) return res.json();
    else return Promise.reject("server error");
  }).then(json => {
    // const locs = ["\"Location\""].concat(json);
    setState("locationList", json);
  }).catch(error => {
    alert(error);
  });
}

export const getMovies = () => {
  console.log("get movies");
  const url = "/movies";
  fetch(url).then(res => {
    if (res.status === 200) return res.json();
    else return Promise.reject("server error");
  }).then(json => {
    const movs = json.map((movie) => {
      movie.imdbInfo = false;
      return movie;
    });
    console.log(movs);
    setState("movieList", movs);
  }).catch(error => {
    alert(error);
  });
}

export const addMovie = (e) => {
  e.preventDefault();
  console.log("add movie");
  const request = new Request('/addMovie', {
    method: "post",
    body: JSON.stringify(getState("addMovieForm")),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  })
  fetch(request).then((res) => {
    return res.json();
  }).then((json) => {
    if (json.error) {
      alert(json.error);
    } else {
      setState("addMovieForm", {
        name: "", locations: "\"Location\"",
        location: "", bluray: false, dvd: false
      });
      getLocations();
      alert("Added Movie\nName: " + json.name + "\nLocation: " +
        json.location + "\nbluray: " + json.bluray + " dvd: " + json.dvd);
    }
  }).catch((err) => {
    alert(err);
  });
}

export const imdbSearch = (id, title) => {
  fetch('/imdb/' + title).then((res) => {
    console.log("ret json");
    return res.json();
  }).then((json) => {
    console.log(json);
    const newMovieList = getState("movieList").map((movie) => {
      if (movie._id !== id) {
        return movie;
      }
      return {
        "_id": movie._id, "name": movie.name, "location": movie.location,
        "bluray": movie.bluray, "dvd": movie.dvd, "imdbInfo": true,
        "Year": json.Year, "Runtime": json.Runtime, "Genre": json.Genre,
        "Director": json.Director, "Actors": json.Actors, "imdbRating": json.imdbRating
      }
      /*
      "Year": 1998, "Runtime": "120min", "Genre": "Horror", "Director": "Wes Anderson",
          "Actors": "Mike Myers, Eddie Murphy, Cameron Diaz, John Lithgow", "imdbRating": "7.8"
      */
    })
    setState("movieList", newMovieList);
    console.log("exit imdb");
  }).catch((err) => {
    alert(err);
  })
}

export const softDelete = (id) => {
  // from deletedMovieList
  const r = prompt("Are you sure (type yes)", "");
  if (r !== "yes") {
    return;
  }
  const request = new Request('/movies/' + id, {
    method: 'delete',
    body: JSON.stringify({}),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  });

  fetch(request).then((res) => {
    return res.json();
  }).then((json) => {
    if (json.error) {
      alert(json.error);
    } else {
      const movieList = getState("movieList");
      setState("movieList", movieList.filter((movie) => movie._id !== id));
    }
  }).catch((err) => {
    alert(err);
  })
}

export const uploadFile = (e) => {
  e.preventDefault();
  let formData = new FormData();
  formData.append("file", getState("selectedFile"));
  fetch('/floor', { method: "POST", body: formData }).then((res) => {
    return res.json();
  }).then((json) => {
    if (json.error) {
      alert(json.error);
    } else {
      //setTimeout(() => setState("floor", json.floor), 2000);
      setState("floor", json.floor);
      fetchUploadFile();
    }
  }).catch((err) => {
    alert(err);
  })
}

export const fileChangeHandler = (e) => {
  setState("selectedFile", e.target.files[0])
}

export const fetchUploadFile = () => {
  console.log("fetch upload file");
  Axios.get(`/uploads/${getState("currentUser")}/floor_plan.jpg`,
    { responseType: 'arraybuffer' }
  ).then(response => {
    const base64 = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte), ''
      ),
    );
    setState("source", "data:;base64," + base64);
    setState("planLoad", true);
  });
}