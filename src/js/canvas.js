import "../sass/style.scss";
import "imports-loader?define=>false!animation.gsap";
import "imports-loader?define=>false!debug.addIndicators";
import Barba from "barba.js";
import { TweenMax, TimelineMax, Power4 } from "gsap"; // Also works with TweenLite and TimelineLite
import * as ScrollMagic from "scrollmagic"; // Or use scrollmagic-with-ssr to avoid server rendering problems

var controller = new ScrollMagic.Controller();
var tl = new TimelineMax({});

tl.staggerFrom(".hide", 1.5, { y: "300%", ease: Power4.easeOut }, 0.15);

var FadeTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise.all([this.newContainerLoading, this.fadeOut()]).then(
      this.fadeIn.bind(this)
    );
  },

  fadeOut: function() {
    var oldWrap = this.oldContainer;
    oldWrap.classList.toggle("fade-out");

    // return new Promise(function(resolve, reject) {
    //   window.setTimeout(function() {
    //     resolve();
    //   }, 100);
    // });

    var transitionPromise = new Promise(function(resolve) {
      var outTrans = new TimelineMax();
      outTrans
        .set(".wipers", { display: "flex" })
        .to(".hide", 0.5, { opacity: 0 })
        .to(".green", 0.5, { height: "100%" })
        .to(".yellow", 0.5, { height: "100%" }, "-=.6")
        .to(".red", 0.5, { height: "100%" }, "-=.5")
        .to(".blue", 0.5, { height: "100%" }, "-=.4")
        .to(".orange", 0.5, { height: "100%" }, "-=.3")
        .to(
          ".pink",
          0.5,
          {
            height: "100%",
            onComplete: function() {
              resolve();
            }
          },
          "-=.2"
        );
    });
    return transitionPromise;
  },
  fadeIn: function() {
    var newWrap = this.newContainer;
    var inTrans = new TimelineMax();
    inTrans

      .to(".green", 0.5, { height: "0%" })
      .to(".yellow", 0.5, { height: "0%" }, "-=.6")
      .to(".red", 0.5, { height: "0%" }, "-=.5")
      .to(".blue", 0.5, { height: "0%" }, "-=.4")
      .to(".orange", 0.5, { height: "0%" }, "-=.3")
      .to(".pink", 0.5, { height: "0%" }, "-=.2")
      .set(".wipers", {
        display: "none"
      })
      .staggerFrom(
        ".hide",
        0.5,
        { opacity: 1, y: "300%", ease: Power4.easeOut },
        0.15
      );
    newWrap.classList.toggle("fade-in");
    window.scrollTo(0, 0);
    this.done();
  }
});

Barba.Pjax.getTransition = function() {
  // var tl = new TimelineMax();
  // tl.to(".screen-wipe-top", 0.9, { y: "50%", repeat: 1, yoyo: true });
  // tl.to(
  //   ".screen-wipe-bottom",
  //   0.9,
  //   { y: "-50%", repeat: 1, yoyo: true },
  //   "-=1.8"
  // );

  return FadeTransition;
};

//Please note, the DOM should be ready
Barba.Pjax.start();
