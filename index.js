/// ----------------------------------------MY FIRST API CALL STARTS HERE---------------------------------------------------------
const url1 = `https://api.spotify.com/v1/browse/categories?country=IN&limit=50&offindexet=0`
var xhr = new XMLHttpRequest()

xhr.open('GET', url1)

xhr.setRequestHeader('Authorization', 'Bearer BQB19O1ZkZkoZJXvPNJ6U7fxBCH2Qfa1Ae2GNwvzdKcYgu1pg3lHg9WVDEdh7CdI4f2OUj-J7H07JyNKpJ0')
xhr.setRequestHeader('Accept', 'application/json')
xhr.setRequestHeader('Content-Type', 'application/json')

xhr.onreadystatechange = () => 
{

    var output = ""

    if (xhr.status === 200 && xhr.readyState === 4) 
    {
        const response = JSON.parse(xhr.responseText)

        console.log(response)
        var item = response.categories.items
        // console.log(item)


        let homeNav = document.createElement('nav')
        let homeStrong = document.createElement('strong')
        homeStrong.textContent = `# Home`

        // homeNav.setAttribute('class', 'btn bg-success border-dark text-white container-fluid  p-5 fs-1 shadow-lg mb-5')

        homeNav.setAttribute('class', 'bg-success bg-opacity-50 text-white container-fluid  p-5 fs-1 shadow-lg mb-5')

        homeNav.setAttribute('id', 'home-nav')

        document.querySelector('#cntent').appendChild(homeNav)
        document.querySelector('#home-nav').appendChild(homeStrong)

        item.forEach((icons, index) => 
        {


            output += `
            <div class="card bg-dark text-white ms-3 mb-5 rounded-4">
            
                <a  id="${index}" href='${response.categories.items[index].href}'>
            
                    <img  id="cat-link" class= 'card-img shadow rounded-4' src="${response.categories.items[index].icons[0].url}"alt="...">
            
                    <center>
                    <div class="card-img-overlay  "><br><br><br><br><br><br><br>
            
                        <span class="card- text-white h3">
            
                            ${response.categories.items[index].name}
            
                        </span>
            
                    </div>
                    </center>
                </a>
            
            </div>
            
            `
        })
        document.querySelector('#cntent').innerHTML += output

        // console.dir(document.links)

        for (let n = 0; n < 50; n++) 
        {


            document.links.item(n).addEventListener('click', e => 
            {

                e.preventDefault()

                document.querySelector('#cntent').style.display = "none"

///---------------------------------MY SECOND API CALL STARTS FROM HERE----------------------------------------------------------------------
                var newUrl = `${document.links.item(n).href}/playlists/?country=IN&limit=50&offset=0`
                // console.log(newUrl)
                const newXhr = new XMLHttpRequest()
                newXhr.open('GET', newUrl, true)

                newXhr.setRequestHeader('Authorization', 'Bearer BQB19O1ZkZkoZJXvPNJ6U7fxBCH2Qfa1Ae2GNwvzdKcYgu1pg3lHg9WVDEdh7CdI4f2OUj-J7H07JyNKpJ0')
                newXhr.setRequestHeader('Accept', 'application/json')
                newXhr.setRequestHeader('Content-Type', 'application/json')

                newXhr.onreadystatechange = () => 
                {
                    var playOutput = "";
                    if (newXhr.status === 200 && newXhr.readyState === 4) 
                    {
                        const newResponse = JSON.parse(newXhr.responseText)
                        // self.importScripts('text-index.js')    
                        console.log(newResponse)

                        var item = newResponse.playlists.items
                        console.log(item)
                        var catnav = document.createElement('nav')
                        var strong = document.createElement('strong')
                        strong.textContent = `# ${response.categories.items[n].name}`

                        // <div class="shadow-lg p-3 mb-5 bg-body rounded">Larger shadow</div>

                        catnav.setAttribute('class', ' bg-success bg-opacity-50 text-white container-fluid  p-5 fs-1 shadow-lg mb-5')
                        catnav.setAttribute('id', 'cat-nav')

                        document.querySelector('#content').appendChild(catnav)
                        document.querySelector('#cat-nav').appendChild(strong)

                        newResponse.playlists.items.forEach((playlist, playIndex) => 
                        {

                            playOutput = `

                                        
                                        <div style="width: 200px"  class=" border-dark card bg-dark text-white shadow p-3 ms-3  mb-5">
                                            <a  id="playlist'${playIndex}'" style="text-decoration: none" href=${newResponse.playlists.items[playIndex].href}>
                                        
                                                <img  id="cat-link" class= 'card-img mb-4 shadow' src="${newResponse.playlists.items[playIndex].images[0].url}" alt="...">
                                                <div class=" row  text-secondary">
                                                    <p class=" fs-6 bg-dark  container- text-light text-wrap "> 
                                                        ${newResponse.playlists.items[playIndex].name}
                                                    </p>
                                        
                                                </div>
                                        
                                            </a>
                                        </div>
                                        
                                        
                                        `

                            document.querySelector('#content').innerHTML += playOutput

                            // console.dir(document.links)
                            for (let j = 50; j < document.links.length; j++) 
                            {
                                // console.log(j)
                                document.links.item(j).addEventListener('click', e => 
                                {
                                    // --------------------------------------   // homeNav.setAttribute('style', 'height: 12%') playlist header  ----------------------------------------------------------------------------------------                            
                                    e.preventDefault()

                                    document.querySelector('#content').style.display = "none"

                                    ///--------------------------------------------MY THIRD API CALL STARTS FROM HERE----------------------------------------------

                                    var newUrlPlay = `${document.links.item(j).href}`
                                    const playlistXhr = new XMLHttpRequest()
                                    playlistXhr.open('GET', newUrlPlay, true)

                                    playlistXhr.setRequestHeader('Authorization', 'Bearer BQB19O1ZkZkoZJXvPNJ6U7fxBCH2Qfa1Ae2GNwvzdKcYgu1pg3lHg9WVDEdh7CdI4f2OUj-J7H07JyNKpJ0')
                                    playlistXhr.setRequestHeader('Accept', 'application/json')
                                    playlistXhr.setRequestHeader('Content-Type', 'application/json')

                                    playlistXhr.onreadystatechange = (index) => 
                                    {
                                        var playlistsOutput = "";
                                        if (playlistXhr.status === 200 && playlistXhr.readyState === 4) 
                                        {
                                            const playlistResponse = JSON.parse(playlistXhr.responseText)
                                            // self.importScripts('text-index.js')    
                                            console.log(playlistResponse)

                                            var tracksList = playlistResponse.tracks.items
                                            console.log(tracksList)
                                            var playlistBar = ''

                                            playlistBar = `
                                                
                                                <nav id="playlist-nav" class="bg-warning bg-opacity-50 shadow container-fluid  d-flex text-truncate p-5">
                                                    <div class=""><img id="play-img" class="row shadow-lg bg-warning " src="${playlistResponse.images[0].url}" alt="..."></img></div>
                                                    <div class=" mt-1 ms-5 ">
                                                        <div id="card" class="pt-5"><small id="playlist-card-title" class="">${playlistResponse.type}</small>
                                                            <h1 class="" id="playlist-title">${playlistResponse.name}</h1>
                                                            <p style="text-decoration: none">${playlistResponse.description}</p>
                                                            <div class="row card-footer"><a class="col-2 text-white mt-2"  href="${playlistResponse.owner.external_urls.spotify}">${playlistResponse.owner.display_name}</a><span class="col-2 mt-2">${playlistResponse.followers.total} likes</span><span class="col-2 mt-2 ms-5">${playlistResponse.tracks.items.length} songs</span></div>
                                                            </div>
                                                </nav>
                                                <div class="container-fluid">
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
                                                                `
                                            // console.log(index);
                                            document.querySelector('#grand-cntent').innerHTML += playlistBar

                                            var tracksOutput = ""
                                            playlistResponse.tracks.items.forEach((tracks, index) => 
                                            {


                                                var timeMin = Math.floor(playlistResponse.tracks.items[index].track.duration_ms / 1000 / 60)
                                                var sec = Math.floor((playlistResponse.tracks.items[index].track.duration_ms / 1000) % 60)
                                                var timeSec = (sec < 10) ? (sec + '0') : sec;


                                                var checkExplicit = playlistResponse.tracks.items[index].track.explicit
                                                var explicit = (checkExplicit == true) ? (`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-explicit-fill" viewBox="0 0 16 16">
                                                <path d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0h-11Zm4.326 10.88H10.5V12h-5V4.002h5v1.12H6.826V7.4h3.457v1.073H6.826v2.408Z"/>
                                                </svg>`) : '';


                                                

                                                tracksOutput = `
                                                
                                                        <div id="track-lister" class="container-fluid ">
                                                            <a style="text-decoration: none" href="${playlistResponse.tracks.items[index].track.preview_url}">
                                                                <div style="tezt-decoration: none" >
                                                            
                                                                    <table class="table table-dark table-hover table-borderless text-secondary">
                                                                        <thead>       
                                                                            <tbody class=" text-secondary list-group-items">
                                                                                <tr>
                                                                                    <th id="song-num" scope="row" class="pt-4">${index + 1}</th>
                                                                                    <th class="d-flex pt-2 mb-3" id="div-tracks"  scope="rowgroup " ><div class=""><img id="song-img" class="img-overlay shadow-lg mb-2 " src="${playlistResponse.tracks.items[index].track.album.images[0].url}"  alt=""></img><span class="pb-5 ms-3 mb-5">${explicit}</span><span id="list-tracks" class="col-2 ms-2">${playlistResponse.tracks.items[index].track.name}</span></div> </th>
                                                                                    <th id="list-albums" class="pt-4"><div class"col-1 text-truncate" id="album-name">${playlistResponse.tracks.items[index].track.album.name}</div></th>
                                                                                    <th id="list-artists" class="pt-4">${playlistResponse.tracks.items[index].track.artists[0].name}</th>
                                                                                    <th id="list-time" class="pt-4">${timeMin + ':' + timeSec}</th>
                                                                                </tr>
                                                                            
                                                                            </tbody>
                                                                        </thead>
                                                                    </table>
                                                                
                                                                
                                                                
                                                                </div>
                                                            </a>
                                                        </div>
                                                                            
                                                        `
                                                document.querySelector('#grand-cntent').innerHTML += tracksOutput
                                            })

                                       
                                        }

                                    }
                                    playlistXhr.send()
                                })

                            }


                        
                            
                        })
                        
                        
                    }
                }
                newXhr.send()
            })
        }

    }


}
xhr.send()
