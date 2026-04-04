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
        }, { threshold: [0.1, 0.5, 0.8], rootMargin: "-15% 0px -25% 0px" });

        document.querySelectorAll('section[id], header[id]').forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    /*
        Mobile menu toggle logic
    */
    var navContainer = document.getElementById('main-nav');
    var menuToggle   = document.getElementById('menu-toggle');
    var navLinks     = document.getElementById('nav-links');

    if (menuToggle && navContainer) {
        menuToggle.addEventListener('click', function () {
            navContainer.classList.toggle('menu-open');
        });

        /* Close menu when a link is clicked */
        navLinks.addEventListener('click', function (e) {
            if (e.target.classList.contains('nav')) {
                navContainer.classList.remove('menu-open');
            }
        });

        /* Close menu when clicking outside */
        document.addEventListener('click', function (e) {
            if (!navContainer.contains(e.target)) {
                navContainer.classList.remove('menu-open');
            }
        });
    }

    /*
        Scroll Reveal Observer
    */
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
    });

    /*
        Dataset Simulator Logic
    */
    var simBtn = document.getElementById('run-sim');
    var simOutput = document.getElementById('sim-output');

    if (simBtn && simOutput) {
        var steps = [
            "> Importing pandas as pd...",
            "> Loading dataset.csv (144,021 rows)...",
            "> Checking for null values...",
            "> Found 12 missing values in 'Age' column.",
            "> Filling missing values with median...",
            "> Normalizing data structures...",
            "> Running correlation matrix...",
            "> DONE: Insights extracted successfully!",
            "-------------------------------------",
            "Result: 94.2% accuracy in prediction model."
        ];

        simBtn.addEventListener('click', function () {
            simBtn.disabled = true;
            simOutput.innerHTML = "";
            var i = 0;
            var interval = setInterval(function () {
                if (i < steps.length) {
                    simOutput.innerHTML += steps[i] + "\n";
                    simOutput.scrollTop = simOutput.scrollHeight;
                    i++;
                } else {
                    clearInterval(interval);
                    simBtn.disabled = false;
                }
            }, 600);
        });
    }

    /*
        Footer Year
    */
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

}());
