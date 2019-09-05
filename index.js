/*jshint esversion: 2015 */

function GenBar(){
    
  var ins= `  
  <div class="titlebar">
    <h1 class="titletext">Matt J McGuire</h1>
    <a href="tetris.html" target="_blank"><img style="position: absolute;right:10px;top:70px;" src="source/brix.gif" /></a>
  </div>

  <div class="container-big">
    <div class="menu-bar">
      <div class="menudropdown menuleft">
        <img class="aligncenters" src="source/m.png" />
        <div class="menudropdown-content dc-left">
          <a class="xa" href="index.html"><label><img class="aligncenters imagepadright" src="source/upfront.png"/>Upfront</label></a>
          <a class="xa" href="about.html"><label><img class="aligncenters imagepadright" src="source/about.png"/>About</label></a>
          <a class="xa" href="Projects.html"><label><img class="aligncenters imagepadright" src="source/projects.png"/>Personal software projects</label></a>
          <a class="xa" href="Other.html"><label><img class="aligncenters imagepadright" src="source/other.png"/>Other interests</label></a>
        </div>
      </div>
    </div>
    `;
    var bod =document.getElementById('toolbar');
    bod.innerHTML = ins;


}