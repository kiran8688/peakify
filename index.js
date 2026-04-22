let SPOTIFY_ACCESS_TOKEN = "";

async function refreshAccessToken() {
  try {
    const response = await fetch("http://localhost:3001/api/token");
    const data = await response.json();
    SPOTIFY_ACCESS_TOKEN = data.access_token;
    // Set up next refresh in 55 minutes
    setTimeout(refreshAccessToken, 55 * 60 * 1000);
    return SPOTIFY_ACCESS_TOKEN;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    // Retry after 1 minute on failure
    setTimeout(refreshAccessToken, 60 * 1000);
  }
}

/**
 * Escapes HTML special characters in a string to prevent XSS.
 * @param {string} str The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHTML(str) {
  if (typeof str !== "string") {
    return str;
  }
  return str.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

let loader;
function toggleLoader(show) {
  if (!loader) loader = document.querySelector("#loader");
  if (loader) {
    if (show) loader.classList.remove("d-none");
    else loader.classList.add("d-none");
  }
}

async function init() {
  const cntent = document.querySelector("#cntent");
  const content = document.querySelector("#content");
  const grandCntent = document.querySelector("#grand-cntent");

  toggleLoader(true);
  await refreshAccessToken();
  if (!SPOTIFY_ACCESS_TOKEN) {
    console.error("Error: SPOTIFY_ACCESS_TOKEN is not defined. Please ensure the token server is running.");
    toggleLoader(false);
    return;
  }

  /// ----------------------------------------MY FIRST API CALL STARTS HERE---------------------------------------------------------
  const url1 = `https://api.spotify.com/v1/browse/categories?country=IN&limit=50&offindexet=0`;
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url1);

  xhr.setRequestHeader(
    "Authorization",
    "Bearer " + SPOTIFY_ACCESS_TOKEN
  );
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = () => {
    if (xhr.status === 200 && xhr.readyState === 4) {
      toggleLoader(false);
      var response = JSON.parse(xhr.responseText);

      var item = response.categories.items;

      let homeNav = document.createElement("nav");
      let homeStrong = document.createElement("strong");
      homeStrong.textContent = `# Home`;

      homeNav.setAttribute(
        "class",
        "bg-success bg-opacity-50 text-white container-fluid  p-5 fs-1 shadow-lg mb-5"
      );

      homeNav.setAttribute("id", "home-nav");

      cntent.appendChild(homeNav);
      homeNav.appendChild(homeStrong);

      var output = "";
      item.forEach((icons, index) => {
        output += `
            <div class="card bg-dark text-white ms-3 mb-5 rounded-4">
            
                <a  id="${index}" href='${escapeHTML(item[index].href)}'>
            
                    <img  id="cat-link" class= 'card-img shadow rounded-4' src="${escapeHTML(item[index].icons[0].url)}" alt="...">
            
                    <center>
                    <div class="card-img-overlay  "><br><br><br><br><br><br><br>
            
                        <span class="card- text-white h3">
            
                            ${escapeHTML(item[index].name)}
            
                        </span>
            
                    </div>
                    </center>
                </a>
            
            </div>
            
            `;
      });
      cntent.insertAdjacentHTML('beforeend', output);


      for (let n = 0; n < item.length; n++) {
        document.links.item(n).addEventListener("click", (e) => {
          e.preventDefault();
          toggleLoader(true);

          cntent.style.display = "none";

          ///---------------------------------MY SECOND API CALL STARTS FROM HERE----------------------------------------------------------------------
          var newUrl = `${
            document.links.item(n).href
          }/playlists/?country=IN&limit=50&offset=0`;
          const newXhr = new XMLHttpRequest();
          newXhr.open("GET", newUrl, true);

          newXhr.setRequestHeader(
            "Authorization",
            "Bearer " + SPOTIFY_ACCESS_TOKEN
          );
          newXhr.setRequestHeader("Accept", "application/json");
          newXhr.setRequestHeader("Content-Type", "application/json");

          newXhr.onreadystatechange = () => {
            if (newXhr.status === 200 && newXhr.readyState === 4) {
              toggleLoader(false);
              const newResponse = JSON.parse(newXhr.responseText);
              // self.importScripts('text-index.js')

              var playlists = newResponse.playlists.items;
              var catnav = document.createElement("nav");
              var strong = document.createElement("strong");
              strong.textContent = `# ${item[n].name}`;

              catnav.setAttribute(
                "class",
                " bg-success bg-opacity-50 text-white container-fluid  p-5 fs-1 shadow-lg mb-5"
              );
              catnav.setAttribute("id", "cat-nav");

              content.appendChild(catnav);
              catnav.appendChild(strong);

              var playOutput = "";
              playlists.forEach((playlist, playIndex) => {
                playOutput += `

                                        
                                        <div style="width: 200px"  class=" border-dark card bg-dark text-white shadow p-3 ms-3  mb-5">
                                            <a  id="playlist'${playIndex}'" style="text-decoration: none" href="${escapeHTML(playlist.href)}">
                                        
                                                <img  id="cat-link" class= 'card-img mb-4 shadow' src="${escapeHTML(playlist.images[0].url)}" alt="...">
                                                <div class=" row  text-secondary">
                                                    <p class=" fs-6 bg-dark  container- text-light text-wrap "> 
                                                        ${escapeHTML(playlist.name)}
                                                    </p>
                                        
                                                </div>
                                        
                                            </a>
                                        </div>
                                        
                                        
                                        `;
              });

              content.insertAdjacentHTML('beforeend', playOutput);

              for (let j = item.length; j < document.links.length; j++) {
                document.links.item(j).addEventListener("click", (e) => {
                  e.preventDefault();
                  toggleLoader(true);

                  content.style.display = "none";

                  ///--------------------------------------------MY THIRD API CALL STARTS FROM HERE----------------------------------------------

                  var newUrlPlay = `${document.links.item(j).href}`;
                  const playlistXhr = new XMLHttpRequest();
                  playlistXhr.open("GET", newUrlPlay, true);

                  playlistXhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + SPOTIFY_ACCESS_TOKEN
                  );
                  playlistXhr.setRequestHeader("Accept", "application/json");
                  playlistXhr.setRequestHeader(
                    "Content-Type",
                    "application/json"
                  );

                  playlistXhr.onreadystatechange = () => {
                    if (
                      playlistXhr.status === 200 &&
                      playlistXhr.readyState === 4
                    ) {
                      toggleLoader(false);
                      const playlistResponse = JSON.parse(
                        playlistXhr.responseText
                      );
                      // self.importScripts('text-index.js')

                      var tracksList = playlistResponse.tracks.items;
                      var playlistBar = `
                                                
                                                <nav id="playlist-nav" class="bg-warning bg-opacity-50 shadow-lg  container-fluid  d-flex text-truncate">
                                                    <div class=""><img id="play-img" class="row shadow-lg m-5 bg-warning " src="${escapeHTML(playlistResponse.images[0].url)}" alt="..."></img></div>
                                                    <div class=" mt-1 pt-4 ">
                                                        <div id="card" class="pt-5"><small id="playlist-card-title" class="">${escapeHTML(playlistResponse.type)}</small>
                                                            <h1 class="" id="playlist-title">${escapeHTML(playlistResponse.name)}</h1>
                                                            <p style="text-decoration: none">${escapeHTML(playlistResponse.description)}</p>
                                                            <div class="row card-footer"><a class="col-2 text-white mt-2"  href="${escapeHTML(playlistResponse.owner.external_urls.spotify)}">${escapeHTML(playlistResponse.owner.display_name)}</a><span class="col-2 mt-2">${playlistResponse.followers.total} likes</span><span class="col-2 mt-2 ms-5">${playlistResponse.tracks.items.length} songs</span></div>
                                                            </div>
                                                </nav>
                                                <div class="container-fluid pt-3 ">
                                                    <div class="">
                                                        <table class="table table-dark list-group-items  table table-borderless text-secondary ">
                                                            <thead><br>
                                                                <tr>
                                                                    <th id="playlist-hashtag" scope="col">#</th>
                                                                    <th id="title-head" scope="col">TITLE</th>
                                                                    <th  id="playlist-album" scope="col">ALBUM</th>
                                                                    <th  id="playlist-artists" scope="col">ARTISTS</th>
                                                                    <th  id="playlist-time" scope="col">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                                                                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                                                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                                                        </svg>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                    </div>
                                                </div>
                                                                `;

                      var tracksOutput = "";
                      tracksList.forEach((tracks, index) => {
                        var track = tracks.track;
                        var timeMin = Math.floor(
                          track.duration_ms / 1000 / 60
                        );
                        var sec = Math.floor(
                          (track.duration_ms / 1000) % 60
                        );
                        var timeSec = sec < 10 ? "0" + sec : sec;

                        var explicit = track.explicit
                            ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-explicit-fill" viewBox="0 0 16 16">
                                                <path d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0h-11Zm4.326 10.88H10.5V12h-5V4.002h5v1.12H6.826V7.4h3.457v1.073H6.826v2.408Z"/>
                                                </svg>`
                            : "";

                        tracksOutput += `
                                                
                                                        <div id="track-lister" class="container-fluid ">
                                                            <a style="text-decoration: none" href="${
                                                              escapeHTML(track.preview_url)
                                                            }">
                                                                <div style="tezt-decoration: none" >
                                                            
                                                                    <table class="table table-dark table-hover table-borderless text-secondary">
                                                                        <thead>       
                                                                            <tbody class=" text-secondary list-group-items">
                                                                                <tr>
                                                                                    <th id="song-num" scope="row" class="pt-4">${
                                                                                      index +
                                                                                      1
                                                                                    }</th>
                                                                                    <th class="d-flex pt-2 mb-3" id="div-tracks"  scope="rowgroup " ><div class=""><img id="song-img" class="img-overlay shadow-lg mb-2 " src="${
                                                                                      escapeHTML(track.album.images[0].url)
                                                                                    }"  alt=""></img><span class="pb-5 ms-3 mb-5">${explicit}</span><span id="list-tracks" class="col-2 ms-2">${
                          escapeHTML(track.name)
                        }</span></div> </th>
                                                                                    <th id="list-albums" class="pt-4"><div class"col-1 text-truncate" id="album-name">${
                                                                                      escapeHTML(track.album.name)
                                                                                    }</div></th>
                                                                                    <th id="list-artists" class="pt-4">${
                                                                                      escapeHTML(track.artists[0].name)
                                                                                    }</th>
                                                                                    <th id="list-time" class="pt-4">${
                                                                                      timeMin +
                                                                                      ":" +
                                                                                      timeSec
                                                                                    }</th>
                                                                                </tr>
                                                                            
                                                                            </tbody>
                                                                        </thead>
                                                                    </table>
                                                                
                                                                
                                                                
                                                                </div>
                                                            </a>
                                                        </div>
                                                                            
                                                        `;
                      });
                      grandCntent.insertAdjacentHTML('beforeend', playlistBar + tracksOutput);
                    }
                  };
                  playlistXhr.send();
                });
              }
            }
          };
          newXhr.send();
        });
      }
    }
  };
  xhr.send();
}

init();
