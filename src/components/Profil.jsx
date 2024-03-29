import React, { useEffect } from 'react'
import '../Profil.css'
function Profil() {

    useEffect(() =>{
        const target = {
            clicked: 0,
            currentFollowers: 90,
            btn: document.querySelector("a.btn"),
            fw: document.querySelector("span.followers")
          };
          
          const follow = () => {
            target.clicked += 1;
            target.btn.innerHTML = 'Following <i class="fas fa-user-times"></i>';
          
            if (target.clicked % 2 === 0) {
              target.currentFollowers -= 1;
              target.btn.innerHTML = 'Follow <i class="fas fa-user-plus"></i>';
            }
            else {
              target.currentFollowers += 1;
            }
          
            target.fw.textContent = target.currentFollowers;
            target.btn.classList.toggle("following");
          }
          
    },[]
    )
  return (
    <div class="card">
  <div class="ds-top"></div>
  <div class="avatar-holder">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1820405/profile/profile-512.jpg?1533058950" alt="Albert Einstein"/>
  </div>
  <div class="name">
    <a href="https://codepen.io/AlbertFeynman/" target="_blank">Albert Feynman</a>
    <h6 title="Followers"><i class="fas fa-users"></i> <span class="followers">90</span></h6>
  </div>
  <div class="button">
    <a href="#" class="btn" onmousedown="follow();">Follow <i class="fas fa-user-plus"></i></a>
  </div>
  <div class="ds-info">
    <div class="ds pens">
      <h6 title="Number of pens created by the user">Pens <i class="fas fa-edit"></i></h6>
      <p>29</p>
    </div>
    <div class="ds projects">
      <h6 title="Number of projects created by the user">Projects <i class="fas fa-project-diagram"></i></h6>
      <p>0</p>
    </div>
    <div class="ds posts">
      <h6 title="Number of posts">Posts <i class="fas fa-comments"></i></h6>
      <p>0</p>
    </div>
  </div>
  <div class="ds-skill">
    <h6>Skill <i class="fa fa-code" aria-hidden="true"></i></h6>
    <div class="skill html">
      <h6><i class="fab fa-html5"></i> HTML5 </h6>
      <div class="bar bar-html">
        <p>95%</p>
      </div>
    </div>
    <div class="skill css">
      <h6><i class="fab fa-css3-alt"></i> CSS3 </h6>
      <div class="bar bar-css">
        <p>90%</p>
      </div>
    </div>
    <div class="skill javascript">
      <h6><i class="fab fa-js"></i> JavaScript </h6>
      <div class="bar bar-js">
        <p>75%</p>
      </div>
    </div>
  </div>
</div>
  )
}

export default Profil