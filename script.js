//local initialisation 
  let currentSongs= new Audio();
  let songs=[];
  let currFolder;
  //for converting duration in the minute firm from second
function secondsToMinutesSeconds (seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

//function fir fetching songs
async function getSongs(folder){
  currFolder = folder;
  let a = await fetch(`/${currFolder}/`)
  let response = await a.text();
  
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
 songs = []
  for(let i =0 ; i<as.length;i++){
    const element = as[i]
    if(element.href.endsWith("mp3")){
      songs.push(element.href.split(`/${currFolder}/`)[1])
    }
  }

  //this work to display song list in libraray
  let songUl=document.querySelector(".Songlist").getElementsByTagName("ul")[0]
  songUl.innerHTML="";
  for(const song of songs){
 songUl.innerHTML = songUl.innerHTML +`<li>
							<img class="invert" src="image/music.svg" alt="">
							<div class="info"><div>${song.split("%20")}</div>
							<div>Anon</div>
							</div>
							<div class="playnow">
								<span>Play Now</span>
							<img class="invert" src="image/play.svg" alt="">
							</div>
						</li>`
  
  }
  
  //play the clicked music in library
  Array.from(document.querySelector(".Songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
});

return songs;
}

//function for controling music play simulation 
const playMusic=(track,pause=false)=>{
  currentSongs.src =`/${currFolder}/`+ track;
  if(!pause){
  currentSongs.play();
  play.src = "image/pause.svg";
  }
  document.querySelector(".song-info").innerHTML=decodeURI(track);
  document.querySelector(".song-time").innerHTML ="00:00/00:00";
  
};
//display all the albums on the page
async function displayAlbums() {
let a = await fetch("/songs/")
let response = await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let anchors=div.getElementsByTagName("a")
let card_container = document.querySelector(".card-container");

let array = Array.from(anchors)
for (let index = 0; index < array.length; index++){
  // Tab to edit
  const e =array[index];

if(e.href.includes("/songs")){
let folder = e.href.split("/").slice(-2)[0]
//get the meta-data of the folder 
let a = await fetch(`/songs/${folder}/info.json`)
let response = await a.json();
console.log(response)
card_container.innerHTML = card_container.innerHTML+`<div data-folder="${folder}" class="card">
						<div class="play">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M15 6L9.70711 11.2929C9.37377 11.6262 9.20711 11.7929 9.20711 12C9.20711 12.2071 9.37377 12.3738 9.70711 12.7071L15 18"
									stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</div>
						<img src="songs/${folder}/cover.jpg" alt="Happy Hits Playlist">
						<h2>${response.title}</h2>
						<p>${response.description}</p>bhi
					</div>`
}

}

//function for listening clicked playlist 
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click",async item=>{
    console.log(item, item.currentTarget.dataset)
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    playMusic(songs[0])
    
  })
})

}
//this is main function which include to much main function  in it
async function main(){

await getSongs("songs/ncs")
playMusic(songs[0],true)


displayAlbums();
 //change the music to the previ6
  previous.addEventListener("click",()=>{
    console.log("previous clicked")
    console.log(currentSongs.src)
    currentSongs.paused;
  let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
   if((index-1)>=0){
     playMusic(songs[index-1]);
   }
 });
 //function for play or pause the song
 play.addEventListener("click",()=>{
  console.log("play clicked")
   if(currentSongs.paused){
     currentSongs.play()
     play.src = "image/pause.svg";
   }
   else{
     currentSongs.pause()
     play.src = "image/play.svg";
   }
 });
 //function for changes the song next
 next.addEventListener("click",()=>{
   currentSongs.paused;
   console.log("next clicked")
  let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
   if((index+1)<songs.length){
     playMusic(songs[index+1]);
   }
 });
//function to update in time of songs in playbar
 currentSongs.addEventListener("timeupdate",()=>{
   
   document.querySelector(".song-time").innerHTML=`${secondsToMinutesSeconds(currentSongs.currentTime)}  /  ${secondsToMinutesSeconds(currentSongs.duration)}`
   document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.duration)*100 + "%";
 })
 
 
// function for making seekbar functionql
 document.querySelector(".seekbar").addEventListener("click",e=>{
   let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
   document.querySelector(".circle").style.left =percent+"%";
   currentSongs.currentTime= ((currentSongs.duration)*percent)/100
 })
 
 //function for making hamburger functional
 document.querySelector(".hamburger").addEventListener("click",()=>{
   document.querySelector(".left").style.left = "0"
 })
 
 
//function fir making close functional
 document.querySelector(".close").addEventListener("click",()=>{
   document.querySelector(".left").style.left = "-120%"
 })
 


//fuction for changing value with the input range
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  console.log("setting volume to", e.target.value, "/100")
  currentSongs.volume=parseInt(e.target.value)/100
})



//function for muting sound 
document.querySelector(".volume>img").addEventListener("click",e=>{
  if(e.target.src.includes("volume.svg")){
    
    e.target.src = e.target.src.replace("volume.svg","mute.svg")
    console.log("changing" + e.target.src)
    currentSongs.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value =0;
    
  }
  else{
    
    e.target.src = e.target.src.replace("mute.svg","volume.svg")
    console.log("changing"+e.target.src)
    currentSongs.volume = 0.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value =10;
    
  }
})

}
main()
