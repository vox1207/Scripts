// ==/UserScript==

(function () {
  "use strict";
  const isMobile=/(Android|iPhone|iPad)/i.test(navigator.userAgent);
    const isZhuanlan= location.host.startsWith('zhuanlan');
    const isLogined=false;
  //登录弹窗屏蔽功能
  {
      let flag=false,timer=null;
      new MutationObserver((events,observer)=>events.forEach((e)=>e.addedNodes.forEach((target)=>{
        if (!flag
            &&target.getElementsByClassName
            &&target.getElementsByClassName("signFlowModal").length !== 0
        ) {
          target.style.display='none';
          setTimeout(
            () =>{
                document.body.style=null;
                document.querySelector('html').style.overflow='auto';
                target.getElementsByClassName("Modal-backdrop")[0].click();
                target.remove();
            },
            0
          );
        }
        flag=false;


      }))).observe(document,{childList:true,subtree:true});
      document.addEventListener('click',()=>{
        timer&&clearTimeout(timer);
        [flag,timer]=[true,null];
        timer=setTimeout(()=>flag=false,1000);
      })
  } //END
