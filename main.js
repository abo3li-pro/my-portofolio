/*
    main.js
    ────────────────────────────────────────────────────────────
    Loaded with defer so it never blocks rendering.
    The browser runs this after the HTML is fully parsed,
    which means the DOM is ready — no DOMContentLoaded
    listener needed.

    This file does two things:
      1. Hides the nav when scrolling down, shows it on the way up.
      2. Highlights the nav link for whichever section is on screen.
    ────────────────────────────────────────────────────────────
*/

(function () {
    'use strict';

    var nav       = document.querySelector('nav');
    var lastScroll = 0;
    var ticking    = false;

    /*
        requestAnimationFrame throttling means this
        only runs once per frame (60fps max) no matter
        how fast the user scrolls — keeps the main
        thread free and the page smooth.
    */
    function updateNavVisibility() {
        var current = window.scrollY;

        if (current > lastScroll && current > 80) {
            /* Scrolling down — slide the nav up and out */
            nav.style.opacity       = '0';
            nav.style.pointerEvents = 'none';
            nav.style.transform     = 'translateX(-50%) translateY(-6px)';
        } else {
            /* Scrolling up (or near the top) — bring it back */
            nav.style.opacity       = '1';
            nav.style.pointerEvents = '';
            nav.style.transform     = 'translateX(-50%) translateY(0)';
        }

        lastScroll = Math.max(0, current);
        ticking    = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateNavVisibility);
            ticking = true;
        }
    }, { passive: true }); /* passive: true lets the browser scroll without waiting */


    /*
        IntersectionObserver watches which section is currently
        in the viewport and colours the matching nav link.
        rootMargin shrinks the "active zone" to the middle
        third of the screen so only one section is active
        at a time.
    */
    if ('IntersectionObserver' in window) {

        var navLinks = document.querySelectorAll('.nav');

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (link) {
                        var isActive = link.getAttribute('href') === '#' + entry.target.id;
                        link.style.color = isActive ? 'var(--accent-color)' : '';
                    });
                }
            });
        }, { rootMargin: '-35% 0px -60% 0px' });

        document.querySelectorAll('section[id], header[id]').forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

}());
