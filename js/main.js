(()=> {
    const btn=document.querySelector('.nav-toggle'),links=document.querySelector('.nav-links');
    if(btn&&links) {
        btn.addEventListener('click',()=>links.classList.toggle('open'));
        links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')))
    }
    const slides=[...document.querySelectorAll('.slide')],dots=[...document.querySelectorAll('.slider-dot')];
    let i=0,t;
    const show=n=> {
        if(!slides.length)return;
        i=(n+slides.length)%slides.length;
        slides.forEach((s,x)=>s.classList.toggle('active',x===i));
        dots.forEach((d,x)=>d.classList.toggle('active',x===i))
    }
    ,auto=()=> {
        clearInterval(t);
        t=setInterval(()=>show(i+1),5500)
    }
    ;
    document.querySelector('.slider-next')?.addEventListener('click',()=> {
        show(i+1);
        auto()
    }
    );
    document.querySelector('.slider-prev')?.addEventListener('click',()=> {
        show(i-1);
        auto()
    }
    );
    dots.forEach((d,x)=>d.addEventListener('click',()=> {
        show(x);
        auto()
    }
    ));
    if(slides.length) {
        show(0);
        auto()
    }
    const form=document.getElementById('contactForm'),status=document.querySelector('.form-status');
    if(form) {
        form.addEventListener('submit',async e=> {
            e.preventDefault();
            if(status)status.textContent='Sending...';
            const data=new FormData(form);
            try {
                const res=await fetch('mail/contact.php', {
                    method:'POST',body:data
                }
                );
                const json=await res.json();
                if(!res.ok||!json.ok)throw new Error();
                if(status)status.textContent='Thank you. Your enquiry has been sent.';
                form.reset()
            }
            catch(err) {
                if(status)status.textContent='Please email admin@lyttonconstruction.co.zw or call +263 77 305 6593.'
            }
        }
        )
    }

    // Project gallery lightbox with zoom and pan
    const lightbox=document.getElementById('projectLightbox');
    if(lightbox) {
        const lbImage=document.getElementById('lightboxImage');
        const lbTitle=document.getElementById('lightboxTitle');
        const lbZoom=document.getElementById('lightboxZoom');
        const lbStage=document.getElementById('lightboxStage');
        const projectImages=[...document.querySelectorAll('.project-zoom-image')];
        let scale=1, x=0, y=0, dragging=false, startX=0, startY=0;

        const applyTransform=()=> {
            lbImage.style.transform=`translate(${x}px, ${y}px) scale(${scale})`;
            lbZoom.textContent=`${Math.round(scale*100)}%`;
            lbStage.style.cursor=scale>1?(dragging?'grabbing':'grab'):'default';
        };
        const resetZoom=()=> { scale=1; x=0; y=0; applyTransform(); };
        const setZoom=next=> {
            scale=Math.min(4,Math.max(0.5,next));
            if(scale<=1){x=0;y=0;}
            applyTransform();
        };
        const openLightbox=img=> {
            lbImage.src=img.src;
            lbImage.alt=img.alt||'Project image';
            lbTitle.textContent=img.dataset.title||img.alt||'Project image';
            resetZoom();
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden','false');
            document.body.classList.add('lightbox-open');
            lightbox.querySelector('[data-action="close"]')?.focus();
        };
        const closeLightbox=()=> {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden','true');
            document.body.classList.remove('lightbox-open');
            dragging=false;
        };

        projectImages.forEach(img=> {
            img.addEventListener('click',()=>openLightbox(img));
            img.addEventListener('keydown',e=> {
                if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(img);}
            });
        });

        lightbox.addEventListener('click',e=> {
            const action=e.target.closest('[data-action]')?.dataset.action;
            if(action==='zoom-in')setZoom(scale+0.25);
            if(action==='zoom-out')setZoom(scale-0.25);
            if(action==='reset')resetZoom();
            if(action==='close')closeLightbox();
        });
        lightbox.addEventListener('wheel',e=> {
            if(!lightbox.classList.contains('open'))return;
            e.preventDefault();
            setZoom(scale+(e.deltaY<0?0.2:-0.2));
        },{passive:false});
        lbStage.addEventListener('pointerdown',e=> {
            if(scale<=1)return;
            dragging=true; startX=e.clientX-x; startY=e.clientY-y;
            lbStage.setPointerCapture(e.pointerId); applyTransform();
        });
        lbStage.addEventListener('pointermove',e=> {
            if(!dragging)return;
            x=e.clientX-startX; y=e.clientY-startY; applyTransform();
        });
        const stopDrag=e=> {
            if(!dragging)return;
            dragging=false;
            try{lbStage.releasePointerCapture(e.pointerId)}catch(_){}
            applyTransform();
        };
        lbStage.addEventListener('pointerup',stopDrag);
        lbStage.addEventListener('pointercancel',stopDrag);
        lbStage.addEventListener('dblclick',()=>setZoom(scale===1?2:1));
        document.addEventListener('keydown',e=> {
            if(!lightbox.classList.contains('open'))return;
            if(e.key==='Escape')closeLightbox();
            if(e.key==='+'||e.key==='=')setZoom(scale+0.25);
            if(e.key==='-')setZoom(scale-0.25);
            if(e.key==='0')resetZoom();
        });
    }

}
)();
