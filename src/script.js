

// const work_btn = document.getElementById("work_btn");

 







// loading
window.addEventListener("load", function () {
  setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  }, 10); // 10 detik (10.000 milidetik)
});
//

let xPos = 0;
const ring = document.querySelector("#ring");
const total = document.querySelectorAll(".img").length;


gsap
  .timeline()
  .set(dragger, { opacity: 0 }) //make the drag layer invisible
  .set(ring, { rotationY: 180 }) //set initial rotationY so the parallax jump happens off screen
  .set(".img", {
    rotateY: (i) => i * -30,
    transformOrigin: "50% 50% 1000px",
    z: -1000,
    backfaceVisibility: "hidden"
  })


  .from(".img", {
    duration: 1.5,
    y: 200,
    opacity: 0,
    stagger: 0.1,
    ease: "expo"
  });

Draggable.create(dragger, {
  onDragStart: (e) => {
    if (e.touches) e.clientX = e.touches[0].clientX;
    xPos = Math.round(e.clientX);
  },

  onDrag: (e) => {
    if (e.touches) e.clientX = e.touches[0].clientX;

    gsap.to(ring, {
      rotationY: "-=" + ((Math.round(e.clientX) - xPos) % 360),
      onUpdate: () => {
        gsap.set(".img", { backgroundPosition: (i) => getBgPos(i) });
      }
    });

    xPos = Math.round(e.clientX);
  },

  onDragEnd: () => {
    // gsap.to(ring, { rotationY: Math.round(gsap.getProperty(ring,'rotationY')/36)*36 }) // move to nearest photo...at the expense of the inertia effect
    gsap.set(dragger, { x: 0, y: 0 }); // reset drag layer
  }
});

function getBgPos(i) {
  //returns the background-position string to create parallax movement in each image
  return (
    (-gsap.utils.wrap(
      0,
      360,
      gsap.getProperty(ring, "rotationY") - 180 - i * 36
    ) /
      360) *
    400 +
    "px 0px"
  );
}

/* scroll looping kanan ke kiri */

